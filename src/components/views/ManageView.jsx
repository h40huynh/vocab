export default function ManageView({
  files,
  userFiles,
  sessionRemoteFiles,
  normalizeTopicKey,
  normalizeSubtopicKey,
  onDownloadFile,
  onPreviewFile,
  onDeleteFile,
  remoteUrlInput,
  rememberRemoteUrl,
  remoteLoading,
  savedRemoteUrls,
  onRemoteUrlInputChange,
  onRememberRemoteUrlChange,
  onLoadRemoteFromInput,
  onReloadSavedRemoteUrl,
  onRemoveSavedRemoteUrl,
}) {
  return (
    <div>
      <div className="panel-title" style={{ marginBottom: 20 }}>🗂 Manage Files</div>

      <div className="remote-loader-panel">
        <div className="remote-loader-head">
          <div className="remote-loader-title">🌐 Load from URL</div>
          <div className="remote-loader-sub">Supports GitHub Gist URL and direct raw text URL</div>
        </div>

        <div className="remote-loader-row">
          <input
            className="form-input remote-url-input"
            value={remoteUrlInput}
            onChange={e => onRemoteUrlInputChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") onLoadRemoteFromInput();
            }}
            placeholder="https://gist.github.com/... or https://.../file.vocab"
            disabled={remoteLoading}
          />

          <button className="btn-primary" onClick={onLoadRemoteFromInput} disabled={remoteLoading}>
            {remoteLoading ? "Loading..." : "Load URL"}
          </button>
        </div>

        <label className="remember-url-check">
          <input
            type="checkbox"
            checked={rememberRemoteUrl}
            onChange={e => onRememberRemoteUrlChange(e.target.checked)}
            disabled={remoteLoading}
          />
          Save this URL and auto-load on next visit
        </label>

        <div className="remote-loader-note">
          URL files are loaded temporarily in this session. When saved, only the URL is stored.
        </div>

        <div className="saved-urls-wrap">
          <div className="saved-urls-title">Saved URLs ({savedRemoteUrls.length})</div>

          {savedRemoteUrls.length === 0 ? (
            <div className="saved-urls-empty">No saved URLs yet.</div>
          ) : (
            <div className="saved-urls-list">
              {savedRemoteUrls.map(url => (
                <div key={url} className="saved-url-item">
                  <div className="saved-url-text" title={url}>{url}</div>
                  <div className="saved-url-actions">
                    <button
                      className="btn-sm btn-edit"
                      onClick={() => onReloadSavedRemoteUrl(url)}
                      disabled={remoteLoading}
                      title="Reload"
                    >
                      ↻
                    </button>
                    <button
                      className="btn-sm btn-delete"
                      onClick={() => onRemoveSavedRemoteUrl(url)}
                      disabled={remoteLoading}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="manage-grid">
        {Object.entries(files).map(([filename, file]) => {
          const fileTopicKeys = new Set(file.words.map(word => normalizeTopicKey(word.topic || "")));
          const fileSubtopicKeys = new Set(file.words.map(word => normalizeSubtopicKey(word.subtopic || "")));
          const isPersistedUserFile = !!userFiles[filename];
          const isSessionRemoteFile = !!sessionRemoteFiles[filename];
          const isBuiltInFile = !isPersistedUserFile && !isSessionRemoteFile;

          return (
            <div key={filename} className="manage-card">
              <div className="manage-card-head">
                <span className="manage-card-emoji">{file.emoji}</span>
                <div>
                  <div className="manage-card-title">{file.title}</div>
                  <div className="manage-card-sub">
                    {file.words.length} senses · {fileTopicKeys.size} topics · {fileSubtopicKeys.size} sub-topics
                  </div>
                </div>
              </div>

              <div className="manage-card-actions" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: "0.72rem", color: "#5a5e7a", flex: 1 }}>
                  {filename}
                  {isBuiltInFile && <span className="built-in-badge" style={{ marginLeft: 6 }}>built-in</span>}
                  {isSessionRemoteFile && <span className="session-badge" style={{ marginLeft: 6 }}>session</span>}
                </span>

                <button className="btn-sm btn-download" onClick={() => onDownloadFile(filename)}>⬇️</button>
                <button className="btn-sm btn-edit" onClick={() => onPreviewFile(filename)}>👁</button>
                {!isBuiltInFile && (
                  <button className="btn-sm btn-delete" onClick={() => onDeleteFile(filename)}>🗑️</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
