export const TYPE_META = {
  noun:           { color: "#0d6efd", bg: "#e7f0ff", label: "noun" },
  verb:           { color: "#198754", bg: "#e6f4ec", label: "verb" },
  adjective:      { color: "#6f42c1", bg: "#f0ebff", label: "adj" },
  phrase:         { color: "#b45309", bg: "#fff7e6", label: "phrase" },
  idiom:          { color: "#c2185b", bg: "#fce4ec", label: "idiom" },
  collocation:    { color: "#0097a7", bg: "#e0f7fa", label: "colloc." },
  "phrasal verb": { color: "#2e7d32", bg: "#e8f5e9", label: "phr.v" },
  word:           { color: "#555",    bg: "#f0f0f0", label: "word" },
};

export const getType = t => TYPE_META[t?.toLowerCase()] || TYPE_META.word;

const _vocabGlob = import.meta.glob("./vocab/*.vocab", { eager: true, query: "?raw", import: "default" });
export const BUNDLED_FILES = Object.fromEntries(
  Object.entries(_vocabGlob).map(([path, content]) => [path.replace("./vocab/", ""), content])
);

