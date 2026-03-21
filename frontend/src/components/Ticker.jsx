const WORDS = [
  "rizz","no cap","bussin","slay","it's giving","understood the assignment",
  "rent free","lowkey","hits different","delulu","main character","snatched","periodt","ate that",
];

export default function Ticker() {
  const doubled = [...WORDS, ...WORDS];
  return (
    <div
      className="overflow-hidden py-[9px] relative z-10"
      style={{ background: "var(--color-accent)" }}
      aria-hidden
    >
      <div className="inline-flex whitespace-nowrap animate-ticker">
        {doubled.map((w, i) => (
          <span
            key={i}
            className="px-7 text-[11px] font-medium uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-mono)", color: "#080808" }}
          >
            {w} <span className="opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
