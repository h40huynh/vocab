import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getType } from "../../constants";

const MARKDOWN_PLUGINS = [remarkGfm];

export default function CardsView({
  groupedForDisplay,
  flipped,
  starred,
  onToggleFlip,
  onToggleStar,
  showFileColumn,
  files,
  getTopicLabel,
  getSubtopicLabel,
}) {
  if (groupedForDisplay.length === 0) {
    return <div className="empty"><div className="empty-icon">🫙</div><div className="empty-text">No senses found</div></div>;
  }

  return (
    <div className="cluster-stack">
      {groupedForDisplay.map(group => (
        <section key={group.key} className="cluster-section">
          <div className="cluster-head">
            <div className="cluster-title">🧩 {group.title}</div>
            <div className="cluster-count">{group.words.length} senses</div>
          </div>

          <div className="cards-grid">
            {group.words.map(word => {
              const meta = getType(word.type);
              const isFlipped = !!flipped[word.id];
              const isStarred = !!starred[word.id];

              return (
                <div
                  key={word.id}
                  className={`vocab-card ${isFlipped ? "flipped" : ""}`}
                  onClick={() => onToggleFlip(word.id)}
                >
                  <div className="card-top">
                    <div style={{ flex: 1 }}>
                      <div className="card-en">{word.en}</div>
                      {word.ph && <div className="card-ph">{word.ph}</div>}
                      {word.senseCount > 1 && <div className="sense-chip">Sense {word.senseIndex}/{word.senseCount}</div>}
                    </div>
                    <span className="type-badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                    {word.grammar && <span className="grammar-badge">{word.grammar}</span>}
                    <button className="star-btn" onClick={e => { e.stopPropagation(); onToggleStar(word.id); }}>
                      {isStarred ? "⭐" : "☆"}
                    </button>
                  </div>

                  <div className="card-def-en md-content md-compact">
                    <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{word.meaningEn}</ReactMarkdown>
                  </div>
                  <div className="card-def-vi">{word.meaningVi}</div>
                  <div style={{ fontSize: "0.65rem", color: "#5a5e7a", marginTop: 3 }}>
                    #{getTopicLabel(word.topic)} / {getSubtopicLabel(word.subtopic)}
                  </div>

                  {showFileColumn && (
                    <div style={{ fontSize: "0.67rem", color: "#3a3d52", marginTop: 5 }}>
                      📁 {files[word.source]?.emoji || "📄"} {files[word.source]?.title || word.source}
                    </div>
                  )}

                  {isFlipped && word.ex && (
                    <div className="card-ex">
                      <div className="md-label">💬 Example</div>
                      <div className="md-content">
                        <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{word.ex}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {!isFlipped && <div className="flip-hint">tap to see example</div>}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
