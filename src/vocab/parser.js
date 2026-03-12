// New .vocab format (no legacy support):
//
// en: appreciate
// ph: /əˈpriː.ʃi.eɪt/
// topic: Communication
// sub-topic: Feelings
// sense: verb | transitive | to feel thankful for something | biết ơn điều gì đó
// example: |
//   I really appreciate your help.
// sense: verb | intransitive | to increase in value over time | tăng giá trị theo thời gian
// example: |
//   Property appreciates over time.
//
// Notes:
// - Each sense must contain both English and Vietnamese meanings.
// - "example" always applies to the latest sense.
// - "---" is an optional divider between entries.
export function parseVocabFile(content, filename) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const words = [];
  let fileTitle = filename.replace(/\.(vocab|txt|md)$/i, "").replace(/-/g, " ");
  let fileEmoji = "📄";

  const idPart = (value = "") => value.toLowerCase().trim().replace(/\s+/g, " ");
  const createEntry = () => ({ en: "", ph: "", topic: "", subtopic: "", senses: [] });

  const normalizeField = (raw = "") => {
    const key = raw.trim().toLowerCase();
    if (key === "en" || key === "english") return "en";
    if (key === "ph" || key === "phonetic") return "ph";
    if (key === "topic") return "topic";
    if (key === "subtopic" || key === "sub-topic" || key === "sub_topic") return "subtopic";
    if (key === "sense") return "sense";
    if (key === "ex" || key === "example") return "ex";
    return "";
  };

  const parseSenseLine = (rawSense = "") => {
    const parts = rawSense.split("|").map(p => p.trim());
    if (parts.length < 4) return null;

    const [rawType, rawGrammar, rawMeaningEn, rawMeaningVi, rawExample = ""] = parts;
    const type = (rawType || "word").trim() || "word";
    const grammar = rawGrammar.trim() === "-" ? "" : rawGrammar.trim();
    const meaningEn = rawMeaningEn.trim();
    const meaningVi = rawMeaningVi.trim();
    if (!meaningEn || !meaningVi) return null;

    return {
      type,
      grammar,
      meaningEn,
      meaningVi,
      ex: rawExample.replace(/\\n/g, "\n").trim(),
    };
  };

  let entry = createEntry();
  let currentSense = null;
  let inExampleBlock = false;
  let exampleLines = [];

  const finishExampleBlock = () => {
    if (!currentSense) {
      inExampleBlock = false;
      exampleLines = [];
      return;
    }
    currentSense.ex = exampleLines.join("\n").replace(/\s+$/g, "");
    exampleLines = [];
    inExampleBlock = false;
  };

  const pushEntry = () => {
    if (inExampleBlock) {
      finishExampleBlock();
    }

    const en = (entry.en || "").trim();
    if (!en) {
      entry = createEntry();
      currentSense = null;
      return;
    }

    const ph = (entry.ph || "").trim();
    const topic = (entry.topic || "").trim();
    const subtopic = (entry.subtopic || "").trim();

    const senses = entry.senses
      .map((sense = {}) => ({
        type: (sense.type || "word").trim() || "word",
        grammar: (sense.grammar || "").trim(),
        meaningEn: (sense.meaningEn || "").trim(),
        meaningVi: (sense.meaningVi || "").trim(),
        ex: (sense.ex || "").replace(/\\n/g, "\n").trim(),
      }))
      .filter(sense => sense.meaningEn && sense.meaningVi);

    const senseCount = senses.length;
    if (senseCount === 0) {
      entry = createEntry();
      currentSense = null;
      return;
    }

    senses.forEach((sense, idx) => {
      const wordId = [
        filename,
        idPart(en),
        `sense_${idx + 1}`,
        idPart(sense.meaningEn),
        idPart(sense.meaningVi),
        idPart(topic),
        idPart(subtopic),
        idPart(sense.type),
        idPart(sense.grammar),
      ].join("__");

      words.push({
        id: wordId,
        en,
        ph,
        type: sense.type,
        grammar: sense.grammar,
        meaningEn: sense.meaningEn,
        meaningVi: sense.meaningVi,
        ex: sense.ex,
        topic,
        subtopic,
        source: filename,
        senseIndex: idx + 1,
        senseCount,
      });
    });

    entry = createEntry();
    currentSense = null;
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (inExampleBlock) {
      if (raw.startsWith("  ") || raw.startsWith("\t") || line === "") {
        if (raw.startsWith("\t")) exampleLines.push(raw.slice(1));
        else if (raw.startsWith("  ")) exampleLines.push(raw.slice(2));
        else exampleLines.push("");
        continue;
      }
      finishExampleBlock();
    }

    if (!line) continue;

    if (line === "---") {
      pushEntry();
      continue;
    }

    if (line.startsWith("# title:")) {
      fileTitle = line.slice(8).trim();
      continue;
    }

    if (line.startsWith("# emoji:")) {
      fileEmoji = line.slice(8).trim();
      continue;
    }

    if (line.startsWith("#")) continue;

    const kvMatch = raw.match(/^\s*([a-zA-Z][a-zA-Z_-]*)\s*:\s*(.*)$/);
    if (!kvMatch) continue;

    const field = normalizeField(kvMatch[1]);
    if (!field) continue;

    const value = kvMatch[2] || "";

    if (field === "en") {
      if (entry.en || entry.senses.length > 0) {
        pushEntry();
      }
      entry.en = value.trim();
      continue;
    }

    if (field === "ph" || field === "topic" || field === "subtopic") {
      entry[field] = value.trim();
      continue;
    }

    if (field === "sense") {
      const parsedSense = parseSenseLine(value);
      if (!parsedSense) continue;
      entry.senses.push(parsedSense);
      currentSense = parsedSense;
      continue;
    }

    if (field === "ex") {
      if (!currentSense) continue;
      if (value.trim() === "|") {
        inExampleBlock = true;
        exampleLines = [];
      } else {
        currentSense.ex = value.replace(/\\n/g, "\n").trim();
      }
    }
  }

  if (inExampleBlock) {
    finishExampleBlock();
  }
  pushEntry();

  return { title: fileTitle, emoji: fileEmoji, filename, words };
}
