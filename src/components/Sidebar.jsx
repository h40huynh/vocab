export default function Sidebar({
  groupedByTopic,
  totalAll,
  activeKey,
  activeSource,
  view,
  onShowAll,
  onSelectTopic,
  onOpenManage,
  fileInputRef,
  onFileUpload,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <h1>📚 VocabManager</h1>
        <p>{Object.keys(groupedByTopic).length} topics · {totalAll} senses</p>
      </div>

      <div className="sidebar-files">
        <div
          className={`file-item ${!activeKey && !activeSource && view !== "manage" ? "active" : ""}`}
          onClick={onShowAll}
        >
          <span className="emoji">📚</span>
          <span className="name">All Vocabulary</span>
          <span className="count">{totalAll}</span>
        </div>

        <div style={{ borderTop: "1px solid #1e2030", margin: "6px 4px" }} />

        {Object.entries(groupedByTopic).map(([key, group]) => (
          <div
            key={key}
            className={`file-item ${activeKey === key && !activeSource ? "active" : ""}`}
            onClick={() => onSelectTopic(key)}
          >
            <span className="emoji">🏷️</span>
            <span className="name">{group.title}</span>
            <span className="count">{group.words.length}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="btn-sidebar" onClick={() => fileInputRef.current.click()}>
          ⬆️ Upload .vocab file
        </button>
        <button className="btn-sidebar" onClick={onOpenManage}>
          🗂 Manage Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".vocab,.txt,.md"
          multiple
          style={{ display: "none" }}
          onChange={onFileUpload}
        />
      </div>
    </aside>
  );
}
