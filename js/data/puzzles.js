/* =========================================================
   PUZZLES — words and clues for the games.

   WORDLE WORDS
   - word: letters only (any length works, 5 is classic)
   - hint: a short clue, shown if the player asks for help
   - category: shown as a small label
   One word is picked per day, in order, then it loops.
   These are SAMPLES — replace them with the club's words.
   ========================================================= */

const WORDLE_WORDS = [
  { word: "ORBIT", category: "Physics",    hint: "The curved path a planet takes around a star." },
  { word: "LASER", category: "Physics",    hint: "A very narrow, focused beam of light." },
  { word: "GENES", category: "Biology",    hint: "Instructions stored in your DNA." },
  { word: "PRISM", category: "Physics",    hint: "A glass shape that splits white light into a rainbow." },
  { word: "PIXEL", category: "Technology", hint: "One tiny dot of colour on a screen." },
  { word: "HELIX", category: "Biology",    hint: "DNA's twisted ladder shape." },
  { word: "FORCE", category: "Physics",    hint: "A push or a pull, measured in newtons." },
  { word: "ANGLE", category: "Maths",      hint: "Measured in degrees, like 90° in a corner." },
  { word: "VIRUS", category: "Biology",    hint: "A tiny germ that needs a living cell to copy itself." },
  { word: "SOLAR", category: "Physics",    hint: "To do with the Sun." },
];

/* =========================================================
   CROSSWORDS
   - Just give words + clues. The grid layout is built
     automatically, so no need to plan where words go.
   - id: unique, lowercase-with-dashes (becomes the web address)
   - Aim for 6–12 words that share common letters (E, A, R, T, N...)
     so they can cross each other. Any word that can't connect
     is skipped and listed in the browser console.
   These are SAMPLES — replace them with the club's crosswords.
   ========================================================= */

const CROSSWORDS = [
  {
    id: "space-and-energy",
    title: "Space & Energy",
    entries: [
      { answer: "GRAVITY", clue: "The force that keeps your feet on the ground" },
      { answer: "PLANET",  clue: "A large world that orbits a star" },
      { answer: "ENERGY",  clue: "The ability to do work, measured in joules" },
      { answer: "PHOTON",  clue: "A tiny packet of light" },
      { answer: "MAGNET",  clue: "It pulls iron and nickel towards it" },
      { answer: "COMET",   clue: "An icy space traveller with a glowing tail" },
      { answer: "ORBIT",   clue: "The path the Moon takes around Earth" },
      { answer: "ATOM",    clue: "The smallest unit of an element" },
    ],
  },
  {
    id: "life-science",
    title: "Life Science",
    entries: [
      { answer: "PROTEIN", clue: "Nutrient that builds muscles, found in eggs and beans" },
      { answer: "NEURON",  clue: "A nerve cell that carries messages in your brain" },
      { answer: "OXYGEN",  clue: "The gas your lungs take from the air" },
      { answer: "ENZYME",  clue: "A protein that speeds up reactions in your body" },
      { answer: "LUNGS",   clue: "The organs you breathe with" },
      { answer: "ORGAN",   clue: "A body part with a job, like the heart or liver" },
      { answer: "TISSUE",  clue: "A group of similar cells working together" },
      { answer: "GENE",    clue: "A section of DNA that carries one instruction" },
    ],
  },
];
