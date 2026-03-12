export const STORAGE_KEY = "vocab_app_v2";

export function loadStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

export function saveStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {
    // Ignore storage write failures (private mode, quota exceeded, etc.).
  }
}
