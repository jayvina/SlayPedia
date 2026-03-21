import { useState } from "react";

const PILLS = ["rizz","no cap","bussin","slay","delulu","it's giving","lowkey","ate"];

export default function SearchBar({ onSearch, loading }) {
  const [val, setVal] = useState("");

  const submit = () => { const q = val.trim(); if (q) onSearch(q); };

  return (
    <div className="max-w-2xl mx-auto">
      {/* input */}
      <div
        className="flex overflow-hidden rounded-sm transition-all duration-200"
        style={{
          border: "1px solid var(--color-border2)",
          background: "var(--color-surface)",
        }}
        onFocus={e  => e.currentTarget.style.borderColor = "var(--color-accent)"}
        onBlur={e   => e.currentTarget.style.borderColor = "var(--color-border2)"}
      >
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="type a word... rizz, slay, delulu"
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent border-none outline-none text-[16px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          style={{ 
            fontFamily: "var(--font-mono)",
            padding: "4px 6px",
           }}
        />
        <button
          onClick={submit}
          disabled={loading}
          className="border-none text-[20px] tracking-wider text-[#080808] transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{
            fontFamily: "var(--font-display)",
            background: loading ? "var(--color-border2)" : "var(--color-accent)",
            padding: "4px 6px",
          }}
        >
          {loading ? "..." : "SEARCH"}
        </button>
      </div>

      {/* suggestion pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {PILLS.map(s => (
          <button
            key={s}
            onClick={() => { setVal(s); onSearch(s); }}
            className="text-[10px] rounded-xl transition-all duration-150"
            style={{
              fontFamily: "var(--font-mono)",
              border: "1px solid var(--color-border2)",
              background: "transparent",
              color: "var(--color-muted2)",
              padding: "2px 16px",
              marginTop: "4px",
              marginBottom: "6px",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border2)"; e.currentTarget.style.color = "var(--color-muted2)"; }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
