import { useEffect } from "react";

export default function WordModal({ word, onClose, onFav, isFav, onSearch }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!word) return null;
  const faved = isFav(word.word);

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[1000] flex items-center justify-center "
      style={{ background: "rgba(0,0,0,0.87)", backdropFilter: "blur(6px)", }}
    >
      <div
        className="relative w-full max-w-xl rounded-md overflow-hidden p-10"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border2)", padding: "12px 14px" }}
      >
        {/* watermark */}
        <div
          aria-hidden
          className="absolute right-[-10px] bottom-[-20px] leading-none select-none pointer-events-none text-[110px] opacity-[0.025]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {word.word.toUpperCase()}
        </div>

        {/* header row */}
        <div className="flex items-start justify-between mb-6">
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)" }}
          >
            ✦ word detail
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onFav(word)}
              className="text-[14px] px-2.5 py-1.5 rounded-sm transition-all duration-150"
              style={{
                background: faved ? "rgba(255,60,172,0.12)" : "transparent",
                border: `1px solid ${faved ? "var(--color-pink)" : "var(--color-border2)"}`,
                color: faved ? "var(--color-pink)" : "var(--color-muted2)",
                padding: "0 4px",
              }}
            >
              {faved ? "♥" : "♡"}
            </button>
            <button
              onClick={onClose}
              className="text-[12px] px-3 py-1.5 rounded-sm transition-all duration-150"
              style={{
                fontFamily: "var(--font-mono)",
                background: "transparent",
                border: "1px solid var(--color-border2)",
                color: "var(--color-muted2)",
                padding: "0 4px",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--color-ink)"; e.currentTarget.style.borderColor = "var(--color-muted)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted2)"; e.currentTarget.style.borderColor = "var(--color-border2)"; }}
            >
              esc ×
            </button>
          </div>
        </div>

        {/* word */}
        <div
          className="leading-[0.88] text-[clamp(52px,10vw,80px)]"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {word.word}
        </div>

        {/* meaning */}
        <p className="text-[16px] leading-[1.8]" style={{ color: "#ccc" }}>
          {word.meaning}
        </p>

        {/* example */}
        {word.example && (
          <div
            className="rounded-sm p-5 mb-6"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border2)", padding: "4px 6px" }}
          >
            <div
              className="text-[9px] uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-pink)" }}
            >
              Example in the wild
            </div>
            <p
              className="text-[13px] italic leading-[1.7]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted2)" }}
            >
              "{word.example}"
            </p>
          </div>
        )}

        {/* actions */}
        <div className="flex gap-2.5 flex-wrap"
          style={{ marginTop: "6px"}}
        >
          <button
            onClick={() => { onSearch(word.word); onClose(); }}
            className="text-[11px] rounded-sm font-medium border-none transition-opacity hover:opacity-85"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--color-accent)",
              color: "#080808",
              padding:"2px 4px",
              marginTop: "1px",
            }}
          >
            search this word →
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(`${word.word}: ${word.meaning}`)}
            className="text-[11px] rounded-sm transition-all duration-150"
            style={{
              fontFamily: "var(--font-mono)",
              background: "transparent",
              border: "1px solid var(--color-border2)",
              color: "var(--color-muted2)",
              padding:"2px 6px",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--color-ink)"; e.currentTarget.style.borderColor = "var(--color-muted)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted2)"; e.currentTarget.style.borderColor = "var(--color-border2)"; }}
          >
            copy definition
          </button>
        </div>
      </div>
    </div>
  );
}
