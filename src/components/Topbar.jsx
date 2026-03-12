export default function Topbar({
  currentSource,
  currentGroup,
  filteredCount,
  activeCount,
  topicCount,
  activeTopicCount,
  activeSubtopicCount,
  view,
  search,
  onSearchChange,
  onSelectView,
}) {
  return (
    <div className="topbar">
      {currentSource ? (
        <div>
          <div className="file-title">📁 {currentSource.emoji || "📄"} {currentSource.title}</div>
          <div className="file-subtitle">
            {filteredCount} / {activeCount} senses · {activeTopicCount} topics · {activeSubtopicCount} sub-topics in file
          </div>
        </div>
      ) : currentGroup ? (
        <div>
          <div className="file-title">🏷️ {currentGroup.title}</div>
          <div className="file-subtitle">{filteredCount} / {activeCount} senses shown</div>
        </div>
      ) : (
        <div>
          <div className="file-title">📚 All Vocabulary</div>
          <div className="file-subtitle">{filteredCount} / {activeCount} senses · {topicCount} topics</div>
        </div>
      )}

      {(view === "cards" || view === "list") && (
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search words, definitions, meanings, grammar..."
          />
        </div>
      )}

      <div className="nav-tabs">
        {["cards", "list", "quiz", "manage"].map(v => (
          <button key={v} className={`tab ${view === v ? "active" : ""}`} onClick={() => onSelectView(v)}>
            {v === "cards" ? "🃏" : v === "list" ? "📋" : v === "quiz" ? "🎯" : "🗂"} {v}
          </button>
        ))}
      </div>
    </div>
  );
}
