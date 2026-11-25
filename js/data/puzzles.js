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

/* =========================================================
   QUIZ OF THE DAY
   - q: the question
   - answers: every answer you'll accept (capitals, "the" and
     punctuation are ignored, so "The Sun" = "sun")
   - fact: shown after answering, to teach something
   One question per day, in order, then it loops.
   These are SAMPLES — replace them with the club's questions.
   ========================================================= */

const QUIZ = [
  { q: "Which gas do plants take in to make their food?", answers: ["carbon dioxide", "co2"], fact: "Plants use carbon dioxide, water and sunlight to make sugar. That's photosynthesis." },
  { q: "Which planet is known as the Red Planet?", answers: ["mars"], fact: "Mars looks red because its dust is full of iron oxide: rust!" },
  { q: "How many sides does a hexagon have?", answers: ["6", "six"], fact: "Bees build hexagon-shaped cells because they fit together with no gaps." },
  { q: "What is the chemical symbol for water?", answers: ["h2o"], fact: "Each water molecule has two hydrogen atoms and one oxygen atom." },
  { q: "What force pulls objects towards the Earth?", answers: ["gravity"], fact: "Gravity on the Moon is about one sixth as strong as on Earth." },
  { q: "What part of the cell holds its DNA?", answers: ["nucleus", "the nucleus"], fact: "If you stretched out the DNA in one human cell, it would be about 2 metres long." },
  { q: "What is the closest star to Earth?", answers: ["sun", "the sun"], fact: "Light from the Sun takes about 8 minutes to reach us." },
];
