/* =========================================================
   Crosswords
   Two kinds, one shared grid player:

   FEATURED  #/play/crossword/<id>
     Fixed puzzles from CROSSWORDS. 25 coins, once each.

   PRACTICE  #/play/crossword/practice/<topic>
     Endless. "New crossword" picks random words from a topic's
     word bank (CROSSWORD_TOPICS) and builds a fresh grid.
     The current puzzle is saved, so students can come back to it.
     5 coins each, for the first 3 solved per day.

   Playing:
   - Type into squares; the cursor moves along the current word
   - Click a square twice (or a clue) to switch across/down
   - Letters are saved as you type
   ========================================================= */

import { Router } from "../router.js";
import { Store } from "../store.js";
import { Sound } from "../sound.js";
import { UI } from "../ui.js";
import { CrosswordBuilder } from "../crossword-builder.js";
import { CROSSWORDS, CROSSWORD_TOPICS } from "../data/puzzles.js";

export const Crossword = (() => {
  const FEATURED_REWARD = 25;
  const PRACTICE_REWARD = 5;
  const PRACTICE_DAILY_LIMIT = 3;   // practice puzzles that pay coins per day
  const PICK = 8;                   // words per practice crossword
  const MAX_COLS = 13;              // widest grid that fits a phone screen
  const key = CrosswordBuilder.key;
  const clean = (w) => w.toUpperCase().replace(/[^A-Z]/g, "");

  // The page container (#app) is shared by every page, so the click
  // listener we add to it must be removed when the crossword is redrawn
  // or the visitor leaves. Otherwise listeners pile up and one tap
  // would run several times.
  let detach = null;
  function cleanup() {
    if (detach) { detach(); detach = null; }
  }

  const byId = (id) => CROSSWORDS.find((c) => c.id === id);
  const topicById = (id) => CROSSWORD_TOPICS.find((t) => t.id === id);
  const isSolved = (id) => Boolean(Store.get().solved.crossword[id]);

  // =========================================================
  // Shared grid player
  // opts: title, chip, grid, progressKey, solved,
  //       onSolve(), doneHTML(), extraButtons, onAction(name)
  // =========================================================
  function play(app, opts) {
    const { grid, progressKey } = opts;
    const saved = (Store.get().crosswordProgress || {})[progressKey] || {};
    const letters = { ...saved };                 // "r,c" → "A"
    let dir = "across";
    let active = grid.words[0] ? grid.words[0].cells[0] : null;
    let done = opts.solved;

    // Which word is the cursor in?
    function currentWord() {
      const cell = grid.cells.get(active);
      if (!cell) return null;
      const index = cell[dir] !== undefined ? cell[dir] : cell[dir === "across" ? "down" : "across"];
      return grid.words[index];
    }

    // ---- Draw everything once; later updates only change classes/values ----
    const clueList = (d) => grid.words
      .filter((w) => w.dir === d)
      .sort((a, b) => a.num - b.num)
      .map((w) => `<li data-word="${w.index}"><b>${w.num}</b> ${UI.esc(w.clue)} <small>(${w.answer.length})</small></li>`)
      .join("");

    let cellsHTML = "";
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const k = key(r, c);
        if (!grid.cells.has(k)) { cellsHTML += `<div class="cw-blank"></div>`; continue; }
        const num = grid.numberAt[k];
        cellsHTML += `
          <div class="cw-cell" data-cell="${k}">
            ${num ? `<span class="cw-num">${num}</span>` : ""}
            <input maxlength="1" autocomplete="off" autocapitalize="characters" spellcheck="false"
                   aria-label="Row ${r + 1}, column ${c + 1}" value="${letters[k] || ""}">
          </div>`;
      }
    }

    app.innerHTML = `
      <section class="container cw-page">
        <a href="#/play" class="back-link">← All games</a>
        <div class="cw-head">
          <span class="chip bg-sage">${opts.chip}</span>
          <h1>${UI.esc(opts.title)}</h1>
        </div>

        <div class="cw-layout">
          <div class="cw-main">
            <div class="cw-current" id="cwCurrent" aria-live="polite"></div>
            <div class="cw-grid" style="--cols:${grid.cols}">${cellsHTML}</div>
            <div class="cw-buttons">
              <button class="btn btn-dark" data-action="check" data-sound="none">Check answers <span class="btn-arrow">✓</span></button>
              <button class="btn btn-outline" data-action="clear" data-sound="pop">Clear</button>
              ${opts.extraButtons || ""}
            </div>
            <div id="cwDone"></div>
          </div>

          <div class="cw-clues">
            <div><h3>Across</h3><ol>${clueList("across")}</ol></div>
            <div><h3>Down</h3><ol>${clueList("down")}</ol></div>
          </div>
        </div>
      </section>`;

    const inputs = {};
    app.querySelectorAll(".cw-cell").forEach((el) => (inputs[el.dataset.cell] = el.querySelector("input")));

    // ---- Highlighting ----
    function highlight() {
      const word = currentWord();
      const inWord = new Set(word ? word.cells : []);
      app.querySelectorAll(".cw-cell").forEach((el) => {
        el.classList.toggle("in-word", inWord.has(el.dataset.cell));
        el.classList.toggle("active", el.dataset.cell === active);
      });
      app.querySelectorAll(".cw-clues li").forEach((li) => {
        li.classList.toggle("active", word && Number(li.dataset.word) === word.index);
      });
      app.querySelector("#cwCurrent").innerHTML = word
        ? `<b>${word.num} ${word.dir}</b> ${UI.esc(word.clue)}` : "";
    }

    function focusCell(k) {
      if (!inputs[k]) return;
      active = k;
      inputs[k].focus();
      inputs[k].select();
      highlight();
    }

    // ---- Moving the cursor ----
    function step(k, d, amount) {
      const [r, c] = k.split(",").map(Number);
      const [dr, dc] = d === "across" ? [0, 1] : [1, 0];
      return key(r + dr * amount, c + dc * amount);
    }

    function moveInWord(amount) {
      const word = currentWord();
      if (!word) return;
      const i = word.cells.indexOf(active) + amount;
      if (i >= 0 && i < word.cells.length) focusCell(word.cells[i]);
    }

    // ---- Saving & checking ----
    function save() {
      Store.update((s) => {
        s.crosswordProgress = s.crosswordProgress || {};
        s.crosswordProgress[progressKey] = { ...letters };
      });
    }

    const allCorrect = () => [...grid.cells].every(([k, cell]) => letters[k] === cell.letter);

    function showDone() {
      app.querySelector("#cwDone").innerHTML = opts.doneHTML();
      Object.values(inputs).forEach((inp) => (inp.readOnly = true));
      app.querySelector(".cw-grid").classList.add("solved");
    }

    function win() {
      done = true;
      Sound.play("win");
      opts.onSolve();
      showDone();
    }

    // ---- Events ----
    app.querySelectorAll(".cw-cell input").forEach((input) => {
      const k = input.parentElement.dataset.cell;

      // Clicking the square you're already on flips direction (if both exist)
      // (only if this square ALREADY has focus — i.e. a genuine second click)
      input.addEventListener("mousedown", () => {
        const cell = grid.cells.get(k);
        if (document.activeElement === input && cell.across !== undefined && cell.down !== undefined) {
          dir = dir === "across" ? "down" : "across";
          setTimeout(highlight, 0);
        }
      });

      input.addEventListener("focus", () => {
        const cell = grid.cells.get(k);
        if (cell[dir] === undefined) dir = dir === "across" ? "down" : "across";
        active = k;
        input.select();
        highlight();
      });

      // Typing a letter (works on phone keyboards too)
      input.addEventListener("input", () => {
        if (done) return;
        const letter = input.value.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
        input.value = letter;
        if (letter) letters[k] = letter; else delete letters[k];
        input.parentElement.classList.remove("wrong");
        save();
        if (letter) {
          Sound.play("tick");
          if (allCorrect()) return win();
          moveInWord(1);
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value) {
          e.preventDefault();
          moveInWord(-1);
          const prev = inputs[active];
          if (prev && !done) { prev.value = ""; delete letters[active]; save(); }
        } else if (e.key.startsWith("Arrow")) {
          e.preventDefault();
          const d = e.key === "ArrowLeft" || e.key === "ArrowRight" ? "across" : "down";
          const amount = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
          const next = step(k, d, amount);
          if (inputs[next]) {
            if (grid.cells.get(next)[d] !== undefined) dir = d;
            focusCell(next);
          }
        }
      });
    });

    // Clicking a clue jumps to that word's first empty square
    app.querySelectorAll(".cw-clues li").forEach((li) => {
      li.addEventListener("click", () => {
        const word = grid.words[Number(li.dataset.word)];
        dir = word.dir;
        Sound.play("pop");
        focusCell(word.cells.find((k) => !letters[k]) || word.cells[0]);
      });
    });

    // Buttons (Check, Clear, and any extra ones like "New crossword").
    // One listener on the page, so buttons drawn later (in the done
    // panel) work too.
    cleanup();                                   // remove the previous puzzle's listener
    function onClick(e) {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;

      if (action === "check") {
        if (done) return;
        let wrong = 0, empty = 0;
        grid.cells.forEach((cell, k) => {
          const el = inputs[k].parentElement;
          if (!letters[k]) { empty++; return; }
          const bad = letters[k] !== cell.letter;
          el.classList.toggle("wrong", bad);
          if (bad) wrong++;
        });
        if (wrong) { Sound.play("error"); UI.toast(`${wrong} letter${wrong > 1 ? "s" : ""} need another look`, "🔎"); }
        else if (empty) { Sound.play("chime"); UI.toast(`All correct so far! ${empty} square${empty > 1 ? "s" : ""} to go`, "👍"); }
      } else if (action === "clear") {
        if (done) return;
        Object.keys(letters).forEach((k) => delete letters[k]);
        Object.values(inputs).forEach((inp) => { inp.value = ""; inp.parentElement.classList.remove("wrong"); });
        save();
        focusCell(grid.words[0].cells[0]);
      } else if (opts.onAction) {
        opts.onAction(action, { done, filled: Object.keys(letters).length, button: btn });
      }
    }
    app.addEventListener("click", onClick);
    detach = () => app.removeEventListener("click", onClick);

    if (done) showDone();
    highlight();
  }

  // =========================================================
  // Featured crosswords
  // =========================================================
  function page(app, id) {
    const puzzle = byId(id);
    if (!puzzle) { location.hash = "#/play"; return; }

    Router.setTitle(`${puzzle.title} crossword`);
    const grid = CrosswordBuilder.build(puzzle.entries);
    if (grid.skipped.length) {
      console.warn(`Crossword "${puzzle.id}": couldn't fit these words:`, grid.skipped);
    }

    play(app, {
      title: puzzle.title,
      chip: `⭐ Featured crossword · ${grid.words.length} words`,
      grid,
      progressKey: id,
      solved: isSolved(id),
      onSolve() {
        if (isSolved(id)) return;
        Store.update((s) => { s.solved.crossword[id] = Store.today(); });
        setTimeout(() => UI.reward(FEATURED_REWARD, "Crossword solved"), 500);
      },
      doneHTML: () => `
        <div class="card bg-teal cw-done">
          <h3>🎉 Crossword complete!</h3>
          <p>Every answer is correct.</p>
          <a class="btn btn-dark" href="#/play" data-sound="pop">More games <span class="btn-arrow">→</span></a>
        </div>`,
    });
    return cleanup;                // the router calls this when the visitor leaves
  }

  // =========================================================
  // Practice crosswords
  // =========================================================
  function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Pick random words and keep the best grid out of a few tries:
  // all words placed, no wider than a phone, then the most compact.
  function generate(topic) {
    const want = Math.min(PICK, topic.words.length);
    let best = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      const pick = shuffle(topic.words).slice(0, want);
      const grid = CrosswordBuilder.build(pick, { portrait: true });
      const score = (grid.words.length >= want ? 0 : 100)
                  + Math.max(0, grid.cols - MAX_COLS) * 10
                  + (grid.rows * grid.cols) / 100;
      if (!best || score < best.score) best = { pick, grid, score };
      if (grid.words.length >= want && grid.cols <= MAX_COLS) break;
    }
    // Save the answers in pick order: rebuilding from the same list in the
    // same order always produces exactly the same grid.
    const placed = new Set(best.grid.words.map((w) => w.answer));
    return best.pick.map((w) => clean(w.answer)).filter((a) => placed.has(a));
  }

  // Answers → { answer, clue } entries. null if a word left the bank.
  function entriesFor(topic, answers) {
    const entries = answers.map((a) => topic.words.find((w) => clean(w.answer) === a));
    return entries.every(Boolean) ? entries : null;
  }

  function newPuzzle(topicId) {
    const topic = topicById(topicId);
    Store.update((s) => {
      s.cwPractice = s.cwPractice || {};
      s.cwPractice[topicId] = { answers: generate(topic), solved: false };
      if (s.crosswordProgress) delete s.crosswordProgress[`practice:${topicId}`];
    });
  }

  // How many practice puzzles have paid coins today?
  function paidToday() {
    const d = Store.get().cwPracticeDaily;
    return d && d.date === Store.today() ? d.count : 0;
  }

  function practicePage(app, topicId) {
    const topic = topicById(topicId);
    if (!topic) { location.hash = "#/play"; return; }

    let state = (Store.get().cwPractice || {})[topicId];
    let entries = state && entriesFor(topic, state.answers);
    if (!entries) {                       // first visit, or the word bank changed
      newPuzzle(topicId);
      state = Store.get().cwPractice[topicId];
      entries = entriesFor(topic, state.answers);
    }

    Router.setTitle(`${topic.title} practice crossword`);
    const grid = CrosswordBuilder.build(entries, { portrait: true });
    const left = PRACTICE_DAILY_LIMIT - paidToday();

    let armed = false;    // "New crossword" needs a second tap if you've started this one

    play(app, {
      title: `${topic.title}`,
      chip: `${topic.emoji} Practice crossword · ${grid.words.length} words · ${left > 0 ? `+${PRACTICE_REWARD} coins` : "just for fun today"}`,
      grid,
      progressKey: `practice:${topicId}`,
      solved: state.solved,
      extraButtons: `<button class="btn btn-lime bg-vanilla" data-action="new" data-sound="none">🔀 New crossword</button>`,
      onSolve() {
        Store.update((s) => { s.cwPractice[topicId].solved = true; });
        if (paidToday() < PRACTICE_DAILY_LIMIT) {
          Store.update((s) => {
            s.cwPracticeDaily = { date: Store.today(), count: paidToday() + 1 };
          });
          setTimeout(() => UI.reward(PRACTICE_REWARD, "Practice crossword solved"), 500);
        } else {
          setTimeout(() => UI.toast("Today's practice coins are collected. Play on for fun!", "🧠"), 500);
        }
      },
      doneHTML: () => `
        <div class="card bg-teal cw-done">
          <h3>🎉 Solved!</h3>
          <p>Ready for another? Every one is different.</p>
          <button class="btn btn-dark" data-action="new" data-sound="none">🔀 New crossword <span class="btn-arrow">→</span></button>
        </div>`,
      onAction(action, { done, filled, button }) {
        if (action !== "new") return;
        // Don't throw away a half-finished puzzle on one accidental tap
        if (!done && filled > 0 && !armed) {
          armed = true;
          Sound.play("error");
          button.innerHTML = "Tap again to start a new one";
          setTimeout(() => { armed = false; button.innerHTML = "🔀 New crossword"; }, 4000);
          return;
        }
        Sound.play("pop");
        newPuzzle(topicId);
        practicePage(app, topicId);
        window.scrollTo(0, 0);
      },
    });
    return cleanup;                // the router calls this when the visitor leaves
  }

  // =========================================================
  // For the Play hub
  // =========================================================
  function progress(id) {
    const puzzle = byId(id);
    const total = CrosswordBuilder.build(puzzle.entries).cells.size;
    const filled = Object.keys((Store.get().crosswordProgress || {})[id] || {}).length;
    return { filled, total };
  }

  function practiceStatus(topicId) {
    const state = (Store.get().cwPractice || {})[topicId];
    const filled = Object.keys((Store.get().crosswordProgress || {})[`practice:${topicId}`] || {}).length;
    if (state && !state.solved && filled) return "Puzzle in progress";
    const left = PRACTICE_DAILY_LIMIT - paidToday();
    return left > 0 ? `Endless · +${PRACTICE_REWARD} coins (${left} left today)` : "Endless · just for fun today";
  }

  return { page, practicePage, isSolved, progress, practiceStatus };
})();
