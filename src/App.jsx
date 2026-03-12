import { useState, useCallback, useEffect, useRef } from "react";
import { parseVocabFile } from "./vocab/parser";
import { loadStorage, saveStorage } from "./lib/storage";
import { BUNDLED_FILES } from "./constants";
import { css } from "./styles";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TypeFilters from "./components/TypeFilters";
import CardsView from "./components/views/CardsView";
import ListView from "./components/views/ListView";
import QuizView from "./components/views/QuizView";
import ManageView from "./components/views/ManageView";

const REMOTE_PROTOCOLS = new Set(["http:", "https:"]);

const normalizeStoredUrls = (urls) => {
  if (!Array.isArray(urls)) return [];
  return Array.from(new Set(urls.map(url => String(url || "").trim()).filter(Boolean)));
};

const hashString = (value = "") => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const sanitizeFilenamePart = (value, fallback = "remote") => {
  const safe = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return safe || fallback;
};

const splitFilename = (filename = "") => {
  const cleaned = sanitizeFilenamePart(filename, "remote.vocab");
  const dot = cleaned.lastIndexOf(".");
  if (dot <= 0 || dot === cleaned.length - 1) return { base: cleaned, ext: ".vocab" };
  return { base: cleaned.slice(0, dot), ext: cleaned.slice(dot) };
};

const buildRemoteFilename = (rawName, suffix) => {
  const { base, ext } = splitFilename(rawName);
  return `${sanitizeFilenamePart(base, "remote")}__${sanitizeFilenamePart(suffix, "url")}${ext}`;
};

const getFilenameFromUrl = (rawUrl) => {
  try {
    const parsed = new URL(rawUrl);
    const seg = parsed.pathname.split("/").filter(Boolean).pop();
    if (!seg) return "remote.vocab";
    return decodeURIComponent(seg);
  } catch {
    return "remote.vocab";
  }
};

const normalizeRemoteTarget = (rawUrl = "") => {
  const trimmed = String(rawUrl || "").trim();
  if (!trimmed) throw new Error("Please enter a URL");

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Invalid URL format");
  }

  if (!REMOTE_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("Only http/https URLs are supported");
  }

  const host = parsed.hostname.toLowerCase();

  if (host === "gist.github.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    const gistId = (parts.length >= 2 ? parts[1] : parts[0] || "").replace(/\.git$/i, "");
    if (!gistId) throw new Error("Cannot detect Gist ID from URL");
    const canonicalUrl = parts.length >= 2
      ? `https://gist.github.com/${parts[0]}/${gistId}`
      : `https://gist.github.com/${gistId}`;
    return { type: "gist", url: canonicalUrl, gistId };
  }

  if (host === "github.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 5 && parts[2] === "blob") {
      const rawUrlFromBlob = `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${parts[3]}/${parts.slice(4).join("/")}`;
      return { type: "raw", url: rawUrlFromBlob };
    }
  }

  return { type: "raw", url: parsed.toString() };
};

const fetchRemoteText = async (url) => {
  const res = await fetch(url, {
    headers: { Accept: "text/plain, text/*;q=0.9, */*;q=0.8" },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.text();
};

export default function VocabApp() {
  const [initialData] = useState(() => {
    const stored = loadStorage();
    const uf = stored.userFiles || {};
    const st = stored.starred || {};
    const remoteUrls = normalizeStoredUrls(stored.remoteUrls);
    const allRaw = { ...BUNDLED_FILES, ...uf };
    const parsed = {};
    for (const [fn, content] of Object.entries(allRaw)) {
      parsed[fn] = parseVocabFile(content, fn);
    }
    return { parsed, uf, st, remoteUrls };
  });

  const [files, setFiles] = useState(initialData.parsed);
  const [userFiles, setUserFiles] = useState(initialData.uf);
  const [sessionRemoteFiles, setSessionRemoteFiles] = useState({});
  const [activeKey, setActiveKey] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [view, setView] = useState("cards");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterGrammar, setFilterGrammar] = useState("all");
  const [flipped, setFlipped] = useState({});
  const [starred, setStarred] = useState(initialData.st);
  const [savedRemoteUrls, setSavedRemoteUrls] = useState(initialData.remoteUrls);
  const [remoteUrlInput, setRemoteUrlInput] = useState("");
  const [rememberRemoteUrl, setRememberRemoteUrl] = useState(true);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [quizState, setQuizState] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef();
  const hasAutoLoadedRemoteRef = useRef(false);
  const importRemoteUrlRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const persistStorage = useCallback((uf = userFiles, st = starred, urls = savedRemoteUrls) => {
    saveStorage({ userFiles: uf, starred: st, remoteUrls: urls });
  }, [savedRemoteUrls, starred, userFiles]);

  const normalizeTopicKey = (topic = "") => topic.trim().toLowerCase() || "__uncategorized__";
  const getTopicLabel = (topic = "") => topic.trim() || "Uncategorized";
  const normalizeSubtopicKey = (subtopic = "") => subtopic.trim().toLowerCase() || "__general__";
  const getSubtopicLabel = (subtopic = "") => subtopic.trim() || "General";

  const groupedByTopic = (() => {
    const groups = {};
    for (const f of Object.values(files)) {
      for (const w of f.words) {
        const key = normalizeTopicKey(w.topic || "");
        if (!groups[key]) groups[key] = { title: getTopicLabel(w.topic || ""), words: [] };
        groups[key].words.push(w);
      }
    }

    return Object.fromEntries(
      Object.entries(groups).sort(([, a], [, b]) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }))
    );
  })();

  const allWordsUniverse = Object.values(files).flatMap(f => f.words);

  const activeWords = (() => {
    if (activeSource && files[activeSource]) return files[activeSource].words;
    if (!activeKey) return Object.values(groupedByTopic).flatMap(g => g.words);
    return groupedByTopic[activeKey]?.words || [];
  })();

  const filteredWords = activeWords.filter(w => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || w.en.toLowerCase().includes(q)
      || (w.meaningEn || "").toLowerCase().includes(q)
      || (w.meaningVi || "").toLowerCase().includes(q)
      || w.type.toLowerCase().includes(q)
      || (w.grammar || "").toLowerCase().includes(q)
      || (w.topic || "").toLowerCase().includes(q)
      || (w.subtopic || "").toLowerCase().includes(q);
    const matchType = filterType === "all" || w.type.toLowerCase() === filterType;
    const matchGrammar = filterGrammar === "all" || (w.grammar || "").toLowerCase() === filterGrammar;
    return matchSearch && matchType && matchGrammar;
  });

  const groupedForDisplay = (() => {
    const groups = {};
    for (const w of filteredWords) {
      const topicKey = normalizeTopicKey(w.topic || "");
      const subtopicKey = normalizeSubtopicKey(w.subtopic || "");
      const key = activeKey ? subtopicKey : `${topicKey}::${subtopicKey}`;
      if (!groups[key]) {
        const topicLabel = getTopicLabel(w.topic || "");
        const subtopicLabel = getSubtopicLabel(w.subtopic || "");
        groups[key] = {
          key,
          title: activeKey ? subtopicLabel : `${topicLabel} / ${subtopicLabel}`,
          words: [],
        };
      }
      groups[key].words.push(w);
    }

    return Object.values(groups).sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
  })();

  const allTypes = [...new Set(activeWords.map(w => w.type.toLowerCase()))].sort();
  const allGrammars = [...new Set(activeWords.map(w => (w.grammar || "").toLowerCase()).filter(Boolean))].sort();
  const quizCandidates = activeWords
    .filter(w => filterType === "all" || w.type.toLowerCase() === filterType)
    .filter(w => filterGrammar === "all" || (w.grammar || "").toLowerCase() === filterGrammar)
    .filter(w => w.meaningVi);

  const resetBrowseState = () => {
    setSearch("");
    setFilterType("all");
    setFilterGrammar("all");
  };

  const importRemoteUrl = useCallback(async (rawUrl, { saveUrl = false, silent = false } = {}) => {
    const target = normalizeRemoteTarget(rawUrl);
    let fetchedFiles = [];

    if (target.type === "gist") {
      const gistRes = await fetch(`https://api.github.com/gists/${target.gistId}`, {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (!gistRes.ok) throw new Error(`Cannot load Gist (${gistRes.status})`);

      const gistPayload = await gistRes.json();
      const gistFiles = Object.values(gistPayload.files || {});
      if (!gistFiles.length) throw new Error("This Gist does not contain any files");

      const fetched = await Promise.all(gistFiles.map(async (gistFile) => {
        if (!gistFile || !gistFile.filename) return null;

        let content = typeof gistFile.content === "string" ? gistFile.content : "";
        if ((!content || gistFile.truncated) && gistFile.raw_url) {
          content = await fetchRemoteText(gistFile.raw_url);
        }

        return {
          rawName: gistFile.filename,
          content,
          suffix: `gist_${target.gistId}`,
        };
      }));

      fetchedFiles = fetched.filter(Boolean);
    } else {
      const content = await fetchRemoteText(target.url);
      fetchedFiles = [{
        rawName: getFilenameFromUrl(target.url),
        content,
        suffix: `url_${hashString(target.url)}`,
      }];
    }

    if (!fetchedFiles.length) throw new Error("No text file found at this URL");

    const imported = [];
    for (const file of fetchedFiles) {
      const filename = buildRemoteFilename(file.rawName, file.suffix);
      const parsed = parseVocabFile(file.content, filename);
      if (!parsed.words.length) continue;
      imported.push({ filename, parsed, content: file.content });
    }

    if (!imported.length) {
      throw new Error("Could not find valid vocab entries in the provided URL");
    }

    const nextUrls = saveUrl
      ? Array.from(new Set([...savedRemoteUrls, target.url]))
      : savedRemoteUrls;

    setFiles(prev => {
      const updated = { ...prev };
      imported.forEach(item => { updated[item.filename] = item.parsed; });
      return updated;
    });

    setSessionRemoteFiles(prev => {
      const updated = { ...prev };
      imported.forEach(item => { updated[item.filename] = item.content; });
      return updated;
    });

    let nextUserFiles = userFiles;
    let userFilesChanged = false;

    for (const item of imported) {
      if (Object.prototype.hasOwnProperty.call(nextUserFiles, item.filename)) {
        if (!userFilesChanged) nextUserFiles = { ...nextUserFiles };
        delete nextUserFiles[item.filename];
        userFilesChanged = true;
      }
    }

    if (userFilesChanged) {
      setUserFiles(nextUserFiles);
    }

    if (saveUrl) setSavedRemoteUrls(nextUrls);
    if (saveUrl || userFilesChanged) {
      persistStorage(nextUserFiles, starred, nextUrls);
    }

    setActiveSource(imported[0].filename);
    setActiveKey(null);
    setView("cards");
    resetBrowseState();

    if (!silent) {
      const skipped = fetchedFiles.length - imported.length;
      const importedLabel = imported.length === 1
        ? `Loaded "${imported[0].parsed.title}"`
        : `Loaded ${imported.length} files`;
      const skippedLabel = skipped > 0 ? ` · skipped ${skipped} non-vocab file${skipped > 1 ? "s" : ""}` : "";
      const savedLabel = saveUrl ? " · URL saved (auto-load enabled)" : " · session only";
      showToast(`✅ ${importedLabel}${skippedLabel}${savedLabel}`);
    }

    return { importedCount: imported.length };
  }, [persistStorage, savedRemoteUrls, showToast, starred, userFiles]);

  importRemoteUrlRef.current = importRemoteUrl;

  const loadRemoteFromInput = async () => {
    const candidate = remoteUrlInput.trim();
    if (!candidate) {
      showToast("Please enter URL", "error");
      return;
    }

    setRemoteLoading(true);
    try {
      await importRemoteUrl(candidate, { saveUrl: rememberRemoteUrl });
      setRemoteUrlInput("");
    } catch (error) {
      showToast(`❌ ${error.message || "Failed to load URL"}`, "error");
    } finally {
      setRemoteLoading(false);
    }
  };

  const reloadSavedRemoteUrl = async (url) => {
    setRemoteLoading(true);
    try {
      await importRemoteUrl(url, { saveUrl: false });
    } catch (error) {
      showToast(`❌ ${error.message || "Failed to reload URL"}`, "error");
    } finally {
      setRemoteLoading(false);
    }
  };

  const removeSavedRemoteUrl = (url) => {
    const nextUrls = savedRemoteUrls.filter(item => item !== url);
    setSavedRemoteUrls(nextUrls);
    persistStorage(userFiles, starred, nextUrls);
    showToast("Saved URL removed");
  };

  useEffect(() => {
    if (hasAutoLoadedRemoteRef.current) return;
    hasAutoLoadedRemoteRef.current = true;

    const urls = initialData.remoteUrls;
    if (!urls.length) return;

    let cancelled = false;

    const runAutoLoad = async () => {
      setRemoteLoading(true);
      let success = 0;

      try {
        for (const url of urls) {
          if (cancelled) break;
          try {
            const result = await importRemoteUrlRef.current(url, { saveUrl: false, silent: true });
            if (result.importedCount > 0) success += 1;
          } catch {
            // Keep going so one bad URL does not block others.
          }
        }
      } finally {
        setRemoteLoading(false);
      }

      if (cancelled) return;

      const failed = urls.length - success;
      if (failed === 0) {
        showToast(`🔄 Auto-loaded ${success} saved URL${success > 1 ? "s" : ""}`);
      } else {
        showToast(`⚠️ Auto-loaded ${success}/${urls.length} saved URL${urls.length > 1 ? "s" : ""}`, "error");
      }
    };

    runAutoLoad();

    return () => {
      cancelled = true;
    };
  }, [initialData.remoteUrls, showToast]);

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    uploadedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const fn = file.name;
        const rawContent = ev.target.result;
        const parsed = parseVocabFile(rawContent, fn);
        setFiles(prev => ({ ...prev, [fn]: parsed }));
        setUserFiles(prev => {
          const updated = { ...prev, [fn]: rawContent };
          persistStorage(updated, starred, savedRemoteUrls);
          return updated;
        });
        setActiveSource(null);
        setActiveKey(parsed.words[0] ? normalizeTopicKey(parsed.words[0].topic || "") : null);
        showToast(`✅ Uploaded "${parsed.title}" (${parsed.words.length} senses)`);
      };
      reader.readAsText(file, "utf-8");
    });
    e.target.value = "";
  };

  const toggleStar = (id) => {
    setStarred(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      persistStorage(userFiles, updated, savedRemoteUrls);
      return updated;
    });
  };

  const downloadFile = (fn) => {
    const content = userFiles[fn] || sessionRemoteFiles[fn] || BUNDLED_FILES[fn] || "";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fn; a.click();
    URL.revokeObjectURL(url);
  };

  const deleteFile = (fn) => {
    const file = files[fn];
    if (!file) return;

    const isPersistedUserFile = Object.prototype.hasOwnProperty.call(userFiles, fn);
    const isSessionRemoteFile = Object.prototype.hasOwnProperty.call(sessionRemoteFiles, fn);

    if (!isPersistedUserFile && !isSessionRemoteFile) {
      showToast("Built-in files cannot be deleted", "error");
      return;
    }

    if (!window.confirm(`Delete "${file.title}" from app?`)) return;

    const nextFiles = { ...files };
    delete nextFiles[fn];
    setFiles(nextFiles);

    if (activeSource === fn) {
      setActiveSource(null);
      setActiveKey(null);
      setView("cards");
      resetBrowseState();
    }

    let nextUserFiles = userFiles;
    if (isPersistedUserFile) {
      nextUserFiles = { ...userFiles };
      delete nextUserFiles[fn];
      setUserFiles(nextUserFiles);
    }

    if (isSessionRemoteFile) {
      setSessionRemoteFiles(prev => {
        const updated = { ...prev };
        delete updated[fn];
        return updated;
      });
    }

    const idsToDrop = new Set(file.words.map(word => word.id));
    if (idsToDrop.size > 0) {
      setFlipped(prev => {
        let changed = false;
        const updated = { ...prev };

        idsToDrop.forEach(id => {
          if (updated[id]) {
            delete updated[id];
            changed = true;
          }
        });

        return changed ? updated : prev;
      });
    }

    let nextStarred = starred;
    let starredChanged = false;

    if (idsToDrop.size > 0) {
      const updatedStarred = { ...starred };
      idsToDrop.forEach(id => {
        if (Object.prototype.hasOwnProperty.call(updatedStarred, id)) {
          delete updatedStarred[id];
          starredChanged = true;
        }
      });

      if (starredChanged) {
        nextStarred = updatedStarred;
        setStarred(updatedStarred);
      }
    }

    if (isPersistedUserFile || starredChanged) {
      persistStorage(nextUserFiles, nextStarred, savedRemoteUrls);
    }

    showToast(`🗑️ Removed "${file.title}"`);
  };

  const buildChoices = (word, all) => {
    const seen = new Set();
    const primary = all.filter(w => w.id !== word.id && !seen.has(w.id) && seen.add(w.id));
    const fallback = allWordsUniverse.filter(w => w.id !== word.id && !seen.has(w.id) && seen.add(w.id));
    const others = [...primary, ...fallback].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...others, word].sort(() => Math.random() - 0.5);
  };

  const startQuiz = () => {
    const pool = [...quizCandidates].sort(() => Math.random() - 0.5);
    if (pool.length < 1) {
      showToast("No quiz-ready senses in this view", "error");
      return;
    }
    if (allWordsUniverse.length < 2) {
      showToast("Need at least 2 total senses to build quiz choices", "error");
      return;
    }
    setQuizState({ words: pool, idx: 0, score: 0, answered: null, choice: null, choices: buildChoices(pool[0], pool) });
    setView("quiz");
  };

  const answerQuiz = (choice) => {
    if (!quizState || quizState.answered !== null) return;
    const correct = choice.id === quizState.words[quizState.idx].id;
    setQuizState(prev => ({ ...prev, answered: correct, choice: choice.id, score: prev.score + (correct ? 1 : 0) }));
  };

  const nextQuiz = () => {
    const next = quizState.idx + 1;
    if (next >= quizState.words.length) {
      setQuizState(prev => ({ ...prev, done: true }));
    } else {
      const nextChoices = buildChoices(quizState.words[next], quizState.words);
      setQuizState(prev => ({ ...prev, idx: next, answered: null, choice: null, choices: nextChoices }));
    }
  };

  const showAllVocabulary = () => {
    setActiveSource(null);
    setActiveKey(null);
    setView("cards");
    resetBrowseState();
  };

  const selectTopic = (key) => {
    setActiveSource(null);
    setActiveKey(key);
    setView("cards");
    resetBrowseState();
  };

  const previewFile = (fn) => {
    setActiveSource(fn);
    setActiveKey(null);
    setView("cards");
    resetBrowseState();
  };

  const selectView = (nextView) => {
    if (nextView === "quiz") {
      startQuiz();
      return;
    }
    setView(nextView);
  };

  const currentGroup = groupedByTopic[activeKey];
  const currentSource = activeSource ? files[activeSource] : null;
  const totalAll = Object.values(groupedByTopic).reduce((s, g) => s + g.words.length, 0);
  const activeTopicCount = new Set(activeWords.map(w => normalizeTopicKey(w.topic || ""))).size;
  const activeSubtopicCount = new Set(activeWords.map(w => normalizeSubtopicKey(w.subtopic || ""))).size;

  const qWord = quizState && !quizState.done ? quizState.words[quizState.idx] : null;
  const qChoices = (quizState && !quizState.done && quizState.choices) ? quizState.choices : [];
  const showFileColumn = !activeKey && !activeSource;

  return (
    <>
      <style>{css}</style>

      {toast && <div className={`toast ${toast.type === "error" ? "error" : ""}`}>{toast.msg}</div>}

      <div className="app">
        <Sidebar
          groupedByTopic={groupedByTopic}
          totalAll={totalAll}
          activeKey={activeKey}
          activeSource={activeSource}
          view={view}
          onShowAll={showAllVocabulary}
          onSelectTopic={selectTopic}
          onOpenManage={() => setView("manage")}
          fileInputRef={fileInputRef}
          onFileUpload={handleFileUpload}
        />

        <div className="main">
          <Topbar
            currentSource={currentSource}
            currentGroup={currentGroup}
            filteredCount={filteredWords.length}
            activeCount={activeWords.length}
            topicCount={Object.keys(groupedByTopic).length}
            activeTopicCount={activeTopicCount}
            activeSubtopicCount={activeSubtopicCount}
            view={view}
            search={search}
            onSearchChange={setSearch}
            onSelectView={selectView}
          />

          {(view === "cards" || view === "list") && (
            <TypeFilters
              filterType={filterType}
              filterGrammar={filterGrammar}
              allTypes={allTypes}
              allGrammars={allGrammars}
              onSetFilterType={setFilterType}
              onSetFilterGrammar={setFilterGrammar}
              view={view}
              quizCandidatesCount={quizCandidates.length}
              onStartQuiz={startQuiz}
            />
          )}

          <div className="content">
            {view === "cards" && (
              <CardsView
                groupedForDisplay={groupedForDisplay}
                flipped={flipped}
                starred={starred}
                onToggleFlip={id => setFlipped(prev => ({ ...prev, [id]: !prev[id] }))}
                onToggleStar={toggleStar}
                showFileColumn={showFileColumn}
                files={files}
                getTopicLabel={getTopicLabel}
                getSubtopicLabel={getSubtopicLabel}
              />
            )}

            {view === "list" && (
              <ListView
                groupedForDisplay={groupedForDisplay}
                starred={starred}
                onToggleStar={toggleStar}
                showFileColumn={showFileColumn}
                files={files}
                getTopicLabel={getTopicLabel}
                getSubtopicLabel={getSubtopicLabel}
              />
            )}

            {view === "quiz" && (
              <QuizView
                quizState={quizState}
                qWord={qWord}
                qChoices={qChoices}
                onStartQuiz={startQuiz}
                onAnswerQuiz={answerQuiz}
                onNextQuiz={nextQuiz}
                onBackToCards={() => { setQuizState(null); setView("cards"); }}
              />
            )}

            {view === "manage" && (
              <ManageView
                files={files}
                userFiles={userFiles}
                sessionRemoteFiles={sessionRemoteFiles}
                normalizeTopicKey={normalizeTopicKey}
                normalizeSubtopicKey={normalizeSubtopicKey}
                onDownloadFile={downloadFile}
                onPreviewFile={previewFile}
                onDeleteFile={deleteFile}
                remoteUrlInput={remoteUrlInput}
                rememberRemoteUrl={rememberRemoteUrl}
                remoteLoading={remoteLoading}
                savedRemoteUrls={savedRemoteUrls}
                onRemoteUrlInputChange={setRemoteUrlInput}
                onRememberRemoteUrlChange={setRememberRemoteUrl}
                onLoadRemoteFromInput={loadRemoteFromInput}
                onReloadSavedRemoteUrl={reloadSavedRemoteUrl}
                onRemoveSavedRemoteUrl={removeSavedRemoteUrl}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
