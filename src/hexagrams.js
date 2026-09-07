const TRIGRAM_NAMES = {
  "111": "Heaven",
  "110": "Lake",
  "101": "Fire",
  "100": "Thunder",
  "011": "Wind",
  "010": "Water",
  "001": "Mountain",
  "000": "Earth",
};

const KING_WEN = {
  "111": { "111": 1, "100": 25, "010": 6, "001": 33, "000": 12, "011": 44, "101": 13, "110": 10 },
  "100": { "111": 34, "100": 51, "010": 40, "001": 62, "000": 16, "011": 32, "101": 55, "110": 54 },
  "010": { "111": 5, "100": 3, "010": 29, "001": 39, "000": 8, "011": 48, "101": 63, "110": 60 },
  "001": { "111": 26, "100": 27, "010": 4, "001": 52, "000": 23, "011": 18, "101": 22, "110": 41 },
  "000": { "111": 11, "100": 24, "010": 7, "001": 15, "000": 2, "011": 46, "101": 36, "110": 19 },
  "011": { "111": 9, "100": 42, "010": 59, "001": 53, "000": 20, "011": 57, "101": 37, "110": 61 },
  "101": { "111": 14, "100": 21, "010": 64, "001": 56, "000": 35, "011": 50, "101": 30, "110": 38 },
  "110": { "111": 43, "100": 17, "010": 47, "001": 31, "000": 45, "011": 28, "101": 49, "110": 58 },
};

const ARCHETYPES = {
  initiative: {
    label: "Initiative",
    quote: "The noble person strengthens the self without rest.",
    tao: "Act cleanly and wholeheartedly, but never from strain alone.",
    guidance: "Momentum favors sincere action when it is anchored in principle.",
    reflection: "Where are you being asked to lead, begin, or commit more clearly?",
  },
  receptivity: {
    label: "Receptivity",
    quote: "With broad virtue, the noble person carries the world.",
    tao: "Yielding is not weakness when it keeps you aligned with what is real.",
    guidance: "Listen first, nourish what matters, and let the right form reveal itself.",
    reflection: "What changes when you stop pushing and start receiving the shape of events?",
  },
  discernment: {
    label: "Discernment",
    quote: "Clarity is a lamp only when it is joined to right conduct.",
    tao: "See distinctions without hardening into judgment.",
    guidance: "Name the truth plainly, then respond with proportion rather than reaction.",
    reflection: "What needs to be understood more precisely before you take the next step?",
  },
  patience: {
    label: "Patience",
    quote: "Clouds gather before rain; wise timing is itself a virtue.",
    tao: "Ripening cannot be rushed, but it can be prepared for.",
    guidance: "Keep faith with the process and ready yourself while conditions are forming.",
    reflection: "What can you cultivate now while you wait for the right opening?",
  },
  discipline: {
    label: "Discipline",
    quote: "Order gives strength its honorable form.",
    tao: "Boundaries are helpful when they protect what is essential.",
    guidance: "Create a steady container for effort, responsibility, and restraint.",
    reflection: "Which structure, habit, or promise now needs to be upheld?",
  },
  humility: {
    label: "Humility",
    quote: "What is full can still bow, and therefore remain useful.",
    tao: "Gentleness keeps power from becoming brittle.",
    guidance: "Simplify, soften pride, and let service quietly improve the situation.",
    reflection: "Where would modesty or honest simplicity open more room for grace?",
  },
  relationship: {
    label: "Relationship",
    quote: "True fellowship is built by shared purpose, not mere proximity.",
    tao: "Connection flourishes where there is room, honesty, and reciprocity.",
    guidance: "Attend to alignment, exchange, and the quality of your bonds.",
    reflection: "What is this moment teaching you about trust, belonging, or mutual care?",
  },
  perseverance: {
    label: "Perseverance",
    quote: "Constancy reveals what passing moods cannot sustain.",
    tao: "Endurance is strongest when it flexes with the season instead of resisting it.",
    guidance: "Stay the course, but keep your manner adaptive and alive.",
    reflection: "What deserves long faithfulness, and what only appears to need more force?",
  },
  renewal: {
    label: "Renewal",
    quote: "Return to what is true and the way opens again.",
    tao: "Every ending already contains the seed of another beginning.",
    guidance: "Release what is spent, then re-enter the path with a simpler heart.",
    reflection: "What pattern is ready to be shed so life can move again?",
  },
  transformation: {
    label: "Transformation",
    quote: "When the time changes, the wise change with it.",
    tao: "Transformation succeeds when form and spirit are both renewed.",
    guidance: "Do not cling to yesterday's arrangement once the deeper season has turned.",
    reflection: "Where is change already underway, even if your mind still lingers behind it?",
  },
  illumination: {
    label: "Illumination",
    quote: "What becomes visible must also be tended wisely.",
    tao: "Brightness is beneficial when it warms and reveals without consuming.",
    guidance: "Bring things into the light, and then care for what the light exposes.",
    reflection: "What truth is asking to be seen, expressed, or tended more openly?",
  },
  completion: {
    label: "Completion",
    quote: "Crossing accomplished still requires careful footing.",
    tao: "Completion is a threshold, not a place to fall asleep.",
    guidance: "Stabilize gains, notice what remains unfinished, and move with care.",
    reflection: "What final adjustments would turn success into lasting balance?",
  },
};

const BASE_HEXAGRAMS = [
  { number: 1, name: "The Creative", theme: "creative force and principled leadership", focus: "lead with clarity, courage, and disciplined effort", shadow: "forcing outcomes or confusing strength with control", timing: "best at the bright beginning of a cycle", archetype: "initiative" },
  { number: 2, name: "The Receptive", theme: "wise yielding, support, and fertile devotion", focus: "listen deeply and work with conditions instead of against them", shadow: "passivity or giving your authority away", timing: "best when patience and preparation matter more than speed", archetype: "receptivity" },
  { number: 3, name: "Difficulty at the Beginning", theme: "growth emerging through confusion and tender beginnings", focus: "accept the awkwardness of starting and organize the essentials", shadow: "panic, overreach, or giving up too early", timing: "best for careful first steps in unsettled terrain", archetype: "patience" },
  { number: 4, name: "Youthful Folly", theme: "learning through humility, inquiry, and correction", focus: "return to curiosity and seek guidance without pretense", shadow: "stubborn ignorance or mistaking novelty for wisdom", timing: "best when apprenticeship and honest questions are needed", archetype: "discernment" },
  { number: 5, name: "Waiting", theme: "trusting timing while storing strength", focus: "prepare well and let the moment ripen before acting", shadow: "restlessness, suspicion, or wasting energy in delay", timing: "best when conditions are forming but not ready", archetype: "patience" },
  { number: 6, name: "Conflict", theme: "friction that calls for fairness and clear boundaries", focus: "separate the essential issue from emotional escalation", shadow: "entrenchment, blame, or fighting past the useful point", timing: "best for measured response rather than immediate victory", archetype: "discernment" },
  { number: 7, name: "The Army", theme: "organized strength in service of a larger aim", focus: "bring discipline, accountability, and shared purpose to the effort", shadow: "hardness, domination, or disorder within the ranks", timing: "best when collective effort needs structure", archetype: "discipline" },
  { number: 8, name: "Holding Together", theme: "alliance, trust, and loyal cohesion", focus: "gather with what is dependable and mutually aligned", shadow: "clinging to unreliable ties or belonging without principle", timing: "best for building durable bonds and teams", archetype: "relationship" },
  { number: 9, name: "The Taming Power of the Small", theme: "gentle influence and incremental progress", focus: "work through small consistent actions that shape the larger pattern", shadow: "impatience with subtle progress or scattering your attention", timing: "best when a soft touch is stronger than force", archetype: "perseverance" },
  { number: 10, name: "Treading", theme: "careful conduct amid potent forces", focus: "move with courtesy, vigilance, and inner composure", shadow: "carelessness, provocation, or bravado", timing: "best when you must advance through delicate circumstances", archetype: "discipline" },
  { number: 11, name: "Peace", theme: "harmony, exchange, and a season of mutual support", focus: "nourish the flow between inner strength and outer receptivity", shadow: "taking harmony for granted until balance decays", timing: "best when things can be coordinated and cultivated", archetype: "relationship" },
  { number: 12, name: "Standstill", theme: "stagnation that asks for integrity and restraint", focus: "protect what is sound while larger conditions are blocked", shadow: "cynicism, isolation, or joining what has lost its center", timing: "best for inner work while outer momentum is stalled", archetype: "perseverance" },
  { number: 13, name: "Fellowship", theme: "shared ideals and community built in the open", focus: "unite around truth and common purpose", shadow: "false consensus or bonding that avoids the real issue", timing: "best for transparent collaboration", archetype: "relationship" },
  { number: 14, name: "Possession in Great Measure", theme: "abundance held with responsibility", focus: "use influence generously and steward resources well", shadow: "display, entitlement, or squandering a blessing", timing: "best when capacity is high and generosity is required", archetype: "initiative" },
  { number: 15, name: "Modesty", theme: "humility that keeps blessings in circulation", focus: "level the extremes and let quiet excellence speak", shadow: "self-diminishment or hidden pride dressed as modesty", timing: "best when simplification restores balance", archetype: "humility" },
  { number: 16, name: "Enthusiasm", theme: "inspired movement awakened by a shared rhythm", focus: "gather momentum through sincere excitement and preparation", shadow: "hype without grounding or emotional excess", timing: "best when energy is rising and needs direction", archetype: "initiative" },
  { number: 17, name: "Following", theme: "alignment through willing responsiveness", focus: "follow what is true, living, and proven by results", shadow: "drifting after fashion, fear, or dependency", timing: "best when responsive adaptation leads further than control", archetype: "receptivity" },
  { number: 18, name: "Work on What Has Been Spoiled", theme: "repair, accountability, and clearing inherited disorder", focus: "address root causes with courage and clean hands", shadow: "avoiding decay or attacking symptoms instead of causes", timing: "best for thorough restoration and overdue corrections", archetype: "renewal" },
  { number: 19, name: "Approach", theme: "benevolent influence drawing near", focus: "meet the moment with warmth, readiness, and responsibility", shadow: "complacency once success seems assured", timing: "best when opportunity is arriving and needs wise reception", archetype: "relationship" },
  { number: 20, name: "Contemplation", theme: "seeing clearly and becoming worthy of being seen", focus: "step back, observe patterns, and refine your inner stance", shadow: "detachment without responsibility or self-conscious display", timing: "best when observation should precede intervention", archetype: "illumination" },
  { number: 21, name: "Biting Through", theme: "decisive action that removes obstructions", focus: "deal cleanly with what is blocking justice or progress", shadow: "severity, resentment, or punishment for its own sake", timing: "best when the problem is specific and can be resolved", archetype: "discernment" },
  { number: 22, name: "Grace", theme: "beauty, refinement, and meaningful presentation", focus: "honor form, atmosphere, and the details that make truth approachable", shadow: "surface without substance or vanity", timing: "best for polishing, framing, and humanizing what matters", archetype: "illumination" },
  { number: 23, name: "Splitting Apart", theme: "erosion that reveals what can no longer hold", focus: "let the weakening structure fall away with dignity", shadow: "trying to prop up what is already collapsing", timing: "best for shedding rather than expanding", archetype: "renewal" },
  { number: 24, name: "Return", theme: "renewal, homecoming, and the first honest turning back", focus: "come back to the simple truth that restores your direction", shadow: "wandering too long from what you already know is right", timing: "best at the first sign of a new beginning", archetype: "renewal" },
  { number: 25, name: "Innocence", theme: "natural sincerity and uncontrived rightness", focus: "act from what is clean, direct, and free from calculation", shadow: "naivety, impulsiveness, or misplaced certainty", timing: "best when directness can reset a tangled situation", archetype: "initiative" },
  { number: 26, name: "The Taming Power of the Great", theme: "stored power guided by restraint and study", focus: "gather strength, refine skill, and wait for the worthy use of force", shadow: "hoarding capacity or using power without maturity", timing: "best when long preparation can change later outcomes", archetype: "discipline" },
  { number: 27, name: "The Corners of the Mouth", theme: "nourishment, appetite, and what sustains body and spirit", focus: "choose carefully what you take in and what you feed others", shadow: "empty consumption or speaking carelessly", timing: "best for tending sources of support and speech", archetype: "receptivity" },
  { number: 28, name: "Preponderance of the Great", theme: "bearing a great weight at a tipping point", focus: "simplify, shore up the center, and act before strain becomes collapse", shadow: "dramatic excess or refusing to adjust under pressure", timing: "best when unusual measures are needed briefly", archetype: "transformation" },
  { number: 29, name: "The Abysmal", theme: "repeated danger that trains depth and trust", focus: "move step by step through the risky passage without losing heart", shadow: "fear, fatalism, or reckless escape attempts", timing: "best for steady courage in testing conditions", archetype: "perseverance" },
  { number: 30, name: "The Clinging", theme: "clarity, dependence, and the tending of light", focus: "attach yourself to what is luminous, true, and sustaining", shadow: "burnout, vanity, or clinging to appearances", timing: "best when truth needs illumination and care", archetype: "illumination" },
  { number: 31, name: "Influence", theme: "mutual attraction and subtle heartfelt response", focus: "let feeling become honest connection instead of manipulation", shadow: "seduction, projection, or losing center for approval", timing: "best when receptivity can deepen a bond", archetype: "relationship" },
  { number: 32, name: "Duration", theme: "enduring commitment and rhythmic continuity", focus: "support what matters through consistency instead of intensity alone", shadow: "stagnation or clinging to a form that has stopped living", timing: "best for vows, habits, and long-range cultivation", archetype: "perseverance" },
  { number: 33, name: "Retreat", theme: "strategic withdrawal that preserves strength", focus: "step back early enough to remain free and composed", shadow: "cowardice, bitterness, or retreating too late", timing: "best when dignity is protected by distance", archetype: "discernment" },
  { number: 34, name: "The Power of the Great", theme: "strong force that must remain lawful and humane", focus: "use power openly and honorably rather than explosively", shadow: "aggression, pride, or coercion", timing: "best when strength can serve a just purpose", archetype: "initiative" },
  { number: 35, name: "Progress", theme: "visibility, recognition, and advancement through light", focus: "step forward with gratitude and let your work be seen", shadow: "rushing exposure or seeking approval instead of substance", timing: "best when the path is opening in plain view", archetype: "illumination" },
  { number: 36, name: "Darkening of the Light", theme: "protecting clarity when the environment is hostile", focus: "shield your inner light without abandoning it", shadow: "self-betrayal or reckless disclosure", timing: "best for discretion during difficult periods", archetype: "discernment" },
  { number: 37, name: "The Family", theme: "roles, loyalty, and order within the intimate circle", focus: "strengthen the household, team, or inner circle through reliable conduct", shadow: "rigidity, blame, or neglect of foundational relationships", timing: "best when small communities need tending", archetype: "relationship" },
  { number: 38, name: "Opposition", theme: "difference that need not become division", focus: "honor distinctions and seek workable connection without forced sameness", shadow: "alienation, stubbornness, or making contrast into hostility", timing: "best for precise agreements across difference", archetype: "discernment" },
  { number: 39, name: "Obstruction", theme: "difficulty that invites inner reorientation", focus: "pause, seek help, and change your angle of approach", shadow: "pushing directly into what clearly resists you", timing: "best when detours reveal the wiser route", archetype: "patience" },
  { number: 40, name: "Deliverance", theme: "release, relief, and the easing of tension", focus: "untie what has bound the situation and move forward cleanly", shadow: "repeating the old knot after it has loosened", timing: "best immediately after the storm begins to pass", archetype: "renewal" },
  { number: 41, name: "Decrease", theme: "voluntary simplification that nourishes what matters", focus: "reduce the excess so the essential can thrive", shadow: "resenting necessary sacrifice or cutting what should be protected", timing: "best when intentional reduction restores proportion", archetype: "humility" },
  { number: 42, name: "Increase", theme: "growth, blessing, and the circulation of benefit", focus: "expand what is good by sharing it and acting generously", shadow: "greed, inflation, or growth without rooted purpose", timing: "best when support is available and should be put to use", archetype: "initiative" },
  { number: 43, name: "Breakthrough", theme: "truth spoken firmly at the critical moment", focus: "declare what must be declared and remove what has become dangerous", shadow: "harshness, impulsive confrontation, or moral grandstanding", timing: "best when a clear line finally must be drawn", archetype: "transformation" },
  { number: 44, name: "Coming to Meet", theme: "a potent encounter that needs boundaries", focus: "recognize the influence entering your field and relate to it consciously", shadow: "being captured by fascination, appetite, or imbalance", timing: "best when alertness can keep attraction in right measure", archetype: "relationship" },
  { number: 45, name: "Gathering Together", theme: "concentration, assembly, and collective intention", focus: "bring people and resources into meaningful alignment", shadow: "crowding, dependency, or gathering without a center", timing: "best for convening, ritual, and common purpose", archetype: "relationship" },
  { number: 46, name: "Pushing Upward", theme: "steady ascent through sincere effort", focus: "advance by humility, consistency, and readiness to learn", shadow: "impatience with gradual growth or insecure striving", timing: "best when patient effort compounds over time", archetype: "perseverance" },
  { number: 47, name: "Oppression", theme: "constraint that tests spirit and truthfulness", focus: "endure the narrowing without losing your core", shadow: "despair, resentment, or self-defeating reactions", timing: "best for inner strengthening under pressure", archetype: "perseverance" },
  { number: 48, name: "The Well", theme: "shared source, renewal, and practical nourishment", focus: "restore the source instead of merely treating the symptom", shadow: "neglecting what sustains everyone", timing: "best for repairing infrastructure, habits, and common resources", archetype: "renewal" },
  { number: 49, name: "Revolution", theme: "radical change when the old form has expired", focus: "change decisively, transparently, and at the right moment", shadow: "rebellion without legitimacy or clinging beyond the season", timing: "best when reform is both necessary and mature", archetype: "transformation" },
  { number: 50, name: "The Cauldron", theme: "cultural nourishment, refinement, and inner alchemy", focus: "transform raw material into something that can truly feed life", shadow: "misusing influence or failing to tend the vessel", timing: "best when refinement can elevate the whole field", archetype: "illumination" },
  { number: 51, name: "The Arousing", theme: "shock that awakens dormant life", focus: "let the jolt clear fear and restore alert presence", shadow: "staying frozen after the warning has sounded", timing: "best when a sudden event resets the rhythm", archetype: "transformation" },
  { number: 52, name: "The Keeping Still", theme: "stillness, containment, and centered awareness", focus: "stop, settle, and let movement return only from real calm", shadow: "rigidity, suppression, or paralysis disguised as peace", timing: "best when non-action restores alignment", archetype: "receptivity" },
  { number: 53, name: "Development", theme: "gradual progress that becomes trustworthy", focus: "honor the sequence and let maturity arrive step by step", shadow: "rushing the next stage before the roots are ready", timing: "best for patient, organic growth", archetype: "perseverance" },
  { number: 54, name: "The Marrying Maiden", theme: "limited position, adaptation, and realistic expectations", focus: "work skillfully within what is not yet fully yours to direct", shadow: "resentment, wishful thinking, or misreading the power dynamics", timing: "best when humility protects you during transition", archetype: "humility" },
  { number: 55, name: "Abundance", theme: "fullness, brightness, and the peak of a cycle", focus: "use the moment of fullness well because no summit lasts forever", shadow: "excess, confusion, or failing to prepare for the turning", timing: "best at the height of visibility and activity", archetype: "completion" },
  { number: 56, name: "The Wanderer", theme: "transience, perspective, and light-footed conduct", focus: "travel lightly, stay courteous, and avoid overclaiming your place", shadow: "rootlessness, carelessness, or inflaming minor trouble", timing: "best when you are between homes, roles, or certainties", archetype: "discernment" },
  { number: 57, name: "The Gentle", theme: "penetrating influence through softness and repetition", focus: "let small consistent signals enter where force cannot", shadow: "indecision, over-accommodation, or hidden pressure", timing: "best when gradual influence can reshape the field", archetype: "receptivity" },
  { number: 58, name: "The Joyous", theme: "open exchange, delight, and persuasive ease", focus: "invite truth through warmth, pleasure, and honest communication", shadow: "superficial charm or pleasing at the cost of depth", timing: "best when shared joy can heal distance", archetype: "relationship" },
  { number: 59, name: "Dispersion", theme: "dissolving knots and releasing hardened separation", focus: "soften what has frozen and reconnect the living current", shadow: "scattering your energies without creating true release", timing: "best when rigidity needs to break apart", archetype: "renewal" },
  { number: 60, name: "Articulating", theme: "measured limits that make freedom workable", focus: "set humane boundaries and keep things within their right measure", shadow: "either harsh restriction or total lack of form", timing: "best when proportion must be restored", archetype: "discipline" },
  { number: 61, name: "Inner Truth", theme: "sincerity, trust, and the quiet authority of the heart", focus: "speak and act from what is inwardly real", shadow: "sentimentality, self-deception, or persuasive words without substance", timing: "best when honesty can bridge uncertainty", archetype: "illumination" },
  { number: 62, name: "Preponderance of the Small", theme: "careful attention to modest but necessary matters", focus: "favor small corrections and humble competence over grand gestures", shadow: "trying to soar when the moment asks you to tread lightly", timing: "best for careful detail work and grounded restraint", archetype: "humility" },
  { number: 63, name: "After Completion", theme: "successful crossing that still requires vigilance", focus: "stabilize the achievement and remain attentive to small imbalances", shadow: "relaxing too soon after apparent success", timing: "best just after a major transition has been completed", archetype: "completion" },
  { number: 64, name: "Before Completion", theme: "the almost-finished passage where care matters most", focus: "keep your poise and complete the crossing without premature certainty", shadow: "rushing the final steps or scattering at the threshold", timing: "best when the end is near but not yet secured", archetype: "completion" },
];

const PATTERN_TO_NUMBER = new Map(
  Object.entries(KING_WEN).flatMap(([upper, lowers]) =>
    Object.entries(lowers).map(([lower, number]) => [`${lower}${upper}`, number]),
  ),
);

const NUMBER_TO_PATTERN = new Map(
  Array.from(PATTERN_TO_NUMBER.entries()).map(([pattern, number]) => [number, pattern]),
);

const HEXAGRAMS = BASE_HEXAGRAMS.map((entry) => {
  const pattern = NUMBER_TO_PATTERN.get(entry.number);
  const lowerTrigram = TRIGRAM_NAMES[pattern.slice(0, 3)];
  const upperTrigram = TRIGRAM_NAMES[pattern.slice(3)];
  return {
    ...entry,
    pattern,
    lowerTrigram,
    upperTrigram,
    image: `${upperTrigram} over ${lowerTrigram}`,
  };
});

const BY_NUMBER = new Map(HEXAGRAMS.map((hexagram) => [hexagram.number, hexagram]));

export function getHexagramByNumber(number) {
  return BY_NUMBER.get(number) ?? null;
}

export function getHexagramByPattern(pattern) {
  const number = PATTERN_TO_NUMBER.get(pattern);
  return number ? getHexagramByNumber(number) : null;
}

export function getInterpretation(primary, relating, question, changingLines = []) {
  if (!primary) {
    return null;
  }

  const archetype = ARCHETYPES[primary.archetype];
  const trimmedQuestion = question.trim();
  const changedCount = changingLines.length;
  const transformation =
    relating && relating.number !== primary.number
      ? `The changing lines carry this reading from ${primary.name} toward ${relating.name}. What begins as ${primary.theme} matures into ${relating.theme}.`
      : "Without changing lines, the message is to embody this hexagram steadily rather than seeking a dramatic shift.";

  const relationship =
    relating && relating.number !== primary.number
      ? `Primary ${primary.number} starts with ${primary.focus}; relating ${relating.number} shows how the situation is evolving as the moving lines do their work.`
      : `This is a single-hexagram reading, so the wisdom concentrates on one stable pattern rather than a transition between two states.`;

  return {
    coreMeaning: `${primary.image}. ${primary.name} speaks of ${primary.theme}.`,
    currentSituation: trimmedQuestion
      ? `For your question, this suggests that you should ${primary.focus}.`
      : `At present, the reading suggests that you should ${primary.focus}.`,
    challenge: `The pressure point is ${primary.shadow}.`,
    guidance: `${archetype.guidance} Here, that means you should ${primary.focus}.`,
    transformation,
    relationship,
    timing: `${primary.timing}; with ${primary.upperTrigram.toLowerCase()} above ${primary.lowerTrigram.toLowerCase()}, the cycle favors thoughtful alignment over haste.`,
    quote: archetype.quote,
    tao: archetype.tao,
    reflection: archetype.reflection,
    whatNow: `What this means for you now: ${primary.focus.charAt(0).toUpperCase()}${primary.focus.slice(1)}.`,
    changingCountText:
      changedCount > 0 ? `${changedCount} changing line${changedCount === 1 ? "" : "s"} point to active transformation.` : "No changing lines: the oracle emphasizes steadiness and embodiment.",
  };
}

export function getSimilarHexagrams(primary) {
  if (!primary) {
    return [];
  }

  return HEXAGRAMS.filter(
    (hexagram) =>
      hexagram.number !== primary.number &&
      (hexagram.archetype === primary.archetype ||
        hexagram.upperTrigram === primary.upperTrigram ||
        hexagram.lowerTrigram === primary.lowerTrigram),
  ).slice(0, 3);
}

export { ARCHETYPES, HEXAGRAMS };
