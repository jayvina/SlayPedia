import { useState, useEffect, useCallback } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_favorites") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("sp_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggle = useCallback(word => {
    setFavorites(prev =>
      prev.find(f => f.word === word.word)
        ? prev.filter(f => f.word !== word.word)
        : [word, ...prev].slice(0, 50)
    );
  }, []);

  const isFav = useCallback(
    word => favorites.some(f => f.word === word),
    [favorites]
  );

  return { favorites, toggle, isFav };
}

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_history") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("sp_history", JSON.stringify(history));
  }, [history]);

  const push = useCallback(query => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.query !== query);
      return [{ query, ts: Date.now() }, ...filtered].slice(0, 20);
    });
  }, []);

  const clear = useCallback(() => setHistory([]), []);

  return { history, push, clear };
}
