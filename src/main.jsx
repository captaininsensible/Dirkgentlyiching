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
  { id: 23, name: "Splitting Apart", unicode: "♊", meaning: "Mountain over earth. Disintegration, but also the opportunity
