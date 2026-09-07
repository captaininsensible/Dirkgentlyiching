import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";

const hexagrams = [
  { id: 1, name: "The Creative", unicode: "☀", meaning: "Heaven. Creative power." },
  { id: 2, name: "The Receptive", unicode: "☾", meaning: "Earth. Receptivity." },
  { id: 3, name: "Difficulty at the Beginning", unicode: "☹", meaning: "Water over thunder." },
  { id: 4, name: "Youthful Folly", unicode: "☺", meaning: "Mountain under heaven." },
  { id: 5, name: "Waiting", unicode: "♄", meaning: "Heaven over water." },
  { id: 6, name: "Conflict", unicode: "♃", meaning: "Tension and disagreement." },
  { id: 7, name: "The Army", unicode: "♂", meaning: "Organization and discipline." },
  { id: 8, name: "Holding Together", unicode: "♁", meaning: "Union and solidarity." },
  { id: 9, name: "The Taming Power of the Small", unicode: "☼", meaning: "Wind over heaven." },
  { id: 10, name: "Treading", unicode: "♌", meaning: "Heaven over lake." },
  { id: 11, name: "Peace", unicode: "♍", meaning: "Harmony and prosperity." },
  { id: 12, name: "Standstill", unicode: "♎", meaning: "Stagnation and reflection." },
  { id: 13, name: "Fellowship", unicode: "♏", meaning: "Community and celebration." },
  { id: 14, name: "Possession in Great Measure", unicode: "♐", meaning: "Fire over heaven." },
  { id: 15, name: "Modesty", unicode: "♑", meaning: "Humility and simplicity." },
  { id: 16, name: "Enthusiasm", unicode: "♒", meaning: "Thunder over earth." },
  { id: 17, name: "Following", unicode: "♓", meaning: "Lake over thunder." },
  { id: 18, name: "Work on What Has Been Spoiled", unicode: "☽", meaning: "Mountain over wind." },
  { id: 19, name: "Approach", unicode: "☾", meaning: "Earth over lake." },
  { id: 20, name: "Contemplation", unicode: "☽", meaning: "Wind over earth." },
  { id: 21, name: "Biting Through", unicode: "♈", meaning: "Fire over thunder." },
  { id: 22, name: "Grace", unicode: "♉", meaning: "Mountain over fire." },
  { id: 23, name: "Splitting Apart", unicode: "♊", meaning: "Mountain over earth." },
  { id: 24, name: "Return", unicode: "♋", meaning: "Earth over thunder." },
  { id: 25, name: "Innocence", unicode: "♌", meaning: "Heaven over thunder." },
  { id: 26, name: "The Taming Power of the Great", unicode: "♍", meaning: "Mountain over heaven." },
  { id: 27, name: "The Corners of the Mouth", unicode: "♎", meaning: "Mountain over thunder." },
  { id: 28, name: "Preponderance of the Great", unicode: "♏", meaning: "Lake over wind." },
  { id: 29, name: "The Abysmal", unicode: "♐", meaning: "Water repeated." },
  { id: 30, name: "The Clinging", unicode: "♑", meaning: "Fire repeated." },
  { id: 31, name: "Influence", unicode: "♒", meaning: "Lake over mountain." },
  { id: 32, name: "Duration", unicode: "♓", meaning: "Thunder over wind." },
  { id: 33, name: "Retreat", unicode: "♈", meaning: "Mountain over heaven." },
  { id: 34, name: "The Power of the Great", unicode: "♉", meaning: "Thunder over heaven." },
  { id: 35, name: "Progress", unicode: "♊", meaning: "Fire over earth." },
  { id: 36, name: "Darkening of the Light", unicode: "♋", meaning: "Earth over fire." },
  { id: 37, name: "The Family", unicode: "♌", meaning: "Wind over fire." },
  { id: 38, name: "Opposition", unicode: "♍", meaning: "Fire over lake." },
  { id: 39, name: "Obstruction", unicode: "♎", meaning: "Water over mountain." },
  { id: 40, name: "Deliverance", unicode: "♏", meaning: "Thunder over water." },
  { id: 41, name: "Decrease", unicode: "♐", meaning: "Mountain over lake." },
  { id: 42, name: "Increase", unicode: "♑", meaning: "Wind over thunder." },
  { id: 43, name: "Breakthrough", unicode: "♒", meaning: "Lake over heaven." },
  { id: 44, name: "Coming to Meet", unicode: "♓", meaning: "Wind over heaven." },
  { id: 45, name: "Gathering Together", unicode: "♈", meaning: "Water over lake." },
  { id: 46, name: "Pushing Upward", unicode: "♉", meaning: "Earth over wind." },
  { id: 47, name: "Oppression", unicode: "♊", meaning: "Lake over water." },
  { id: 48, name: "The Well", unicode: "♋", meaning: "Water over wind." },
  { id: 49, name: "Revolution", unicode: "♌", meaning: "Fire over lake." },
  { id: 50, name: "The Cauldron", unicode: "♍", meaning: "Wind over fire." },
  { id: 51, name: "The Arousing", unicode: "♎", meaning: "Thunder repeated." },
  { id: 52, name: "The Keeping Still", unicode: "♏", meaning: "Mountain repeated." },
  { id: 53, name: "Development", unicode: "♐", meaning: "Wind over mountain." },
  { id: 54, name: "The Marrying Maiden", unicode: "♑", meaning: "Thunder over lake." },
  { id: 55, name: "Abundance", unicode: "♒", meaning: "Fire over thunder." },
  { id: 56, name: "The Wanderer", unicode: "♓", meaning: "Fire over mountain." },
  { id: 57, name: "The Gentle", unicode: "♈", meaning: "Wind over wind." },
  { id: 58, name: "The Joyous", unicode: "♉", meaning: "Lake over lake." },
  { id: 59, name: "Dispersion", unicode: "♊", meaning: "Wind over water." },
  { id: 60, name: "Articulating", unicode: "♋", meaning: "Water over lake." },
  { id: 61, name: "Inner Truth", unicode: "♌", meaning: "Wind over lake." },
  { id: 62, name: "Preponderance of the Small", unicode: "♍", meaning: "Thunder over mountain." },
  { id: 63, name: "After Completion", unicode: "♎", meaning: "Water over fire." },
  { id: 64, name: "Before Completion", unicode: "♏", meaning: "Fire over water." }
];

const LINE_TYPES = {
  6: { symbol: "-- x --", name: "Old Yin", value: 0, changingTo: 7 },
  7: { symbol: "-----", name: "Young Yang", value: 1, changingTo: null },
  8: { symbol: "-- --", name: "Young Yin", value: 0, changingTo: null },
  9: { symbol: "--- o ---", name: "Old Yang", value: 1, changingTo: 8 }
};

function LineDisplay({ lineValue, index, isChanging }) {
  const line = LINE_TYPES[lineValue];
  return (
    <motion.div
      className={`text-2xl md:text-3xl font-mono text-center py-1 ${isChanging ? "text-amber-300" : "text-emerald-100"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
    >
      {line.symbol}
      {isChanging && <span className="ml-2 text-sm">{" → "}{LINE_TYPES[line.changingTo].symbol}</span>}
    </motion.div>
  );
}

function CoinTossAnimation({ onComplete }) {
  const [coins, setCoins] = useState([]);
  const [flips, setFlips] = useState(0);

  useEffect(() => {
    const coinCount = 3;
    const tossCount = 6;
    let currentFlips = 0;
    const results = [];

    const flipInterval = setInterval(() => {
      currentFlips++;
      setFlips(currentFlips);
      const newCoins = Array.from({ length: coinCount }, () =>
        Math.random() < 0.5 ? "heads" : "tails"
      );
      setCoins(newCoins);

      if (currentFlips % 3 === 0) {
        const sum = newCoins.filter(c => c === "heads").length * 3 +
                   newCoins.filter(c => c === "tails").length * 2;
        results.push(sum);
      }

      if (currentFlips >= tossCount * 3) {
        clearInterval(flipInterval);
        onComplete(results);
      }
    }, 200);

    return () => clearInterval(flipInterval);
  }, [onComplete]);

  return (
    <div className="flex justify-center items-center gap-4 md:gap-8 py-8">
      {coins.map((coin, index) => (
        <motion.div
          key={index}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl font-bold"
          style={{
            background: coin === "heads" 
              ? "radial-gradient(circle at 30% 30%, #ffd700, #ffed4e, #b8860b)" 
              : "radial-gradient(circle at 30% 30%, #c9a961, #daa520, #8b7500)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(0, 0, 0, 0.3)",
            border: "3px solid #8b7500"
          }}
          animate={{ 
            rotateY: flips * 360, 
            rotateX: flips * 180
          }}
          transition={{ duration: 0.15, ease: "linear" }}
        >
          <span style={{ 
            color: coin === "heads" ? "#b8860b" : "#ffd700",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}>
            {coin === "heads" ? "☰" : "☷"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function HexagramDisplay({ hexagram, changingHexagram, lines, changingLines }) {
  const mainHex = hexagrams[hexagram.id - 1];

  return (
    <motion.div
      className="bg-gradient-to-br from-emerald-900/60 to-amber-900/40 backdrop-blur-sm rounded-lg p-6 md:p-8 max-w-2xl mx-auto border-2 border-amber-600/50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <div className="text-6xl md:text-8xl mb-4">{mainHex.unicode}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-amber-300" style={{ fontFamily: "serif" }}>
          {mainHex.name}
        </h2>
        <p className="text-emerald-100 mt-2 text-lg italic">{mainHex.meaning}</p>
      </div>

      <div className="space-y-2 mb-6 bg-black/20 p-4 rounded border-l-4 border-amber-600">
        {lines.slice().reverse().map((line, index) => (
          <LineDisplay
            key={index}
            lineValue={line}
            index={index}
            isChanging={changingLines.includes(5 - index)}
          />
        ))}
      </div>

      {changingHexagram && (
        <motion.div
          className="mt-6 pt-6 border-t-2 border-amber-600/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-amber-200 mb-2">✦ 變 (Changing) ✦</h3>
          <div className="text-center">
            <div className="text-4xl md:text-5xl mb-2">
              {hexagrams[changingHexagram.id - 1].unicode}
            </div>
            <h4 className="text-xl font-bold text-amber-300">
              {hexagrams[changingHexagram.id - 1].name}
            </h4>
            <p className="text-emerald-100 text-sm mt-1 italic">
              {hexagrams[changingHexagram.id - 1].meaning}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function DirkGentlyIchingMachine() {
  const [state, setState] = useState("idle");
  const [hexagram, setHexagram] = useState(null);
  const [changingHexagram, setChangingHexagram] = useState(null);
  const [lines, setLines] = useState([]);
  const [changingLines, setChangingLines] = useState([]);
  const [question, setQuestion] = useState("");

  const handleConsult = () => {
    setState("tossing");
    setHexagram(null);
    setChangingHexagram(null);
  };

  const handleTossComplete = (results) => {
    const hexValue = results.reduce((acc, val) => {
      const lineValue = LINE_TYPES[val].value;
      return (acc << 1) | lineValue;
    }, 0);
    const hexId = hexValue + 1;

    const changingIndices = results
      .map((r, i) => (r === 6 || r === 9 ? i : -1))
      .filter(i => i !== -1);

    setLines(results);
    setChangingLines(changingIndices);
    setHexagram({ id: hexId });

    if (changingIndices.length > 0) {
      const newLines = [...results];
      for (const idx of changingIndices) {
        newLines[idx] = results[idx] === 6 ? 7 : 8;
      }
      const changingValue = newLines.reduce((acc, val) => {
        const lineValue = LINE_TYPES[val].value;
        return (acc << 1) | lineValue;
      }, 0);
      setChangingHexagram({ id: changingValue + 1 });
    } else {
      setChangingHexagram(null);
    }
    setState("result");
  };

  const handleReset = () => {
    setState("idle");
    setQuestion("");
    setHexagram(null);
    setChangingHexagram(null);
    setLines([]);
    setChangingLines([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 text-white p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 opacity-10 text-8xl pointer-events-none">🎋</div>
      <div className="absolute bottom-0 right-0 opacity-10 text-8xl pointer-events-none">🎋</div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-3xl mb-3 tracking-widest text-amber-300">易經 • I CHING • 易經</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent" style={{ fontFamily: "serif" }}>
            Dirk Gently's Portable I Ching Machine
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto italic">
            Think of a question and consult the ancient wisdom of the I Ching.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="idle"
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-8 bg-emerald-900/30 p-6 rounded-lg border border-amber-600/30 backdrop-blur-sm">
                <label className="block text-emerald-100 mb-4 text-lg font-semibold">
                  靜心提問 • Formulate your question...
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What shall I consult the I Ching about?"
                  className="w-full max-w-lg mx-auto p-4 rounded-lg bg-slate-900/50 border-2 border-amber-600/50 text-emerald-100 placeholder-emerald-400 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                />
              </div>

              <motion.button
                onClick={handleConsult}
                className="px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-400/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                求籤 • Consult the I Ching
              </motion.button>
            </motion.div>
          )}

          {state === "tossing" && (
            <motion.div
              key="tossing"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-amber-300 mb-6" style={{ fontFamily: "serif" }}>
                ✦ The Coins Are Tossing... ✦
              </h2>
              <CoinTossAnimation onComplete={handleTossComplete} />
              <p className="text-emerald-100 italic text-lg">
                {question || "靜心冥想... Contemplating your query..."}
              </p>
            </motion.div>
          )}

          {state === "result" && hexagram && (
            <motion.div
              key="result"
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HexagramDisplay
                hexagram={hexagram}
                changingHexagram={changingHexagram}
                lines={lines}
                changingLines={changingLines}
              />

              <motion.div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={handleReset}
                  className="px-6 py-3 bg-emerald-700/50 hover:bg-emerald-600/50 text-white font-semibold rounded-lg transition-colors duration-300 border border-emerald-500/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  新的問卜 • New Consultation
                </motion.button>

                <motion.button
                  onClick={handleConsult}
                  className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-semibold rounded-lg transition-all duration-300 border border-amber-400/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  再問卜 • Consult Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="text-center mt-12 md:mt-16 text-emerald-200/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>
            Inspired by Douglas Adams' Dirk Gently's Holistic Detective Agency.
            The I Ching is an ancient Chinese divination text.
          </p>
          <p className="mt-2 text-amber-300/60">🎋 易經 • 易經 🎋</p>
        </motion.div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<DirkGentlyIchingMachine />);