import { useState, useCallback } from "react";
import Cursor          from "./components/Cursor.jsx";
import Ticker          from "./components/Ticker.jsx";
import SearchBar       from "./components/SearchBar.jsx";
import HistoryBar      from "./components/HistoryBar.jsx";
import SlangCard       from "./components/SlangCard.jsx";
import RandomWord      from "./components/RandomWord.jsx";
import Trending        from "./components/Trending.jsx";
import WordModal       from "./components/WordModal.jsx";
import FavoritesPanel  from "./components/FavoritesPanel.jsx";
import QuizMode        from "./components/QuizMode.jsx";
import { useFavorites, useHistory } from "./hooks/useStorage.js";
import { api } from "./api.js";

export default function App() {
  const [view,    setView]    = useState("home");
  const [results, setResults] = useState([]);
  const [query,   setQuery]   = useState("");
  const [total,   setTotal]   = useState(0);
  const [errMsg,  setErrMsg]  = useState("");
  const [modal,   setModal]   = useState(null);
  const [quiz,    setQuiz]    = useState(false);

  const { favorites, toggle: toggleFav, isFav } = useFavorites();
  const { history, push: pushHistory, clear: clearHistory } = useHistory();

  const doSearch = useCallback(async q => {
    if (!q.trim()) return;
    setQuery(q);
    pushHistory(q);
    setView("loading");
    try {
      const data = await api.search(q, 9);
      setResults(data.results || []);
      setTotal(data.total || 0);
      setView("results");
    } catch (err) {
      setErrMsg(err.message);
      setView("error");
    }
  }, [pushHistory]);

  const goHome = () => { setView("home"); setResults([]); setQuery(""); };

  return (
    <>
      <Cursor />
      <Ticker />

      {/* ── Header ── */}
      <header
        className="relative z-10 px-8 py-7 flex items-center justify-between flex-wrap gap-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <button onClick={goHome} className="border-none bg-transparent p-0 text-left">
          <div
            className="leading-[0.88] tracking-[-0.01em]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(14px, 7vw, 38px)",
              color: "var(--color-ink)",
              paddingTop: "4px",
              marginLeft: "6px"
              
            }}
          >
            slay
            <span style={{ color: "var(--color-accent)" }}>pedia</span>
          </div>
          <div
            className="text-[10px] uppercase "
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)", marginLeft: "4px" }}
          >
            gen z slang, decoded
          </div>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          {/* quiz button */}
          <button
            onClick={() => setQuiz(true)}
            className="text-[11px] px-4 py-2 rounded-sm transition-all duration-150"
            style={{
              fontFamily: "var(--font-mono)",
              border: "1px solid var(--color-cyan)",
              background: "transparent",
              color: "var(--color-cyan)",
              padding: "2px 4px"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            quiz mode ↗
          </button>

            {/* live badge */}
            <span
              className="text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm flex items-center gap-1.5"
              style={{
                fontFamily: "var(--font-mono)",
                border: "1px solid var(--color-accent)",
                color: "var(--color-accent)",
                padding: "2px 4px",
                marginRight: "6px"
              }}
            >
              <span className="animate-pulse-dot">●</span> Live
            </span>
            {/* count badge */}
            {/* <span
              className="text-[10px] uppercase tracking-[0.1em] py-1 rounded-sm"
              style={{
                fontFamily: "var(--font-mono)",
                border: "1px solid var(--color-border2)",
                color: "var(--color-muted)",
                padding: "2px 6px"
              }}
            >
              1,779 words
            </span> */}
          
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 text-center px-8 py-[clamp(3rem,8vw,7rem)] flex flex-col items-center justify-center ">
        <p
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-pink)", marginTop: "6px", marginBottom: "6px" }}
        >
          ✦ the internet's slang dictionary ✦
        </p>

        <h1
          className="leading-[0.88] tracking-[0.01em]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(10px, 14vw, 80px)",

          }}
        >
          <span style={{ WebkitTextStroke: "2px var(--color-ink)", color: "transparent" }}>
            WHAT
          </span>
          <br />
          <span style={{ color: "var(--color-accent)" }}>DOES</span>
          <br />
          <span style={{ WebkitTextStroke: "2px var(--color-ink)", color: "transparent" }}>
            IT MEAN?
          </span>
        </h1>

        <p
          className="text-[clamp(10px,2vw,14px)] leading-[1.7] mx-auto mb-10"
          style={{ color: "var(--color-muted2)" }}
        >
          Search any Gen Z slang word and get the meaning, context & real examples.<br /> No cap.
        </p>

        <SearchBar onSearch={doSearch} loading={view === "loading"} />
        <HistoryBar history={history} onSearch={doSearch} onClear={clearHistory} />
      </section>

      {/* ── Main ── */}
      <main className="relative z-10 flex flex-col items-center justify-center"
        style={{
           padding: "6px 8px", 
           marginBottom: "80px",
        }}
      >

        {/* HOME */}
        {view === "home" && (
          <>
            <RandomWord onSearch={doSearch} />
            <Trending onSearch={doSearch} />

            {/* saved section */}
            {favorites.length > 0 && (
              <div className="mt-12">
                <div className="flex items-baseline gap-4 mb-5">
                  <h2
                    className="text-[32px]"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-pink)" }}
                  >
                    Saved
                  </h2>
                  <div className="flex-1 h-px" style={{ background: "var(--color-border2)" }} />
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
                  >
                    {favorites.length} word{favorites.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div
                  className="grid gap-px rounded-sm overflow-hidden"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    background: "var(--color-border)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {favorites.slice(0, 6).map((w, i) => (
                    <SlangCard
                      key={w.word}
                      {...w}
                      index={i}
                      onOpen={setModal}
                      onFav={toggleFav}
                      isFav={isFav}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* LOADING */}
        {view === "loading" && (
          <div className="text-center py-20">
            <div
              className="w-8 h-8 rounded-full animate-spin mx-auto mb-4"
              style={{ border: "2px solid var(--color-border2)", borderTopColor: "var(--color-accent)" }}
            />
            <p
              className="text-[12px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
            >
              looking it up...
            </p>
          </div>
        )}

        {/* RESULTS */}
        {view === "results" && (
          <>
            <div className="flex items-baseline gap-4 mb-6">
              <h2
                className="text-[32px]"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                "{query}"
              </h2>
              <div className="flex-1 h-px" style={{ background: "var(--color-border2)" }} />
              <span
                className="text-[11px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
              >
                {total.toLocaleString()} result{total !== 1 ? "s" : ""}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16">
                <div
                  className="text-[56px] mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-muted)" }}
                >
                  no cap 💀
                </div>
                <p
                  className="text-[12px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
                >
                  no results found for "{query}"
                </p>
              </div>
            ) : (
              <div
                className="grid gap-px rounded-sm overflow-hidden mb-8"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  background: "var(--color-border)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {results.map((r, i) => (
                  <SlangCard
                    key={`${r.word}-${i}`}
                    {...r}
                    index={i}
                    query={query}
                    onOpen={setModal}
                    onFav={toggleFav}
                    isFav={isFav}
                  />
                ))}
              </div>
            )}

            <div className="text-center">
              <GhostBtn onClick={goHome}>← back to home</GhostBtn>
            </div>
          </>
        )}

        {/* ERROR */}
        {view === "error" && (
          <div className="text-center py-16">
            <div
              className="text-[56px] mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-muted)" }}
            >
              yikes 💀
            </div>
            <p
              className="text-[12px] mb-6"
              style={{ fontFamily: "var(--font-mono)", color: "#ff6b6b" }}
            >
              {errMsg}
            </p>
            <p
              className="text-[11px] mb-8"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
            >
              make sure the backend is running:{" "}
              <span style={{ color: "var(--color-accent)" }}>cd backend && npm start</span>
            </p>
            <GhostBtn onClick={goHome}>← go home</GhostBtn>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      {/* <footer
        className="relative z-10 px-8 py-7 flex items-center justify-between flex-wrap gap-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <p
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
        >
          slaypedia · data via{" "}
          <a
            href="https://huggingface.co/datasets/MLBtrio/genz-slang-dataset"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--color-accent)", textDecoration: "none" }}
          >
            MLBtrio/genz-slang-dataset
          </a>
        </p>
        <p
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
        >
          api · <span style={{ color: "var(--color-muted2)" }}>localhost:3001</span>
        </p>
      </footer> */}

      {/* ── Overlays ── */}
      {modal && (
        <WordModal
          word={modal}
          onClose={() => setModal(null)}
          onFav={toggleFav}
          isFav={isFav}
          onSearch={q => { setModal(null); doSearch(q); }}
        />
      )}
      {quiz && <QuizMode onClose={() => setQuiz(false)} />}
      <FavoritesPanel
        favorites={favorites}
        onSearch={doSearch}
        onRemove={toggleFav}
        onOpen={setModal}
      />
    </>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-[12px] px-5 py-2.5 rounded-sm transition-all duration-150"
      style={{
        fontFamily: "var(--font-mono)",
        border: "1px solid var(--color-border2)",
        background: "transparent",
        color: "var(--color-muted2)",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "var(--color-ink)"; e.currentTarget.style.borderColor = "var(--color-muted)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted2)"; e.currentTarget.style.borderColor = "var(--color-border2)"; }}
    >
      {children}
    </button>
  );
}
