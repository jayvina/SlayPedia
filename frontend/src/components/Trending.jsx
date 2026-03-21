import { useState, useEffect } from "react";
import { api } from "../api.js";

export default function Trending({ onSearch }) {
  const [words,   setWords]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.trending()
      .then(d => setWords(d.results || []))
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* section header */}
      <div className="flex items-baseline gap-4"
        style={{ marginBottom: "5px", padding: "0 4px" }}
      >
        <h2
          className="text-[29px] tracking-[0.02em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Trending
        </h2>
        <div className="flex-1 h-px" style={{ background: "var(--color-border2)" }} />
        <span
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
        >
          right now
        </span>
      </div>

      {loading ? (
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-[38px] rounded-sm"
              style={{ width: `${70 + i * 15}px` }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {words.map((w, i) => (
            <TrendPill
              key={w.word}
              word={w.word}
              rank={i + 1}
              delay={i * 0.04}
              onClick={() => onSearch(w.word)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TrendPill({ word, rank, delay, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="inline-flex items-center gap-2 text-[10px] rounded-sm transition-all duration-150 animate-fadeup"
      style={{
        fontFamily: "var(--font-mono)",
        border: `1px solid ${hov ? "var(--color-accent)" : "var(--color-border2)"}`,
        background: hov ? "rgba(184,255,53,0.06)" : "var(--color-card)",
        color: hov ? "var(--color-accent)" : "var(--color-ink)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        animationDelay: `${delay}s`,
        padding: "4px 10px",  
      }}
    >
      <span
        className="text-[9px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
      >
        #{rank}
      </span>
      {word}
    </button>
  );
}
