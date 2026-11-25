/* =========================================================
   Crossword page: #/play/crossword/<id>
   - Type into squares; the cursor moves along the current word
   - Click a square twice (or a clue) to switch across/down
   - Letters are saved as you type
   - Solving it the first time earns coins
   ========================================================= */

import { Store } from "../store.js";
import { Sound } from "../sound.js";
import { UI } from "../ui.js";
import { CrosswordBuilder } from "../crossword-builder.js";
import { CROSSWORDS } from "../data/puzzles.js";

export const Crossword = (() => {
  const REWARD = 25;
  const key = CrosswordBuilder.key;

  const byId = (id) => CROSSWORDS.find((c) => c.id === id);
  const isSolved = (id) => Boolean(Store.get().solved.crossword[id]);

  function page(app, id) {
    const puzzle = byId(id);
    if (!puzzle) { location.hash = "#/play"; return; }

    const grid = CrosswordBuilder.build(puzzle.entries);
    if (grid.skipped.length) {
      console.warn(`Crossword "${puzzle.id}": couldn't fit these words:`, grid.skipped);
    }

    // ---- State ----
    const saved = (Store.get().crosswordProgress || {})[id] || {};
    const letters = { ...saved };                 // "r,c" → "A"
    let dir = "across";
    let active = grid.words[0] ? grid.words[0].cells[0] : null;
    let done = isSolved(id);

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
          <span class="chip bg-lav">✏️ Crossword · ${grid.words.length} words</span>
          <h1>${UI.esc(puzzle.title)}</h1>
        </div>

        <div class="cw-layout">
          <div class="cw-main">
            <div class="cw-current" id="cwCurrent" aria-live="polite"></div>
            <div class="cw-grid" style="--cols:${grid.cols}">${cellsHTML}</div>
            <div class="cw-buttons">
              <button class="btn btn-dark" data-action="check" data-sound="none">Check answers <span class="btn-arrow">✓</span></button>
              <button class="btn btn-outline" data-action="clear" data-sound="pop">Clear</button>
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
        s.crosswordProgress[id] = { ...letters };
      });
    }

    const allCorrect = () => [...grid.cells].every(([k, cell]) => letters[k] === cell.letter);

    function showDone() {
      app.querySelector("#cwDone").innerHTML = `
        <div class="card bg-mint cw-done">
          <h3>🎉 Crossword complete!</h3>
          <p>Every answer is correct.</p>
          <a class="btn btn-dark" href="#/play" data-sound="pop">More games <span class="btn-arrow">→</span></a>
        </div>`;
      Object.values(inputs).forEach((inp) => (inp.readOnly = true));
      app.querySelector(".cw-grid").classList.add("solved");
    }

    function win() {
      done = true;
      Sound.play("win");
      if (!isSolved(id)) {
        Store.update((s) => { s.solved.crossword[id] = Store.today(); });
        setTimeout(() => UI.reward(REWARD, "Crossword solved"), 500);
      }
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

    app.querySelector("[data-action=check]").addEventListener("click", () => {
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
    });

    app.querySelector("[data-action=clear]").addEventListener("click", () => {
      if (done) return;
      Object.keys(letters).forEach((k) => delete letters[k]);
      Object.values(inputs).forEach((inp) => { inp.value = ""; inp.parentElement.classList.remove("wrong"); });
      save();
      focusCell(grid.words[0].cells[0]);
    });

    if (done) showDone();
    highlight();
  }

  // For the Play hub: how many squares are filled in?
  function progress(id) {
    const puzzle = byId(id);
    const total = CrosswordBuilder.build(puzzle.entries).cells.size;
    const filled = Object.keys((Store.get().crosswordProgress || {})[id] || {}).length;
    return { filled, total };
  }

  return { page, isSolved, progress };
})();
