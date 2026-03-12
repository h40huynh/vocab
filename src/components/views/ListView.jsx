import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getType } from "../../constants";

const MARKDOWN_PLUGINS = [remarkGfm];

export default function ListView({
  groupedForDisplay,
  starred,
  onToggleStar,
  showFileColumn,
  files,
  getTopicLabel,
  getSubtopicLabel,
}) {
  if (groupedForDisplay.length === 0) {
    return <div className="empty"><div className="empty-icon">📋</div><div className="empty-text">No senses available</div></div>;
  }

  const listGroupColSpan = showFileColumn ? 11 : 10;

  return (
    <table className="list-table">
      <thead>
        <tr>
          <th>⭐</th>
          <th>English</th>
          <th>Phonetic</th>
          <th>Definition</th>
          <th>Meaning</th>
          <th>Type</th>
          <th>Grammar</th>
          <th>Topic</th>
          <th>Sub-topic</th>
          {showFileColumn && <th>File</th>}
          <th>Example</th>
        </tr>
      </thead>

      <tbody>
        {groupedForDisplay.flatMap(group => {
          const headerRow = (
            <tr key={`${group.key}__group`} className="list-group-row">
              <td colSpan={listGroupColSpan}>🧩 {group.title} · {group.words.length} senses</td>
            </tr>
          );

          const wordRows = group.words.map(word => {
            const meta = getType(word.type);

            return (
              <tr key={word.id}>
                <td>
                  <button className="star-btn" style={{ fontSize: "0.9rem" }} onClick={() => onToggleStar(word.id)}>
                    {starred[word.id] ? "⭐" : "☆"}
                  </button>
                </td>
                <td><div className="td-en">{word.en}</div></td>
                <td><span className="td-ph">{word.ph}</span></td>
                <td>
                  <div className="td-def-en md-content md-compact">
                    <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{word.meaningEn}</ReactMarkdown>
                  </div>
                </td>
                <td><span className="td-vi">{word.meaningVi}</span></td>
                <td><span className="type-badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span></td>
                <td style={{ fontSize: "0.72rem", color: "#7a7fa0", textTransform: "lowercase" }}>{word.grammar || "-"}</td>
                <td style={{ fontSize: "0.72rem", color: "#5a5e7a" }}>{getTopicLabel(word.topic)}</td>
                <td style={{ fontSize: "0.72rem", color: "#5a5e7a" }}>{getSubtopicLabel(word.subtopic)}</td>
                {showFileColumn && (
                  <td style={{ fontSize: "0.72rem", color: "#5a5e7a", whiteSpace: "nowrap" }}>
                    {files[word.source]?.emoji} {files[word.source]?.title || word.source}
                  </td>
                )}
                <td>
                  <div className="td-ex md-content">
                    <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{word.ex || ""}</ReactMarkdown>
                  </div>
                </td>
              </tr>
            );
          });

          return [headerRow, ...wordRows];
        })}
      </tbody>
    </table>
  );
}
