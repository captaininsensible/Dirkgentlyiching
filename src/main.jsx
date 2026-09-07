import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { getHexagramByPattern, getInterpretation, getSimilarHexagrams } from "./hexagrams";

const STORAGE_KEY = "dirk-gently-iching-history";

const LINE_TYPES = {
  6: { name: "Old Yin", short: "Changing yin", next: 7, isYang: false, isChanging: true },
  7: { name: "Young Yang", short: "Stable yang", next: 7, isYang: true, isChanging: false },
  8: { name: "Young Yin", short: "Stable yin", next: 8, isYang: false, isChanging: false },
  9: { name: "Old Yang", short: "Changing yang", next: 8, isYang: true, isChanging: true },
};

const randomCoins = () =>
  Array.from({ length: 3 }, () => (Math.random() < 0.5 ? "heads" : "tails"));

const getCoinPoints = (coin) => (coin === "heads" ? 3 : 2);

const getLineValue = (coins) =>
  coins.reduce((sum, coin) => sum + getCoinPoints(coin), 0);

const getPatternFromLines = (lines) =>
  lines
    .map((line) => (LINE_TYPES[line].isYang ? "1" : "0"))
    .join("");

const normalizeLines = (lines) =>
  lines.map((line) => (LINE_TYPES[line].isChanging ? LINE_TYPES[line].next : line));

function readHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function writeHistory(history) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

function playCompletionChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    const context = new AudioCtx();
    const start = context.currentTime;
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, start + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.08 + 0.34);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start + index * 0.08);
      oscillator.stop(start + index * 0.08 + 0.36);
    });

    window.setTimeout(() => {
      context.close().catch(() => {});
    }, 650);
  } catch {
    // Optional enhancement only.
  }
}

function createReading(lines, question) {
  const primary = getHexagramByPattern(getPatternFromLines(lines));
  const changingLines = lines
    .map((line, index) => (LINE_TYPES[line].isChanging ? index : -1))
    .filter((index) => index >= 0);
  const transformedLines = normalizeLines(lines);
  const relating =
    changingLines.length > 0
      ? getHexagramByPattern(getPatternFromLines(transformedLines))
      : null;
  const createdAt = new Date().toISOString();

  return {
    id: `${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    question: question.trim(),
    lines,
    changingLines,
    transformedLines,
    primary,
    relating,
  };
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function formatReadingText(reading) {
  const interpretation = getInterpretation(
    reading.primary,
    reading.relating,
    reading.question,
    reading.changingLines,
  );

  return [
    "Dirk Gently's Portable I Ching Machine",
    `Date: ${new Date(reading.createdAt).toLocaleString()}`,
    `Question: ${reading.question || "Unspoken question"}`,
    `Primary: ${reading.primary.number} • ${reading.primary.name}`,
    reading.relating ? `Relating: ${reading.relating.number} • ${reading.relating.name}` : "Relating: none",
    "",
    `Core Meaning: ${interpretation.coreMeaning}`,
    `Current Situation: ${interpretation.currentSituation}`,
    `Challenge: ${interpretation.challenge}`,
    `Guidance: ${interpretation.guidance}`,
    `Transformation: ${interpretation.transformation}`,
    `Timing: ${interpretation.timing}`,
    `Confucian Wisdom: ${interpretation.quote}`,
    `Taoist Principle: ${interpretation.tao}`,
    `Reflection Question: ${interpretation.reflection}`,
    interpretation.whatNow,
  ].join("\n");
}

function CoinTossAnimation({ question, onComplete }) {
  const [coins, setCoins] = useState(["heads", "tails", "heads"]);
  const [flipCount, setFlipCount] = useState(0);
  const [lineResults, setLineResults] = useState([]);
  const [currentLine, setCurrentLine] = useState(1);
  const [announcement, setAnnouncement] = useState("Preparing line 1 of 6.");
  const timersRef = useRef([]);

  useEffect(() => {
    let cancelled = false;

    const clearTimers = () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };

    const castLine = (lineIndex, collected = []) => {
      if (cancelled) {
        return;
      }

      if (lineIndex >= 6) {
        playCompletionChime();
        setAnnouncement("The six lines are complete.");
        onComplete(collected);
        return;
      }

      const finalCoins = randomCoins();
      let frames = 0;
      setCurrentLine(lineIndex + 1);
      setAnnouncement(`Casting line ${lineIndex + 1} of 6.`);

      const animateFrame = () => {
        if (cancelled) {
          return;
        }

        frames += 1;
        setFlipCount((count) => count + 1);
        setCoins(frames >= 8 ? finalCoins : randomCoins());

        if (frames >= 8) {
          const total = getLineValue(finalCoins);
          const nextResults = [...collected, total];
          setLineResults((previous) => [
            ...previous,
            { lineNumber: lineIndex + 1, coins: finalCoins, total, lineName: LINE_TYPES[total].name },
          ]);
          setAnnouncement(`Line ${lineIndex + 1} is ${total} points: ${LINE_TYPES[total].name}.`);
          const pause = window.setTimeout(() => castLine(lineIndex + 1, nextResults), 460);
          timersRef.current.push(pause);
          return;
        }

        const nextFrame = window.setTimeout(animateFrame, 90);
        timersRef.current.push(nextFrame);
      };

      animateFrame();
    };

    castLine(0, []);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [onComplete]);

  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-label="Coin toss animation">
      <div className="rounded-3xl border border-emerald-400/30 bg-slate-950/60 p-6 panel-glass">
        <div className="mb-4 flex flex-col gap-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Three coins • Six lines</p>
          <h2 className="text-2xl font-bold text-amber-300 md:text-3xl">Casting line {currentLine} of 6</h2>
          <p className="text-base italic text-emerald-100">{question || "Hold your question in stillness."}</p>
        </div>

        <div className="coin-stage flex flex-wrap justify-center gap-4 py-3 md:gap-8">
          {coins.map((coin, index) => (
            <motion.div
              key={index}
              className="coin-shell flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-200/60 text-4xl font-bold md:h-28 md:w-28"
              style={{
                background:
                  coin === "heads"
                    ? "radial-gradient(circle at 32% 28%, #fde68a 0%, #f59e0b 42%, #b45309 100%)"
                    : "radial-gradient(circle at 32% 28%, #d1fae5 0%, #10b981 42%, #065f46 100%)",
                boxShadow:
                  "0 22px 35px rgba(2, 6, 23, 0.4), inset 0 2px 12px rgba(255, 255, 255, 0.28), inset 0 -6px 12px rgba(15, 23, 42, 0.35)",
              }}
              animate={{
                rotateY: flipCount * 260 + index * 18,
                rotateX: flipCount * 130 + index * 12,
                scale: [1, 1.06, 1],
              }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <span className="coin-symbol text-slate-950">{coin === "heads" ? "3" : "2"}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-slate-900/60 p-4 text-center">
          <p className="text-sm text-amber-200">{announcement}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-emerald-300">
            Heads = 3 points • Tails = 2 points
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => {
          const result = lineResults[index];
          return (
            <div
              key={index}
              className={`rounded-2xl border p-4 text-left transition-all ${
                result
                  ? "border-amber-400/35 bg-slate-950/60 shadow-lg shadow-amber-950/30"
                  : "border-slate-700/70 bg-slate-900/35"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Line {index + 1}
                </span>
                <span className="text-sm text-amber-200">
                  {result ? `${result.total} points` : "Pending"}
                </span>
              </div>
              {result ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {result.coins.map((coin, coinIndex) => (
                      <span
                        key={coinIndex}
                        className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-100"
                      >
                        {coin === "heads" ? "Heads 3" : "Tails 2"}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-amber-100">{result.lineName}</p>
                </>
              ) : (
                <p className="text-sm text-slate-300">The running total for this line will appear here.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HexagramLine({ lineValue, isChanging, lineNumber, transformed }) {
  const displayValue = transformed ? LINE_TYPES[lineValue].next : lineValue;
  const isYang = LINE_TYPES[displayValue].isYang;

  return (
    <motion.div
      className={`rounded-2xl border px-4 py-3 ${isChanging ? "hex-line-glow border-amber-300/40 bg-amber-500/10" : "border-emerald-400/20 bg-slate-950/40"}`}
      initial={{ opacity: 0, x: transformed ? 18 : -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: lineNumber * 0.06 }}
    >
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-emerald-200">
        <span>Line {lineNumber}</span>
        <span>{transformed ? "Relating figure" : LINE_TYPES[lineValue].short}</span>
      </div>
      <div className="flex items-center justify-center gap-4">
        {isYang ? (
          <div className="hex-line-bar w-full" aria-hidden="true" />
        ) : (
          <>
            <div className="hex-line-bar h-3 flex-1" aria-hidden="true" />
            <div className="w-6" aria-hidden="true" />
            <div className="hex-line-bar h-3 flex-1" aria-hidden="true" />
          </>
        )}
      </div>
      {isChanging && !transformed && (
        <p className="mt-3 text-center text-sm text-amber-200">
          Changing line → {LINE_TYPES[LINE_TYPES[lineValue].next].name}
        </p>
      )}
    </motion.div>
  );
}

function HexagramFigure({ lines, changingLines, transformed = false }) {
  const displayLines = transformed ? normalizeLines(lines) : lines;
  const orderedLines = displayLines
    .map((line, index) => ({ line, index }))
    .slice()
    .reverse();

  return (
    <div className="space-y-3">
      {orderedLines.map(({ line, index }) => {
        const originalIndex = displayLines.length - 1 - index;
        return (
          <HexagramLine
            key={`${transformed ? "relating" : "primary"}-${originalIndex}`}
            lineValue={transformed ? lines[originalIndex] : line}
            isChanging={changingLines.includes(originalIndex)}
            lineNumber={originalIndex + 1}
            transformed={transformed}
          />
        );
      })}
    </div>
  );
}

function HexagramCard({ title, hexagram, lines, changingLines, transformed = false }) {
  return (
    <motion.section
      className="rounded-3xl border border-amber-300/25 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-emerald-950/60 p-6 panel-glass"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">{title}</p>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold text-amber-200 md:text-4xl">
            {hexagram.number}. {hexagram.name}
          </h3>
          <p className="mt-2 text-lg italic text-emerald-100">{hexagram.image}</p>
          <p className="mt-2 text-sm text-slate-200">{hexagram.theme}</p>
        </div>
        <div className="ornament-ring text-4xl text-amber-300">☯</div>
      </div>

      <div className="mt-6">
        <HexagramFigure lines={lines} changingLines={changingLines} transformed={transformed} />
      </div>
    </motion.section>
  );
}

function InsightBlock({ title, children, accent = "amber" }) {
  const accentClasses =
    accent === "emerald"
      ? "border-emerald-400/30 bg-emerald-500/10"
      : "border-amber-400/30 bg-amber-500/10";

  return (
    <div className={`rounded-2xl border p-4 ${accentClasses}`}>
      <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-100">{title}</h4>
      <p className="mt-2 text-sm leading-7 text-slate-200">{children}</p>
    </div>
  );
}

function HistoryPanel({ history, onSelect, onExport }) {
  return (
    <aside className="rounded-3xl border border-emerald-400/20 bg-slate-950/70 p-5 panel-glass">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-emerald-200">Reading History</h3>
          <p className="mt-1 text-sm text-slate-300">Saved locally in your browser.</p>
        </div>
        <button
          type="button"
          onClick={onExport}
          className="rounded-full border border-amber-300/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
        >
          Export JSON
        </button>
      </div>

      <div className="history-scroll mt-5 max-h-[28rem] space-y-3 overflow-auto pr-1">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-300">
            Your readings will appear here after you complete a consultation.
          </div>
        ) : (
          history.map((reading) => (
            <button
              key={reading.id}
              type="button"
              onClick={() => onSelect(reading)}
              className="w-full rounded-2xl border border-emerald-400/20 bg-slate-900/65 p-4 text-left transition hover:border-amber-300/40 hover:bg-slate-900"
              aria-label={`Open reading ${reading.primary.number} ${reading.primary.name}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
                    {new Date(reading.createdAt).toLocaleDateString()}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-amber-200">
                    {reading.primary.number}. {reading.primary.name}
                  </h4>
                </div>
                <span className="rounded-full border border-amber-400/25 px-3 py-1 text-xs text-amber-100">
                  {reading.changingLines.length > 0 ? "Changing" : "Stable"}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-200">{reading.question || "Unspoken question"}</p>
              {reading.relating && (
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-emerald-200">
                  → {reading.relating.number}. {reading.relating.name}
                </p>
              )}
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export default function DirkGentlyIchingMachine() {
  const [state, setState] = useState("idle");
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState(null);
  const [history, setHistory] = useState(() => readHistory());

  const interpretation = useMemo(
    () =>
      reading
        ? getInterpretation(reading.primary, reading.relating, reading.question, reading.changingLines)
        : null,
    [reading],
  );
  const similarHexagrams = useMemo(
    () => (reading ? getSimilarHexagrams(reading.primary) : []),
    [reading],
  );

  useEffect(() => {
    writeHistory(history);
  }, [history]);

  const handleConsult = () => {
    setReading(null);
    setState("tossing");
  };

  const handleTossComplete = (results) => {
    const nextReading = createReading(results, question);
    setReading(nextReading);
    setHistory((previous) => [nextReading, ...previous].slice(0, 12));
    setState("result");
  };

  const handleReset = () => {
    setReading(null);
    setQuestion("");
    setState("idle");
  };

  const handleSelectReading = (savedReading) => {
    setQuestion(savedReading.question);
    setReading(savedReading);
    setState("result");
  };

  const handleExportHistory = () => {
    downloadFile(
      "iching-reading-history.json",
      JSON.stringify(history, null, 2),
      "application/json",
    );
  };

  const handleExportReading = () => {
    if (!reading) {
      return;
    }

    downloadFile(
      `iching-reading-${reading.primary.number}-${reading.createdAt.slice(0, 10)}.txt`,
      formatReadingText(reading),
      "text/plain;charset=utf-8",
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-8 text-white md:px-8">
      <div className="pointer-events-none absolute left-4 top-4 text-7xl opacity-15">🎋</div>
      <div className="pointer-events-none absolute bottom-5 right-4 text-7xl opacity-15">🎋</div>
      <div className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 text-6xl opacity-10">☯</div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.header
          className="mx-auto mb-10 max-w-4xl text-center"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm uppercase tracking-[0.45em] text-amber-300">易經 • I Ching • Divination</p>
          <h1 className="mt-4 bg-gradient-to-r from-emerald-300 via-emerald-100 to-amber-200 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Dirk Gently&apos;s Portable I Ching Machine
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-emerald-50/90">
            Ask a sincere question, watch the coins form each line, and receive a fuller reading with hexagram
            wisdom, changing-line guidance, and a record you can return to later.
          </p>
        </motion.header>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <main className="space-y-8">
            <section className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/70 p-6 panel-glass md:p-8">
              <label htmlFor="question" className="block text-lg font-semibold text-emerald-100">
                靜心提問 • Formulate your question
              </label>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Keep the question open enough for wisdom and specific enough to matter to your life now.
              </p>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What would you like the oracle to illuminate?"
                aria-label="Question for the I Ching"
                className="mt-4 w-full rounded-2xl border border-amber-300/35 bg-slate-900/85 px-5 py-4 text-lg text-emerald-50 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/40"
              />
              <div className="mt-5 flex flex-wrap gap-3">
                <motion.button
                  type="button"
                  onClick={handleConsult}
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-amber-600 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-950/40 transition hover:from-emerald-400 hover:to-amber-500"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cast the coins
                </motion.button>
                {reading && (
                  <motion.button
                    type="button"
                    onClick={handleExportReading}
                    className="rounded-full border border-amber-300/35 bg-amber-500/10 px-6 py-3 text-base font-semibold text-amber-100 transition hover:bg-amber-500/20"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Export this reading
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-6 py-3 text-base font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Clear
                </motion.button>
              </div>
            </section>

            <AnimatePresence mode="wait">
              {state === "idle" && (
                <motion.section
                  key="idle"
                  className="rounded-[2rem] border border-dashed border-emerald-400/25 bg-slate-950/45 p-8 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-xl text-amber-200">When you are ready, cast the coins six times to form the hexagram.</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Each toss records the three coin values, the line total, and the way the reading is transforming.
                  </p>
                </motion.section>
              )}

              {state === "tossing" && (
                <motion.section
                  key="tossing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CoinTossAnimation question={question} onComplete={handleTossComplete} />
                </motion.section>
              )}

              {state === "result" && reading && interpretation && (
                <motion.section
                  key={reading.id}
                  className="space-y-8"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                >
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                    <HexagramCard
                      title="Primary Hexagram"
                      hexagram={reading.primary}
                      lines={reading.lines}
                      changingLines={reading.changingLines}
                    />

                    <div className="flex items-center justify-center">
                      <motion.div
                        className="rounded-full border border-amber-300/35 bg-amber-500/10 px-4 py-3 text-sm uppercase tracking-[0.3em] text-amber-100"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        transforms
                      </motion.div>
                    </div>

                    {reading.relating ? (
                      <HexagramCard
                        title="Relating Hexagram"
                        hexagram={reading.relating}
                        lines={reading.lines}
                        changingLines={reading.changingLines}
                        transformed
                      />
                    ) : (
                      <div className="rounded-3xl border border-emerald-400/20 bg-slate-950/55 p-6 panel-glass">
                        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Stable Reading</p>
                        <h3 className="mt-3 text-2xl font-bold text-amber-200">No changing lines</h3>
                        <p className="mt-3 leading-7 text-slate-200">
                          This consultation emphasizes depth within one hexagram rather than movement into another.
                        </p>
                      </div>
                    )}
                  </div>

                  <section className="rounded-[2rem] border border-amber-300/25 bg-slate-950/70 p-6 panel-glass md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.32em] text-emerald-300">Divination</p>
                        <h2 className="mt-2 text-3xl font-bold text-amber-200">A fuller reading</h2>
                        <p className="mt-2 text-sm text-slate-300">{interpretation.changingCountText}</p>
                      </div>
                      <div className="rounded-2xl border border-emerald-300/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-50">
                        <p>{reading.question || "Question held in silence"}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <InsightBlock title="Core meaning">{interpretation.coreMeaning}</InsightBlock>
                      <InsightBlock title="Current situation" accent="emerald">
                        {interpretation.currentSituation}
                      </InsightBlock>
                      <InsightBlock title="Challenge">{interpretation.challenge}</InsightBlock>
                      <InsightBlock title="Guidance" accent="emerald">
                        {interpretation.guidance}
                      </InsightBlock>
                      <InsightBlock title="Transformation">{interpretation.transformation}</InsightBlock>
                      <InsightBlock title="Hexagram relationship" accent="emerald">
                        {interpretation.relationship}
                      </InsightBlock>
                      <InsightBlock title="Timing insight">{interpretation.timing}</InsightBlock>
                      <InsightBlock title="What this means for you now" accent="emerald">
                        {interpretation.whatNow}
                      </InsightBlock>
                    </div>
                  </section>

                  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <InsightBlock title="Confucian wisdom">{interpretation.quote}</InsightBlock>
                    <InsightBlock title="Taoist principle" accent="emerald">
                      {interpretation.tao}
                    </InsightBlock>
                    <InsightBlock title="Reflection question">{interpretation.reflection}</InsightBlock>
                    <InsightBlock title="Similar readings" accent="emerald">
                      {similarHexagrams
                        .map((hexagram) => `${hexagram.number}. ${hexagram.name}`)
                        .join(" • ")}
                    </InsightBlock>
                  </section>
                </motion.section>
              )}
            </AnimatePresence>
          </main>

          <HistoryPanel history={history} onSelect={handleSelectReading} onExport={handleExportHistory} />
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<DirkGentlyIchingMachine />);
