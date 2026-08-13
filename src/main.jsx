import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createRoot } from "react-dom/client";

// I Ching Hexagram Data (64 hexagrams)
const hexagrams = [
  { id: 1, name: "The Creative", unicode: "☀", meaning: "Heaven. Creative power, strength, energy. The strong force that initiates all things." },
  { id: 2, name: "The Receptive", unicode: "☾", meaning: "Earth. Receptivity, devotion, motherhood. The yielding force that receives and nurtures." },
  { id: 3, name: "Difficulty at the Beginning", unicode: "☹", meaning: "Water over thunder. Initial confusion, but growth comes through patience and perseverance." },
  { id: 4, name: "Youthful Folly", unicode: "☺", meaning: "Mountain under heaven. Inexperience, but also growth and learning through mistakes." },
  { id: 5, name: "Waiting", unicode: "♄", meaning: "Heaven over water. Patience is required. Wait for the right moment to act." },
  { id: 6, name: "Conflict", unicode: "♃", meaning: "Heaven over water. Tension and disagreement, but resolution is possible through honesty." },
  { id: 7, name: "The Army", unicode: "♂", meaning: "Earth over water. Organization, discipline, collective effort. Leadership is needed." },
  { id: 8, name: "Holding Together", unicode: "♁", meaning: "Water over earth. Union, solidarity, unity. Strength in numbers." },
  { id: 9, name: "The Taming Power of the Small", unicode: "☼", meaning: "Wind over heaven. Gentle influence, subtle power. Small things can have great effect." },
  { id: 10, name: "Treading", unicode: "♌", meaning: "Heaven over lake. Caution, careful conduct. Walk the path with awareness." },
  { id: 11, name: "Peace", unicode: "♍", meaning: "Earth over heaven. Harmony, prosperity, the natural order of things." },
  { id: 12, name: "Standstill", unicode: "♎", meaning: "Heaven over earth. Stagnation, but also a time for inner reflection and preparation." },
  { id: 13, name: "Fellowship", unicode: "♏", meaning: "Heaven over fire. Community, shared purpose, celebration. Together we are stronger." },
  { id: 14, name: "Possession in Great Measure", unicode: "♐", meaning: "Fire over heaven. Great wealth, abundance, generosity. Share your blessings." },
  { id: 15, name: "Modesty", unicode: "♑", meaning: "Earth over mountain. Humility, simplicity. The quiet power of the unassuming." },
  { id: 16, name: "Enthusiasm", unicode: "♒", meaning: "Thunder over earth. Joy, inspiration, collective energy. Let your passion guide you." },
  { id: 17, name: "Following", unicode: "♓", meaning: "Lake over thunder. Adaptability, going with the flow. Leadership through example." },
  { id: 18, name: "Work on What Has Been Spoiled", unicode: "☽", meaning: "Mountain over wind. Repair, renewal, correcting past mistakes. Healing is possible." },
  { id: 19, name: "Approach", unicode: "☾", meaning: "Earth over lake. Gradual progress, things coming together. Patience brings reward." },
  { id: 20, name: "Contemplation", unicode: "☽", meaning: "Wind over earth. Observation, reflection, viewing from above. Gain perspective before acting." },
  { id: 21, name: "Biting Through", unicode: "♈", meaning: "Fire over thunder. Justice, clarity, cutting through confusion. Truth will prevail." },
  { id: 22, name: "Grace", unicode: "♉", meaning: "Mountain over fire. Elegance, refinement, beauty. Form and function in harmony." },
  { id: 23, name: "Splitting Apart", unicode: "♊", meaning: "Mountain over earth. Disintegration, but also the opportunity for renewal. Let go of what no longer serves." },
  { id: 24, name: "Return", unicode: "♋", meaning: "Earth over thunder. Coming back, renewal, the turning point. A new cycle begins." },
  { id: 25, name: "Innocence", unicode: "♌", meaning: "Heaven over thunder. Spontaneity, naturalness, the wisdom of the child. Trust your instincts." },
  { id: 26, name: "The Taming Power of the Great", unicode: "♍", meaning: "Mountain over heaven. Cultivation, nurturing great potential. Great things require great care." },
  { id: 27, name: "The Corners of the Mouth", unicode: "♎", meaning: "Mountain over thunder. Words, nourishment, the power of speech. Choose your words wisely." },
  { id: 28, name: "Preponderance of the Great", unicode: "♏", meaning: "Lake over wind. Burden, responsibility, but also strength. Carry your load with dignity." },
  { id: 29, name: "The Abysmal", unicode: "♐", meaning: "Water repeated. Danger, the unknown, but also depth and mystery. Face your fears." },
  { id: 30, name: "The Clinging", unicode: "♑", meaning: "Fire repeated. Light, clarity, dependence. Stay true to your inner light." },
  { id: 31, name: "Influence", unicode: "♒", meaning: "Lake over mountain. Attraction, courtship, the power of mutual feeling. Let yourself be moved." },
  { id: 32, name: "Duration", unicode: "♓", meaning: "Thunder over wind. Continuity, endurance, lasting power. What endures has value." },
  { id: 33, name: "Retreat", unicode: "♈", meaning: "Mountain over heaven. Withdrawal, strategy, knowing when to step back. Sometimes retreat is the wisest action." },
  { id: 34, name: "The Power of the Great", unicode: "♉", meaning: "Thunder over heaven. Strength, vitality, the power of life itself. Harness your energy." },
  { id: 35, name: "Progress", unicode: "♊", meaning: "Fire over earth. Advancement, movement forward. The time is right for action." },
  { id: 36, name: "Darkening of the Light", unicode: "♋", meaning: "Earth over fire. Difficulty, setbacks, but also the wisdom of experience. Light will return." },
  { id: 37, name: "The Family", unicode: "♌", meaning: "Wind over fire. Home, relationships, the foundation of society. Nurture your connections." },
  { id: 38, name: "Opposition", unicode: "♍", meaning: "Fire over lake. Conflict, difference of opinion. Seek common ground." },
  { id: 39, name: "Obstruction", unicode: "♎", meaning: "Water over mountain. Delays, obstacles, but also the opportunity for inner growth. Patience is a virtue." },
  { id: 40, name: "Deliverance", unicode: "♏", meaning: "Thunder over water. Liberation, breaking free, a thunderstorm clears the air. Freedom is coming." },
  { id: 41, name: "Decrease", unicode: "♐", meaning: "Mountain over lake. Letting go, simplification, reducing to the essential. Less can be more." },
  { id: 42, name: "Increase", unicode: "♑", meaning: "Wind over thunder. Growth, expansion, abundance. Good fortune is increasing." },
  { id: 43, name: "Breakthrough", unicode: "♒", meaning: "Lake over heaven. Resolution, decisive action, water breaking through the dam. The time for action is now." },
  { id: 44, name: "Coming to Meet", unicode: "♓", meaning: "Wind over heaven. Encounter, opportunity, meeting someone significant. Be open to new connections." },
  { id: 45, name: "Gathering Together", unicode: "♈", meaning: "Water over lake. Unity, community, coming together for a common purpose. Together we achieve more." },
  { id: 46, name: "Pushing Upward", unicode: "♉", meaning: "Earth over wind. Gradual progress, steady growth. Keep moving forward." },
  { id: 47, name: "Oppression", unicode: "♊", meaning: "Lake over water. Constraint, difficulty, but also the pressure that creates diamonds. Persevere." },
  { id: 48, name: "The Well", unicode: "♋", meaning: "Water over wind. Nourishment, community resources, the source of life. Draw from the well of wisdom." },
  { id: 49, name: "Revolution", unicode: "♌", meaning: "Fire over lake. Change, upheaval, the old giving way to the new. Embrace transformation." },
  { id: 50, name: "The Cauldron", unicode: "♍", meaning: "Wind over fire. Culture, civilization, the vessel that holds society together. Nurture what sustains you." },
  { id: 51, name: "The Arousing", unicode: "♎", meaning: "Thunder repeated. Shock, awakening, sudden realization. A thunderclap of truth." },
  { id: 52, name: "The Keeping Still", unicode: "♏", meaning: "Mountain repeated. Stillness, meditation, going within. The mountain stands unmoving." },
  { id: 53, name: "Development", unicode: "♐", meaning: "Wind over mountain. Gradual growth, evolution, the slow unfolding of potential. Nature takes its course." },
  { id: 54, name: "The Marrying Maiden", unicode: "♑", meaning: "Thunder over lake. New beginnings, marriage, partnerships. A time for union." },
  { id: 55, name: "Abundance", unicode: "♒", meaning: "Fire over thunder. Prosperity, richness, the fullness of life. Rejoice in your good fortune." },
  { id: 56, name: "The Wanderer", unicode: "♓", meaning: "Fire over mountain. Journey, exploration, seeking new horizons. The traveler finds wisdom." },
  { id: 57, name: "The Gentle", unicode: "♈", meaning: "Wind over wind. Penetration, subtlety, the power of the gentle. Water wears away the stone." },
  { id: 58, name: "The Joyous", unicode: "♉", meaning: "Lake over lake. Joy, celebration, the pleasure of being alive. Share your happiness." },
  { id: 59, name: "Dispersion", unicode: "♊", meaning: "Wind over water. Scattering, release, letting go. The wind disperses the clouds." },
  { id: 60, name: "Articulating", unicode: "♋", meaning: "Water over lake. Moderation, temperance, the middle way. Balance brings harmony." },
  { id: 61, name: "Inner Truth", unicode: "♌", meaning: "Wind over lake. Sincerity, integrity, the heart's truth. Be true to yourself." },
  { id: 62, name: "Preponderance of the Small", unicode: "♍", meaning: "Thunder over mountain. Small things, details, the power of the minute. Pay attention to the little things." },
  { id: 63, name: "After Completion", unicode: "♎", meaning: "Water over fire. Completion, but also the seeds of the next beginning. All things pass." },
  { id: 64, name: "Before Completion", unicode: "♏", meaning: "Fire over water. The point before completion, the moment of greatest tension. Stay alert." }
];

const LINE_TYPES = {
  6: { symbol: "-- x --", name: "Old Yin", value: 0, changingTo: 7 },
  7: { symbol: "-----", name: "Young Yang", value: 1, changingTo: null },
  8: { symbol: "-- --", name: "Young Yin", value: 0, changingTo: null },
  9: { symbol: "--- o ---", name: "Old Yang", value: 1, changingTo: 8 }
};

function generateHexagram() {
  const lines = [];
  const changingLines = [];
  for (let i = 0; i < 6; i++) {
    const coin1 = Math.random() < 0.5 ? 2 : 3;
    const coin2 = Math.random() < 0.5 ? 2 : 3;
    const coin3 = Math.random() < 0.5 ? 2 : 3;
    const sum = coin1 + coin2 + coin3;
    lines.push(sum);
    if (sum === 6 || sum === 9) changingLines.push(i);
  }
  return { lines, changingLines };
}

function getChangingHexagram(lines, changingLines) {
  if (changingLines.length === 0) return null;
  const newLines = [...lines];
  for (const index of changingLines) {
    const line = lines[index];
    newLines[index] = line === 6 ? 7 : 8;
  }
  return { lines: newLines };
}

function LineDisplay({ lineValue, index, isChanging }) {
  const line = LINE_TYPES[lineValue];
  return (
    <motion.div
      className={`text-2xl md:text-3xl font-mono text-center py-1 ${isChanging ? "text-amber-400" : "text-white"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
    >
      {line.symbol}
      {isChanging && <span className="ml-2 text-sm">→ {LINE_TYPES[line.changingTo].symbol}</span>}
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
      className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 md:p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <div className="text-6xl md:text-8xl mb-4">{mainHex.unicode}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-amber-400">{mainHex.name}</h2>
        <p className="text-slate-300 mt-2 text-lg">{mainHex.meaning}</p>
      </div>

      <div className="space-y-2 mb-6">
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
          className="mt-6 pt-6 border-t border-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-amber-300 mb-2">Changing to:</h3>
          <div className="text-center">
            <div className="text-4xl md:text-5xl mb-2">
              {hexagrams[changingHexagram.id - 1].unicode}
            </div>
            <h4 className="text-xl font-bold text-amber-400">
              {hexagrams[changingHexagram.id - 1].name}
            </h4>
            <p className="text-slate-300 text-sm mt-1">
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

    const changingHexData = getChangingHexagram(results, results.filter(r => r === 6 || r === 9).map((_, i) => results.indexOf(_)));

    setLines(results);
    setChangingLines(results.map((r, i) => r === 6 || r === 9 ? i : -1).filter(i => i !== -1));
    setHexagram({ id: hexId });

    if (changingHexData) {
      const changingValue = changingHexData.lines.reduce((acc, val) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Dirk Gently's Portable I Ching Machine
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Think of a question, consult the ancient wisdom of the I Ching through the tossing of coins,
            and receive guidance as Dirk Gently might have done.
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
              <div className="mb-8">
                <label className="block text-slate-300 mb-4 text-lg">
                  Formulate your question...
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What shall I consult the I Ching about?"
                  className="w-full max-w-lg mx-auto p-4 rounded-lg bg-slate-800/50 border border-slate-600 text-white placeholder-slate-400 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                />
              </div>

              <motion.button
                onClick={handleConsult}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Consult the I Ching
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
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6">
                The Coins Are Tossing...
              </h2>
              <CoinTossAnimation onComplete={handleTossComplete} />
              <p className="text-slate-300 italic">
                {question || "Contemplating your query..."}
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
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  New Consultation
                </motion.button>

                <motion.button
                  onClick={handleConsult}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Consult Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="text-center mt-12 md:mt-16 text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>
            Inspired by Douglas Adams' Dirk Gently's Holistic Detective Agency.
            The I Ching (Book of Changes) is an ancient Chinese divination text.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<DirkGentlyIchingMachine />);

StageStage 1: Fix coin animation
