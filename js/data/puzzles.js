/* =========================================================
   PUZZLES — words and clues for the games.

   WORDLE WORDS
   - word: letters only (any length works, 5 is classic)
   - hint: a short clue, shown if the player asks for help
   - category: shown as a small label
   One word is picked per day, in list order, then it loops.
   Practice mode picks random words from the same list.
   To add a word, add a line anywhere in the list.
   ========================================================= */

export const WORDLE_WORDS = [
  { word: "GENES", category: "Biology",   hint: "Instructions stored in your DNA." },
  { word: "ORBIT", category: "Space",     hint: "The curved path a planet takes around a star." },
  { word: "HEART", category: "Medicine",  hint: "The organ that pumps blood around your body." },
  { word: "LASER", category: "Physics",   hint: "A very narrow, focused beam of light." },
  { word: "HELIX", category: "Biology",   hint: "DNA's twisted ladder shape." },
  { word: "PRISM", category: "Physics",   hint: "A glass shape that splits white light into a rainbow." },
  { word: "VIRUS", category: "Medicine",  hint: "A tiny germ that can only copy itself inside a living cell." },
  { word: "COMET", category: "Space",     hint: "An icy space traveller with a glowing tail." },
  { word: "ALGAE", category: "Biology",   hint: "Simple plant-like living things that grow in water." },
  { word: "JOULE", category: "Physics",   hint: "The unit used to measure energy." },
  { word: "LUNGS", category: "Medicine",  hint: "The organs you breathe with." },
  { word: "MAGMA", category: "Earth",     hint: "Melted rock found deep under the ground." },
  { word: "FUNGI", category: "Biology",   hint: "The group that includes mushrooms and yeast." },
  { word: "PRIME", category: "Maths",     hint: "A number that can only be divided by 1 and itself." },
  { word: "AORTA", category: "Medicine",  hint: "The largest artery in your body." },
  { word: "VENUS", category: "Space",     hint: "The hottest planet in our solar system." },
  { word: "XYLEM", category: "Biology",   hint: "Tubes that carry water up through a plant." },
  { word: "FORCE", category: "Physics",   hint: "A push or a pull, measured in newtons." },
  { word: "BONES", category: "Medicine",  hint: "An adult human skeleton has 206 of these." },
  { word: "OZONE", category: "Earth",     hint: "A gas high in the sky that blocks harmful UV rays." },
  { word: "CLONE", category: "Biology",   hint: "An exact genetic copy of a living thing." },
  { word: "QUARK", category: "Physics",   hint: "Tiny particles that make up protons and neutrons." },
  { word: "BRAIN", category: "Medicine",  hint: "The organ that controls your whole nervous system." },
  { word: "LUNAR", category: "Space",     hint: "To do with the Moon." },
  { word: "SPORE", category: "Biology",   hint: "A tiny cell that fungi and ferns use to reproduce." },
  { word: "RATIO", category: "Maths",     hint: "A comparison like 2:1 between two amounts." },
  { word: "NERVE", category: "Medicine",  hint: "A bundle of fibres that carries signals to and from the brain." },
  { word: "HERTZ", category: "Physics",   hint: "The unit used to measure frequency." },
  { word: "PETAL", category: "Biology",   hint: "The colourful part of a flower that attracts insects." },
  { word: "QUAKE", category: "Earth",     hint: "Short for a shaking of the ground caused by moving rock." },
  { word: "PULSE", category: "Medicine",  hint: "The beat you can feel in your wrist." },
  { word: "SOLAR", category: "Space",     hint: "To do with the Sun." },
  { word: "TOXIN", category: "Biology",   hint: "A poison made by a living thing." },
  { word: "VOLTS", category: "Physics",   hint: "The units used to measure the push of electricity." },
  { word: "LIVER", category: "Medicine",  hint: "A large organ that cleans harmful substances from your blood." },
  { word: "ANGLE", category: "Maths",     hint: "Measured in degrees, like 90° in a corner." },
  { word: "CELLS", category: "Biology",   hint: "The tiny building blocks of all living things." },
  { word: "OXIDE", category: "Chemistry", hint: "A compound of oxygen and another element, like rust." },
  { word: "LYMPH", category: "Medicine",  hint: "A clear fluid that helps your body fight infection." },
  { word: "PLUTO", category: "Space",     hint: "A dwarf planet that lost its 'planet' title in 2006." },
  { word: "STOMA", category: "Biology",   hint: "A tiny pore on a leaf that lets gases in and out." },
  { word: "WAVES", category: "Physics",   hint: "Sound and light both travel as these." },
  { word: "SKULL", category: "Medicine",  hint: "The bony case that protects your brain." },
  { word: "FLASK", category: "Chemistry", hint: "A glass container used in science labs." },
  { word: "SEEDS", category: "Biology",   hint: "Plants grow from these." },
  { word: "GRAPH", category: "Maths",     hint: "A drawing that shows data, like a bar chart." },
  { word: "TEETH", category: "Medicine",  hint: "Covered in enamel, the hardest substance in your body." },
  { word: "EARTH", category: "Space",     hint: "The third planet from the Sun." },
  { word: "GERMS", category: "Medicine",  hint: "Tiny living things that can make you ill." },
  { word: "PIXEL", category: "Technology",hint: "One tiny dot of colour on a screen." },
  { word: "SPINE", category: "Medicine",  hint: "Your backbone, made of vertebrae." },
  { word: "METAL", category: "Chemistry", hint: "A shiny material that conducts electricity well." },
  { word: "BLOOD", category: "Medicine",  hint: "Red liquid that carries oxygen around your body." },
  { word: "STEAM", category: "Chemistry", hint: "Water as a hot gas." },
  { word: "ORGAN", category: "Biology",   hint: "A body part with a job, like the heart or liver." },
  { word: "SOUND", category: "Physics",   hint: "It travels through air as vibrations you can hear." },
  { word: "VEINS", category: "Medicine",  hint: "Blood vessels that carry blood back to the heart." },
  { word: "NOBLE", category: "Chemistry", hint: "The kind of gas that neon and helium are." },
  { word: "MOULD", category: "Biology",   hint: "Fuzzy fungus that grows on old bread." },
  { word: "LIGHT", category: "Physics",   hint: "The fastest thing in the universe." },
];

/* =========================================================
   FEATURED CROSSWORDS (fixed puzzles, 25 coins each)
   - Just give words + clues. The grid layout is built
     automatically, so no need to plan where words go.
   - id: unique, lowercase-with-dashes (becomes the web address)
   - Aim for 6–12 words that share common letters (E, A, R, T, N...)
     so they can cross each other. Any word that can't connect
     is skipped and listed in the browser console.
   ========================================================= */

export const CROSSWORDS = [
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
   PRACTICE CROSSWORD TOPICS (endless, random)
   Every "New crossword" picks random words from a topic's
   word bank and builds a fresh grid from them.
   - To add words: add { answer, clue } lines to a topic.
   - To add a topic: copy a whole { id, title, ... } block.
   - More words = more variety. 30+ per topic works well.
   - Answers: letters only, no spaces (3–11 letters is best).
   ========================================================= */

export const CROSSWORD_TOPICS = [
  {
    id: "biology-medicine",
    title: "Biology & Medicine",
    emoji: "🧬",
    color: "sage",
    words: [
      { answer: "CELL",        clue: "The smallest unit of life" },
      { answer: "GENE",        clue: "A section of DNA that carries one instruction" },
      { answer: "NUCLEUS",     clue: "The control centre of a cell, where its DNA is kept" },
      { answer: "MITOSIS",     clue: "Cell division that makes two identical cells" },
      { answer: "ENZYME",      clue: "A protein that speeds up reactions in your body" },
      { answer: "PROTEIN",     clue: "Nutrient that builds and repairs muscles" },
      { answer: "NEURON",      clue: "A nerve cell that carries electrical messages" },
      { answer: "HEART",       clue: "The organ that pumps blood around your body" },
      { answer: "LUNGS",       clue: "Organs where oxygen passes into your blood" },
      { answer: "LIVER",       clue: "Large organ that removes toxins from the blood" },
      { answer: "KIDNEY",      clue: "Organ that filters blood and makes urine" },
      { answer: "BRAIN",       clue: "Organ that controls the nervous system" },
      { answer: "SKELETON",    clue: "The body's frame of bones" },
      { answer: "VIRUS",       clue: "A germ that can only copy itself inside a living cell" },
      { answer: "BACTERIA",    clue: "Single-celled microbes; some cause illness, many are helpful" },
      { answer: "VACCINE",     clue: "Trains your immune system before you meet a disease" },
      { answer: "ANTIBODY",    clue: "A Y-shaped protein that latches onto germs" },
      { answer: "INSULIN",     clue: "Hormone that lowers the sugar level in your blood" },
      { answer: "HORMONE",     clue: "A chemical messenger carried in the blood" },
      { answer: "OXYGEN",      clue: "Gas your cells need to release energy" },
      { answer: "GLUCOSE",     clue: "A sugar your body uses for energy" },
      { answer: "PLASMA",      clue: "The yellowish liquid part of blood" },
      { answer: "ARTERY",      clue: "Blood vessel that carries blood away from the heart" },
      { answer: "VEIN",        clue: "Blood vessel that carries blood back to the heart" },
      { answer: "PULSE",       clue: "The beat you can feel in your wrist" },
      { answer: "ALLELE",      clue: "One version of a gene, such as for blue or brown eyes" },
      { answer: "MUTATION",    clue: "A change in the DNA code" },
      { answer: "EVOLUTION",   clue: "How species change over many generations" },
      { answer: "HABITAT",     clue: "The natural home of a plant or animal" },
      { answer: "ECOSYSTEM",   clue: "Living things and their surroundings working together" },
      { answer: "CHLOROPHYLL", clue: "Green pigment plants use to capture sunlight" },
      { answer: "STOMATA",     clue: "Tiny pores on leaves that let gases in and out" },
      { answer: "POLLEN",      clue: "Powdery grains that flowers use to reproduce" },
      { answer: "FUNGI",       clue: "The group that includes mushrooms and yeast" },
      { answer: "ALGAE",       clue: "Simple plant-like living things that grow in water" },
      { answer: "MICROBE",     clue: "A living thing too small to see without a microscope" },
      { answer: "ANTIBIOTIC",  clue: "Medicine that kills bacteria, but not viruses" },
      { answer: "IMMUNITY",    clue: "Your body's ability to resist an infection" },
      { answer: "TISSUE",      clue: "A group of similar cells working together" },
      { answer: "ORGAN",       clue: "A body part with a job, like the heart or liver" },
      { answer: "RIBOSOME",    clue: "The part of a cell where proteins are made" },
      { answer: "SPINE",       clue: "Your backbone, made of vertebrae" },
    ],
  },
  {
    id: "science",
    title: "Science",
    emoji: "⚛️",
    color: "teal",
    words: [
      { answer: "ATOM",        clue: "The smallest unit of a chemical element" },
      { answer: "PROTON",      clue: "Positive particle in the centre of an atom" },
      { answer: "NEUTRON",     clue: "Particle in an atom's nucleus with no charge" },
      { answer: "ELECTRON",    clue: "Negative particle that moves around an atom's nucleus" },
      { answer: "ENERGY",      clue: "The ability to do work, measured in joules" },
      { answer: "FORCE",       clue: "A push or a pull, measured in newtons" },
      { answer: "GRAVITY",     clue: "The force that keeps your feet on the ground" },
      { answer: "MASS",        clue: "How much matter something has, measured in kilograms" },
      { answer: "VELOCITY",    clue: "Speed in a particular direction" },
      { answer: "FRICTION",    clue: "Force that slows things sliding against each other" },
      { answer: "MAGNET",      clue: "An object that pulls iron towards it" },
      { answer: "VOLTAGE",     clue: "The 'push' that drives electricity around a circuit" },
      { answer: "CURRENT",     clue: "A flow of electric charge, measured in amps" },
      { answer: "CIRCUIT",     clue: "A complete loop that electricity flows around" },
      { answer: "PHOTON",      clue: "A tiny packet of light" },
      { answer: "LASER",       clue: "A very narrow, focused beam of light" },
      { answer: "PRISM",       clue: "A glass shape that splits white light into colours" },
      { answer: "SPECTRUM",    clue: "The rainbow band of colours in white light" },
      { answer: "WAVE",        clue: "Sound and light both travel as one of these" },
      { answer: "ECHO",        clue: "A sound that bounces back to you" },
      { answer: "PLANET",      clue: "A large world that orbits a star" },
      { answer: "ORBIT",       clue: "The path the Moon takes around Earth" },
      { answer: "COMET",       clue: "An icy space traveller with a glowing tail" },
      { answer: "GALAXY",      clue: "A huge group of billions of stars, like the Milky Way" },
      { answer: "NEBULA",      clue: "A cloud of gas and dust where stars are born" },
      { answer: "ELEMENT",     clue: "A substance made of only one kind of atom" },
      { answer: "MOLECULE",    clue: "Two or more atoms joined together" },
      { answer: "ACID",        clue: "A substance with a pH below 7, like lemon juice" },
      { answer: "ISOTOPE",     clue: "A version of an atom with a different number of neutrons" },
      { answer: "CATALYST",    clue: "Speeds up a reaction without being used up" },
      { answer: "OXIDE",       clue: "A compound of oxygen and another element, like rust" },
      { answer: "METAL",       clue: "A shiny material that conducts electricity well" },
      { answer: "CARBON",      clue: "The element found in all living things" },
      { answer: "HYDROGEN",    clue: "The lightest and most common element in the universe" },
      { answer: "MAGMA",       clue: "Melted rock deep under the Earth's surface" },
      { answer: "FOSSIL",      clue: "Remains of an ancient living thing, preserved in rock" },
      { answer: "VOLCANO",     clue: "A mountain where lava can erupt" },
      { answer: "EROSION",     clue: "The wearing away of rock by wind, water or ice" },
      { answer: "CLIMATE",     clue: "The usual weather of a place over many years" },
      { answer: "THERMOMETER", clue: "An instrument that measures temperature" },
      { answer: "DENSITY",     clue: "How much mass is packed into a certain volume" },
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

export const QUIZ = [
  { q: "Which gas do plants take in to make their food?", answers: ["carbon dioxide", "co2"], fact: "Plants use carbon dioxide, water and sunlight to make sugar. That's photosynthesis." },
  { q: "Which planet is known as the Red Planet?", answers: ["mars"], fact: "Mars looks red because its dust is full of iron oxide: rust!" },
  { q: "How many sides does a hexagon have?", answers: ["6", "six"], fact: "Bees build hexagon-shaped cells because they fit together with no gaps." },
  { q: "What is the chemical symbol for water?", answers: ["h2o"], fact: "Each water molecule has two hydrogen atoms and one oxygen atom." },
  { q: "What force pulls objects towards the Earth?", answers: ["gravity"], fact: "Gravity on the Moon is about one sixth as strong as on Earth." },
  { q: "What part of the cell holds its DNA?", answers: ["nucleus", "the nucleus"], fact: "If you stretched out the DNA in one human cell, it would be about 2 metres long." },
  { q: "What is the closest star to Earth?", answers: ["sun", "the sun"], fact: "Light from the Sun takes about 8 minutes to reach us." },
];
