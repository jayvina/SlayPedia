import { useState } from "react";

export default function FavoritesPanel({ favorites, onSearch, onRemove, onOpen }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* floating heart button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Favorites"
        className="fixed bottom-7 right-7 z-[500] w-[52px] h-[52px] rounded-full flex items-center justify-center text-[20px] transition-all duration-200"
        style={{
          background: favorites.length > 0 ? "var(--color-pink)" : "var(--color-surface)",
          border: `1px solid ${favorites.length > 0 ? "var(--color-pink)" : "var(--color-border2)"}`,
          color: favorites.length > 0 ? "#fff" : "var(--color-muted2)",
          boxShadow: favorites.length > 0 ? "0 0 20px rgba(255,60,172,0.35)" : "none",
        }}
      >
        ♥
        {favorites.length > 0 && (
          <span
            className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
            style={{ fontFamily: "var(--font-mono)", background: "var(--color-accent)", color: "#080808" }}
          >
            {favorites.length > 9 ? "9+" : favorites.length}
          </span>
        )}
      </button>

      {/* backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[499]"
          style={{ background: "rgba(0,0,0,0.5)" }}
        />
      )}

      {/* slide-in drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 w-80 z-[600] flex flex-col overflow-y-auto"
        style={{
          background: "var(--color-surface)",
          borderLeft: "1px solid var(--color-border2)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* drawer header */}
        <div
          className="p-6 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--color-border2)" }}
        >
          <div>
            <div className="text-[28px]" style={{ fontFamily: "var(--font-display)", color: "var(--color-pink)" }}>
              Favorites
            </div>
            <div
              className="text-[10px] mt-0.5"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
            >
              {favorites.length} saved word{favorites.length !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-[20px] leading-none border-none bg-transparent"
            style={{ color: "var(--color-muted2)" }}
          >
            ×
          </button>
        </div>

        {/* list */}
        <div className="flex-1 p-4">
          {favorites.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-[32px] mb-3">♡</div>
              <p
                className="text-[12px] leading-[1.7]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
              >
                no favorites yet.<br />click ♡ on any card to save it.
              </p>
            </div>
          ) : (
            favorites.map(w => (
              <FavItem
                key={w.word}
                word={w}
                onOpen={() => { onOpen(w); setOpen(false); }}
                onSearch={() => { onSearch(w.word); setOpen(false); }}
                onRemove={() => onRemove(w)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

function FavItem({ word, onOpen, onSearch, onRemove }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onOpen}
      className="p-4 rounded-sm mb-2 cursor-pointer transition-colors duration-150"
      style={{
        border: "1px solid var(--color-border2)",
        background: hov ? "var(--color-card)" : "transparent",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[24px] leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
          {word.word}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="text-[16px] leading-none p-0.5 border-none bg-transparent"
          style={{ color: "var(--color-muted)" }}
        >
          ×
        </button>
      </div>
      <p
        className="text-[12px] leading-[1.6] mt-1.5 line-clamp-2"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-muted2)" }}
      >
        {word.meaning}
      </p>
      {hov && (
        <button
          onClick={e => { e.stopPropagation(); onSearch(); }}
          className="mt-2.5 text-[10px] px-2.5 py-1 rounded-sm border-none bg-transparent transition-colors"
          style={{
            fontFamily: "var(--font-mono)",
            border: "1px solid var(--color-border2)",
            color: "var(--color-muted2)",
          }}
        >
          search →
        </button>
      )}
    </div>
  );
}
