export default function HistoryBar({ history, onSearch, onClear }) {
  if (!history.length) return null;

  return (
    <div className="max-w-2xl mx-auto flex items-center gap-2 flex-wrap"
      style={{ padding: "0 4px", marginBottom: "6px" }}
    >

      <span
        className="text-[9px] uppercase tracking-[0.15em] whitespace-nowrap"
        style={{ 
          fontFamily: "var(--font-mono)", 
          color: "var(--color-muted)",
         
         }}
      >
        recent:
      </span>
      <div className="flex gap-1.5 flex-wrap flex-1">
        {history.slice(0, 8).map(h => (
          <button
            key={h.ts}
            onClick={() => onSearch(h.query)}
            className="text-[10px] px-[10px] py-[3px] rounded-full transition-all duration-150"
            style={{
              fontFamily: "var(--font-mono)",
              border: "1px solid var(--color-border)",
              background: "transparent",
              color: "var(--color-muted)",
              padding: "2px 4px",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--color-ink)"; e.currentTarget.style.borderColor = "var(--color-muted)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
          >
            {h.query}
          </button>
        ))}
      </div>
      <button
        onClick={onClear}
        className="text-[10px] underline underline-offset-2 border-none bg-transparent"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
      >
        clear
      </button>
    </div>
  );
}
