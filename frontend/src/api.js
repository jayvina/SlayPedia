const BASE = "/api";

async function apiFetch(path) {
  const res  = await fetch(`${BASE}${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

export const api = {
  search:   (q, limit = 9) => apiFetch(`/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  word:     (word)          => apiFetch(`/word/${encodeURIComponent(word)}`),
  random:   ()              => apiFetch("/random"),
  trending: ()              => apiFetch("/trending"),
  health:   ()              => apiFetch("/health"),
};
