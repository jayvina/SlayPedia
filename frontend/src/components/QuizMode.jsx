import { useState, useEffect, useCallback } from "react";
import { api } from "../api.js";

const ROUNDS = 5;
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export default function QuizMode({ onClose }) {
  const [phase,   setPhase]   = useState("loading");
  const [words,   setWords]   = useState([]);
  const [round,   setRound]   = useState(0);
  const [score,   setScore]   = useState(0);
  const [choices, setChoices] = useState([]);
  const [picked,  setPicked]  = useState(null);
  const [correct, setCorrect] = useState(null);

  const buildRound = useCallback((wordList, idx) => {
    if (idx >= ROUNDS || idx >= wordList.length) { setPhase("done"); return; }
    const corr = wordList[idx];
    const pool = wordList.filter((_, i) => i !== idx);
    setChoices(shuffle([corr, ...shuffle(pool).slice(0, 3)]));
    setCorrect(corr);
    setPicked(null);
  }, []);

  const loadWords = useCallback(async () => {
    setPhase("loading");
    try {
      // ✅ fixed — declare them first
      const fetched = [];
      const needed  = ROUNDS + 3;

      for (let i = 0; i < needed; i++) {
        const word = await api.random();
        if (word?.word && word?.meaning) fetched.push(word);
      }
      const unique  = Object.values(
        Object.fromEntries(fetched.map(w => [w.word.toLowerCase(), w]))
      ).filter(w => w.meaning && w.word);
      setWords(unique);
      setRound(0);
      setScore(0);
      buildRound(unique, 0);
      setPhase("question");
    } catch {
      setPhase("error");
    }
  }, [buildRound]);

  useEffect(() => { loadWords(); }, [loadWords]);

  const pick = choice => {
    if (picked) return;
    setPicked(choice.word);
    const right = choice.word === correct.word;
    if (right) setScore(s => s + 1);
    setPhase(right ? "correct" : "wrong");
    setTimeout(() => {
      const next = round + 1;
      setRound(next);
      buildRound(words, next);
      setPhase(next >= ROUNDS ? "done" : "question");
    }, 1600);
  };

  const pct = Math.round((score / ROUNDS) * 100);

  const resultMsg =
    pct === 100 ? "understood the assignment fr fr 🏆"
    : pct >= 80  ? "lowkey bussin at gen z slang 🔥"
    : pct >= 60  ? "decent. not snatched tho 😐"
    : pct >= 40  ? "kinda delulu ngl 💀"
    : "no rizz for slang detected 😭";

  const scoreColor =
    pct >= 80 ? "var(--color-accent)"
    : pct >= 50 ? "var(--color-cyan)"
    : "var(--color-pink)";

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center animate-fadeup"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-md p-10"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border2)", padding: "12px 14px" }}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-[28px]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-cyan)" }}
          >
            slang quiz
          </span>
          <button
            onClick={onClose}
            className="text-[12px]  rounded-sm transition-all"
            style={{
              fontFamily: "var(--font-mono)",
              background: "transparent",
              border: "1px solid var(--color-border2)",
              color: "var(--color-muted2)",
              padding: "2px 3px",
            }}
          >
            quit
          </button>
        </div>

        {/* progress bar */}
        {phase !== "done" && phase !== "loading" && (
          <div className="mb-6">
            <div
              className="flex justify-between text-[10px] mb-1.5"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
            >
              <span>round {round + 1} of {ROUNDS}</span>
              <span>{score} correct</span>
            </div>
            <div
              className="h-[3px] rounded-sm overflow-hidden"
              style={{ background: "var(--color-border2)" }}
            >
              <div
                className="h-full rounded-sm transition-all duration-500"
                style={{
                  width: `${(round / ROUNDS) * 100}%`,
                  background: "var(--color-cyan)",
                }}
              />
            </div>
          </div>
        )}

        {/* loading */}
        {phase === "loading" && (
          <div className="text-center py-8">
            <div
              className="w-7 h-7 rounded-full animate-spin mx-auto mb-4"
              style={{ border: "2px solid var(--color-border2)", borderTopColor: "var(--color-cyan)" }}
            />
            <p
              className="text-[12px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
            >
              loading questions...
            </p>
          </div>
        )}

        {/* question */}
        {(phase === "question" || phase === "correct" || phase === "wrong") && correct && (
          <>
            <div
              className="text-[9px] uppercase tracking-[0.2em] mb-3"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
            >
              which word matches this definition?
            </div>

            <div
              className="rounded-sm p-5 mb-6"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border2)",
              }}
            >
              <p className="text-[15px] leading-[1.75]" style={{ color: "var(--color-ink)" }}>
                {correct.meaning}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {choices.map(c => {
                const isCorrect = c.word === correct.word;
                const isPicked  = c.word === picked;
                let bg     = "var(--color-surface)";
                let border = "var(--color-border2)";
                let color  = "var(--color-ink)";
                if (picked) {
                  if (isCorrect) { bg = "rgba(184,255,53,0.12)"; border = "var(--color-accent)"; color = "var(--color-accent)"; }
                  else if (isPicked) { bg = "rgba(255,60,172,0.12)"; border = "var(--color-pink)"; color = "var(--color-pink)"; }
                }
                return (
                  <button
                    key={c.word}
                    onClick={() => pick(c)}
                    disabled={!!picked}
                    className="text-[22px] p-4 text-left rounded-sm transition-all duration-200 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: bg,
                      border: `1px solid ${border}`,
                      color,
                    }}
                  >
                    {c.word}
                    {picked && isCorrect  && <span className="float-right text-[14px]">✓</span>}
                    {isPicked && !isCorrect && <span className="float-right text-[14px]">✗</span>}
                  </button>
                );
              })}
            </div>

            {picked && (
              <p
                className="text-center text-[11px] mt-4"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
              >
                {phase === "correct" ? "slay! you got it 🔥" : `lowkey an L. it was "${correct.word}"`}
              </p>
            )}
          </>
        )}

        {/* done screen */}
        {phase === "done" && (
          <div className="text-center">
            <div
              className="text-[72px] leading-none mb-2"
              style={{ fontFamily: "var(--font-display)", color: scoreColor }}
            >
              {pct}%
            </div>
            <p
              className="text-[32px] mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
            >
              {score}/{ROUNDS} correct
            </p>
            <p
              className="text-[13px] mb-8"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
            >
              {resultMsg}
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={loadWords}
                className="text-[12px] px-5 py-2.5 rounded-sm font-medium border-none"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "var(--color-accent)",
                  color: "#080808",
                  padding: "2px 10px",
                }}
              >
                play again
              </button>
              <button
                onClick={onClose}
                className="text-[12px] px-5 py-2.5 rounded-sm transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "transparent",
                  border: "1px solid var(--color-border2)",
                  color: "var(--color-muted2)",
                  padding: "2px 3px",
                }}
              >
                back to search
              </button>
            </div>
          </div>
        )}

        {/* error */}
        {phase === "error" && (
          <div className="text-center py-8">
            <p
              className="text-[12px] mb-4"
              style={{ fontFamily: "var(--font-mono)", color: "#ff6b6b" }}
            >
              couldn't load quiz — is the backend running?
            </p>
            <button
              onClick={loadWords}
              className="text-[12px] px-5 py-2.5 rounded-sm transition-all"
              style={{
                fontFamily: "var(--font-mono)",
                background: "transparent",
                border: "1px solid var(--color-border2)",
                color: "var(--color-muted2)",
              }}
            >
              retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
