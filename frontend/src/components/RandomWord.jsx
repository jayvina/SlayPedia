import { useState, useEffect, useCallback } from "react";
import { api } from "../api.js";

export default function RandomWord({ onSearch }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [spin,    setSpin]    = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setSpin(true);
    try {
      setData(await api.random());
    } catch {
      setData({ word: "Backend offline", meaning: "Start the backend with 'npm start' inside /backend", example: "" });
    } finally {
      setLoading(false);
      setTimeout(() => setSpin(false), 400);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div
      className="relative rounded-sm p-10 mb-12 overflow-hidden"
      style={{ 
        border: "1px solid var(--color-border2)", 
        background: "var(--color-card)" ,
        padding: "12px 14px",
      }}
    >
      {/* watermark */}
      {data && (
        <div
          aria-hidden
          className="absolute right-[-12px] bottom-[-24px] leading-none select-none pointer-events-none text-[120px] opacity-[0.025]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {data.word.toUpperCase()}
        </div>
      )}

      {/* label */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-[2px]" style={{ background: "var(--color-accent)" }} />
        <span
          className="text-[8px] uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent)", marginBottom: "2px" }}
        >
          Word of the moment
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-20 w-1/2" />
          <div className="skeleton h-4 w-4/5" />
          <div className="skeleton h-4 w-3/5" />
        </div>
      ) : (
        <div className="animate-fadeup">
          <button
            onClick={() => data && onSearch(data.word)}
            className="block border-none bg-transparent p-0 text-left mb-5 transition-opacity hover:opacity-75"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(42px, 8vw, 68px)",
              lineHeight: 0.9,
              color: "var(--color-ink)",
            }}
          >
            {data?.word}
          </button>

          <p className="text-[15px] leading-[1.8] max-w-xl" style={{ color: "#bbb" }}>
            {data?.meaning}
          </p>

          {data?.example && (
            <div
              className="max-w-xl text-[12px] leading-[1.7] p-5 rounded-sm"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-muted2)",
                border: "1px solid var(--color-border2)",
                background: "var(--color-surface)",
                padding: "4px 10px",
              }}
            >
              <div
                className="text-[9px] uppercase tracking-[0.2em] mb-1.5"
                style={{ color: "var(--color-pink)" }}
              >
                Example
              </div>
              {data.example}
            </div>
          )}
        </div>
      )}

      {/* shuffle button */}
      <button
        onClick={load}
        className="mt-6 inline-flex items-center gap-2 text-[12px] px-[18px] py-2.5 rounded-sm transition-all duration-150"
        style={{
          fontFamily: "var(--font-mono)",
          border: "1px solid var(--color-border2)",
          background: "transparent",
          color: "var(--color-muted2)",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--color-cyan)"; e.currentTarget.style.borderColor = "var(--color-cyan)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted2)"; e.currentTarget.style.borderColor = "var(--color-border2)"; }}
      >
        <span
          className="inline-block transition-transform duration-400"
          style={{ transform: spin ? "rotate(360deg)" : "rotate(0deg)" }}
        >
          ↻
        </span>
        shuffle another
      </button>
    </div>
  );
}
