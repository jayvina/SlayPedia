import { useState } from "react";

function highlight(text, query) {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="rounded-sm px-[2px]" style={{ background: "rgba(184,255,53,0.2)", color: "var(--color-accent)" }}>{p}</mark>
      : p
  );
}

export default function SlangCard({ word, meaning, example, index = 0, query = "", onOpen, onFav, isFav }) {
  const [copied,  setCopied]  = useState(false);
  const [hovered, setHovered] = useState(false);
  const faved = isFav?.(word);

  const copy = e => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${word}: ${meaning}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const toggleFav = e => {
    e.stopPropagation();
    onFav?.({ word, meaning, example });
  };

  return (
    <div
      onClick={() => onOpen?.({ word, meaning, example })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative  overflow-hidden cursor-pointer transition-colors duration-200"
      style={{
        background: hovered ? "#191919" : "var(--color-card)",
        animationDelay: `${index * 0.06}s`,
        padding: "12px 14px",
      }}
    >
      {/* animated left accent bar */}
      <div
        className="accent-bar"
        style={{ transform: hovered ? "scaleY(1)" : "scaleY(0)" }}
      />

      {/* index */}
      <div
        className="text-[10px] tracking-[0.1em]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)", marginBottom: "4px" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* word */}
      <div
        className="text-[34px] leading-none mb-3"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)", paddingTop: "2px", marginBottom: "6px" }}
      >
        {highlight(word, query)}
      </div>

      {/* meaning */}
      <p
        className="text-[14px] leading-[1.75] mb-4 line-clamp-3"
        style={{ color: "#bbb" }}
      >
        {meaning}
      </p>

      {/* example */}
      {example && (
        <>
          <div
            className="text-[9px] uppercase tracking-[0.2em] mb-1.5"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-pink)" }}
          >
            Example
          </div>
          <p
            className="text-[12px] italic leading-[1.65] line-clamp-2 pl-3"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-muted2)",
              borderLeft: "2px solid var(--color-border2)",
            }}
          >
            {example}
          </p>
        </>
      )}

      {/* action buttons — visible on hover */}
      <div
        className="absolute top-5 right-5 flex gap-1.5 transition-opacity duration-150"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <button
          onClick={toggleFav}
          className="text-[13px] px-2 py-1 rounded-sm transition-all duration-150"
          style={{
            background: faved ? "rgba(255,60,172,0.15)" : "transparent",
            border: `1px solid ${faved ? "var(--color-pink)" : "var(--color-border2)"}`,
            color: faved ? "var(--color-pink)" : "var(--color-muted)",
            padding: "0 4px",
          }}
        >
          {faved ? "♥" : "♡"}
        </button>
        <button
          onClick={copy}
          className="text-[10px] rounded-sm transition-all duration-150"
          style={{
            fontFamily: "var(--font-mono)",
            background: "transparent",
            border: `1px solid ${copied ? "var(--color-accent)" : "var(--color-border2)"}`,
            color: copied ? "var(--color-accent)" : "var(--color-muted)",
            padding: "0 4px",
          }}
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>

      {/* click hint */}
      {hovered && (
        <div
          className="mt-3.5 text-[9px] tracking-[0.1em]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
        >
          click for details →
        </div>
      )}
    </div>
  );
}
