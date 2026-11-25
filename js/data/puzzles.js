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
