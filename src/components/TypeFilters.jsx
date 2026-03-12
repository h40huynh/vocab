import { getType } from "../constants";

export default function TypeFilters({
  filterType,
  filterGrammar,
  allTypes,
  allGrammars,
  onSetFilterType,
  onSetFilterGrammar,
  view,
  quizCandidatesCount,
  onStartQuiz,
}) {
  return (
    <div className="type-filters">
      <button className={`type-chip ${filterType === "all" ? "active" : ""}`} onClick={() => onSetFilterType("all")}>
        All
      </button>

      {allTypes.map(type => {
        const meta = getType(type);
        return (
          <button
            key={type}
            className={`type-chip ${filterType === type ? "active" : ""}`}
            onClick={() => onSetFilterType(filterType === type ? "all" : type)}
            style={filterType === type ? { borderColor: meta.color, color: meta.color } : {}}
          >
            {meta.label}
          </button>
        );
      })}

      {allGrammars.map(grammar => (
        <button
          key={grammar}
          className={`type-chip ${filterGrammar === grammar ? "active" : ""}`}
          onClick={() => onSetFilterGrammar(filterGrammar === grammar ? "all" : grammar)}
        >
          {grammar}
        </button>
      ))}

      {allGrammars.length > 0 && (
        <button className={`type-chip ${filterGrammar === "all" ? "active" : ""}`} onClick={() => onSetFilterGrammar("all")}>
          All grammar
        </button>
      )}

      {view === "cards" && (
        <button className="type-chip" onClick={onStartQuiz} style={{ marginLeft: "auto", borderColor: "#6366f1", color: "#a5b4fc" }}>
          🎯 Quiz ({quizCandidatesCount})
        </button>
      )}
    </div>
  );
}
