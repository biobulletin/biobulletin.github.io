/* =========================================================
   ARTICLES — the club's reading list. The only file you need
   to edit to add an article the club has picked.

   HOW TO ADD AN ARTICLE
   1. Copy one { ... } block below and paste it at the TOP of the list.
   2. Change every field:
        id        unique, lowercase, dashes instead of spaces
                  (it becomes the web address)
        title     the article's title
        author    who ORIGINALLY wrote it
        source    (optional) where it was published, e.g. "BBC Science Focus"
        link      (optional) web address of the original, starting https://
        date      "YYYY-MM-DD", when the club read it (newest shows first)
        category  one of the names in CATEGORIES
        emoji     shown on the card
        excerpt   one-sentence teaser
   3. Write the body between the ` backticks:
        - Leave an empty line between paragraphs
        - ## at the start of a line   → a sub-heading
        - > at the start of a line    → a highlighted "fun fact" box
        - **like this**               → bold
   Reading time is calculated automatically.

   ABOUT OTHER PEOPLE'S ARTICLES
   Copying a whole article from another website onto ours usually
   needs the writer's permission. Safer options: write a short summary
   in the club's own words and use `link` to send readers to the
   original, or only use articles that allow sharing (some say so,
   e.g. "Creative Commons"). Either way, keep author/source so the
   writer gets the credit.

   The four articles below are SAMPLES — replace them with the
   club's real picks.
   ========================================================= */

export const CATEGORIES = {
  Physics:     { emoji: "⚛️", color: "teal" },
  Biology:     { emoji: "🧬", color: "sage" },
  Chemistry:   { emoji: "🧪", color: "blush" },
  Maths:       { emoji: "📐", color: "vanilla" },
  Technology:  { emoji: "💻", color: "rose" },
  Engineering: { emoji: "⚙️", color: "sand" },
};

export const ARTICLES = [
  {
    id: "secret-maths-of-sunflowers",
    title: "The Secret Maths Hiding in Sunflowers",
    author: "Sample Writer",
    source: "Sample Science Magazine",          // optional
    link: "https://example.com/sunflower-maths", // optional
    date: "2026-11-21",
    category: "Maths",
    emoji: "🌻",
    excerpt: "Count the spirals in a sunflower and you'll find a famous number pattern. It's not a coincidence.",
    body: `
Look closely at the middle of a sunflower and you'll see seeds packed in spirals, some curving left and some curving right. Count them, and you'll usually get numbers like **34 and 55**, or **55 and 89**.

## Meet the Fibonacci numbers

Those numbers belong to the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89... Each number is the sum of the two before it.

## Why would a flower do maths?

The flower isn't counting. Each new seed simply grows at a fixed turn from the last one, about **137.5 degrees**, called the golden angle. That angle packs seeds with almost no wasted space, and the Fibonacci spirals appear as a side effect.

> Fun fact: pinecones, pineapples and cauliflower show Fibonacci spirals too.

Next time you see a sunflower, try counting. You're looking at one of nature's best packing solutions.
`,
  },
  {
    id: "how-your-phone-knows-where-you-are",
    title: "How Does Your Phone Know Where You Are?",
    author: "Sample Writer",
    date: "2026-11-18",
    category: "Technology",
    emoji: "🛰️",
    excerpt: "Your map app is listening to satellites 20,000 km above you, and Einstein helps keep it accurate.",
    body: `
When your map shows a little blue dot, your phone is listening to **GPS satellites** about 20,000 km above Earth.

## Timing is everything

Each satellite constantly broadcasts the exact time and its position. The signal travels at the speed of light, so your phone can work out how far away each satellite is from how long the signal took to arrive.

## Four satellites, one answer

One distance tells you that you're somewhere on a huge sphere around that satellite. Add more satellites and the spheres only overlap in one place: where you are. Phones need signals from **at least four** satellites, because the fourth one fixes the small errors in the phone's own clock.

> Fun fact: GPS satellite clocks run slightly fast compared to clocks on Earth, as Einstein's theory of relativity predicts. Without correcting for this, GPS would drift by kilometres every day.
`,
  },
  {
    id: "what-your-brain-does-while-you-sleep",
    title: "What Your Brain Does While You Sleep",
    author: "Sample Writer",
    date: "2026-11-14",
    category: "Biology",
    emoji: "😴",
    excerpt: "Sleep isn't your brain switching off. It's more like the night shift cleaning crew arriving.",
    body: `
It feels like nothing happens when you sleep, but your brain is busy.

## Saving the day's memories

During sleep, your brain replays things you learned during the day and moves the important ones into long-term memory. That's why a good night's sleep before a test often helps more than staying up late to cram.

## The cleaning crew

Scientists have found that during deep sleep, fluid flows through the brain more quickly and washes away waste that builds up while you're awake. This is sometimes called the **glymphatic system**.

> Fun fact: most teenagers need around 8 to 10 hours of sleep a night.

So the next time someone says sleeping is lazy, you can tell them your brain is doing important maintenance work.
`,
  },
  {
    id: "why-is-the-sky-blue",
    title: "Why Is the Sky Blue?",
    author: "Sample Writer",
    date: "2026-11-10",
    category: "Physics",
    emoji: "🌤️",
    excerpt: "Sunlight contains every colour, so why does the sky choose blue? The answer is tiny bouncing light.",
    body: `
Sunlight looks white, but it's actually a mix of every colour of the rainbow. Each colour is a wave of light with a different length.

## Light bouncing off air

When sunlight enters the atmosphere, it bumps into tiny gas molecules. These molecules scatter short waves (blue and violet) **much more** than long waves (red and orange). This is called **Rayleigh scattering**.

So blue light gets bounced all over the sky, and wherever you look, some of it is coming towards your eyes.

## Then why not violet?

Violet scatters even more than blue, but our eyes are much more sensitive to blue, and some violet light is absorbed high in the atmosphere. The result looks blue to us.

> Fun fact: at sunset, light travels through much more air to reach you. Most of the blue is scattered away before it arrives, leaving the reds and oranges.
`,
  },
];
