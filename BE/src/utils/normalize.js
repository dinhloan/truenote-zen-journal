export function uniqueCleanStrings(values = []) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function normalizeThemeName(theme) {
  return String(theme || "").trim().toLowerCase();
}
