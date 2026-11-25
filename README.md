# BioBulletin

A student-written STEM magazine website with articles, STEM Wordle,
crosswords, a quiz of the day, and a customisable avatar.

- Plain HTML, CSS and JavaScript — no build step, no frameworks
- Progress is saved in the visitor's browser (localStorage)
- Hosted free on GitHub Pages: https://dananwer67.github.io/biobulletin/

---

## Running it on your computer

The site uses JavaScript modules, which browsers refuse to load from a
double-clicked file. Use a small local server instead:

1. Open the folder in VS Code
2. Install the **Live Server** extension (once)
3. Right-click `index.html` → **Open with Live Server**

While running on Live Server (localhost), the browser console has a
testing helper:

```js
dev.Store.award(100)   // give yourself test coins
dev.Store.reset()      // wipe your progress
```

This helper does **not** exist on the live site.

## Publishing changes

Commit and push to `main`. GitHub Pages rebuilds the site in 1–2 minutes
(watch the **Actions** tab). Press **Ctrl + Shift + R** to see the new version.

---

## Adding content

All content lives in two files. You never need to touch the page code.

### Articles → `js/data/articles.js`

Copy an existing `{ ... }` block, paste it at the **top** of the `ARTICLES` list
and change every field:

| Field | Example | Notes |
|---|---|---|
| `id` | `"why-is-the-sky-blue"` | Unique, lowercase, dashes. Becomes the web address. |
| `title` | `"Why Is the Sky Blue?"` | |
| `author` | `"Aisha K."` | |
| `date` | `"2026-11-10"` | `YYYY-MM-DD`. Newest articles show first. |
| `category` | `"Physics"` | Must match a name in `CATEGORIES`. |
| `emoji` | `"🌤️"` | Shown on the card. |
| `excerpt` | `"Sunlight contains every colour…"` | One-sentence teaser. |
| `body` | `` `...` `` | The article, between backticks. |

Body formatting:

- Empty line between paragraphs
- `## Heading` → sub-heading
- `> Fun fact: ...` → highlighted box
- `**bold**` → bold (lime highlighter)

To add a category, add a line to `CATEGORIES` with an emoji and one of the
colours: `lav`, `mint`, `pink`, `lime`, `sky`, `peach`.

### Wordle words → `js/data/puzzles.js` (`WORDLE_WORDS`)

```js
{ word: "ORBIT", category: "Physics", hint: "The curved path a planet takes around a star." },
```

One word per day, in list order, looping. Any length works (5 is classic).

### Crosswords → `js/data/puzzles.js` (`CROSSWORDS`)

Just words and clues — the grid is built automatically.

```js
{
  id: "space-and-energy",
  title: "Space & Energy",
  entries: [
    { answer: "GRAVITY", clue: "The force that keeps your feet on the ground" },
    ...
  ],
},
```

Tips: 6–12 words, using common letters (E, A, R, T, N, O) so they can cross.
A word that can't connect is skipped — open the browser console on that
crossword to see which.

### Quiz of the day → `js/data/puzzles.js` (`QUIZ`)

```js
{ q: "Which planet is known as the Red Planet?", answers: ["mars"], fact: "Mars looks red because..." },
```

`answers` lists every accepted answer. Capitals, punctuation and a leading
"the" are ignored automatically.

### Avatar shop prices → `js/avatar.js` (`CATALOG`)

Change any `price`. Items with `price: 0` are free and owned from the start.

---

## Rewards

| Action | Coins |
|---|---|
| Finish an article | 10 (once per article) |
| Daily Wordle | 15 (once per day) |
| Practice Wordle | 3 (once per word) |
| Crossword | 25 (once per crossword) |
| Quiz of the day | 5 (once per day) |

Every 50 XP is one level. Spending coins never lowers XP or level.

---

## Project structure

```
index.html              page shell (nav, footer), loads js/app.js
css/
  base.css              colours, fonts, buttons, cards, chips
  layout.css            nav, phone tab bar, footer, toasts
  home.css  articles.css  play.css  me.css   page styles
js/
  app.js                entry point: registers pages, starts the site
  router.js             #/address → page
  store.js              save system (localStorage + tamper seal)
  sound.js              sound effects (Web Audio, no files)
  ui.js                 toasts, coins, mute, nav avatar, rewards
  avatar.js             Bio bot SVG drawing + shop catalog
  crossword-builder.js  turns words into a crossword grid
  data/                 CONTENT: articles.js, puzzles.js
  pages/                home, articles, wordle, crossword, play, me
assets/                logo.png (club logo), favicon.png, apple-touch-icon.png
```

## Colours

The BioBulletin palette lives at the top of `css/base.css`:
Sage Green `#79A178`, Flag Red `#CE2424`, Blue Green `#4D96AC`,
Smoky Rose `#926968`, Vanilla Custard `#FAE9AC`, plus maroon text `#3A0F0F`
from the logo. Cards use light tints of these so text stays readable.

## Good to know

- **Progress is per browser and device.** Students can move it with the save
  code on My Space (Backup section).
- **Saves are sealed.** Editing a save in DevTools makes it invalid, and it
  resets. This stops casual cheating; it isn't unbreakable.
- **Don't rename the save key** (`curious-atom-save-v1` in `js/store.js`) —
  everyone would lose their progress.
