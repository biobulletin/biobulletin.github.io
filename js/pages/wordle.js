/* =========================================================
   STEM Wordle
   - One daily word (same for everyone that day) + practice mode
   - On-screen keyboard and physical keyboard
   - The daily game is saved, so refreshing doesn't reset it
   ========================================================= */

import { Store } from "../store.js";
import { Sound } from "../sound.js";
import { UI } from "../ui.js";
import { WORDLE_WORDS } from "../data/puzzles.js";

export const Wordle = (() => {
  const MAX_GUESSES = 6;
  const DAILY_REWARD = 15;
  const PRACTICE_REWARD = 3;
  const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "+ZXCVBNM-"];   // + = Enter, - = Backspace

  const clean = (w) => w.toUpperCase().replace(/[^A-Z]/g, "");

  // Same word for everyone on the same day, cycling through the list
  const dailyPuzzle = () => WORDLE_WORDS[Store.dayNumber() % WORDLE_WORDS.length];

  // Colour each letter of a guess.
  // Two passes so repeated letters are handled correctly:
  //   1) exact matches first (green)
  //   2) then letters that exist elsewhere, but only as many times as
  //      they're still "unused" in the answer (yellow)
  function score(guess, answer) {
    const result = Array(guess.length).fill("absent");
    const leftover = {};
    for (let i = 0; i < answer.length; i++) {
      if (guess[i] === answer[i]) result[i] = "correct";
      else leftover[answer[i]] = (leftover[answer[i]] || 0) + 1;
    }
    for (let i = 0; i < guess.length; i++) {
      if (result[i] !== "correct" && leftover[guess[i]] > 0) {
        result[i] = "present";
        leftover[guess[i]]--;
      }
    }
    return result;
  }

  function page(app) {
    // ----- Game state -----
    let mode, puzzle, answer, guesses, current, over;
    let hintShown = false;
    let revealRow = -1;     // which row should play the flip animation
    let popLast = false;    // pop animation on the letter just typed
    let message = "";

    function startDaily() {
      mode = "daily";
      puzzle = dailyPuzzle();
      answer = clean(puzzle.word);
      const saved = Store.get().wordleDaily;
      const sameGame = saved && saved.date === Store.today() && saved.word === answer;
      guesses = sameGame ? [...saved.guesses] : [];
      current = "";
      over = guesses.includes(answer) || guesses.length >= MAX_GUESSES;
      hintShown = false;
      revealRow = -1;
      message = "";
      draw();
    }

    function startPractice() {
      mode = "practice";
      const pool = WORDLE_WORDS.filter((w) => clean(w.word) !== answer);
      puzzle = pool.length ? pool[Math.floor(Math.random() * pool.length)] : dailyPuzzle();
      answer = clean(puzzle.word);
      guesses = [];
      current = "";
      over = false;
      hintShown = false;
      revealRow = -1;
      message = "";
      draw();
    }

    // Best known state for each keyboard letter: correct > present > absent
    function keyStates() {
      const rank = { absent: 1, present: 2, correct: 3 };
      const states = {};
      guesses.forEach((g) => {
        score(g, answer).forEach((s, i) => {
          if (!states[g[i]] || rank[s] > rank[states[g[i]]]) states[g[i]] = s;
        });
      });
      return states;
    }

    // ----- Drawing -----
    function boardHTML() {
      let html = "";
      for (let r = 0; r < MAX_GUESSES; r++) {
        let tiles = "";
        const isGuess = r < guesses.length;
        const isCurrent = r === guesses.length && !over;
        const states = isGuess ? score(guesses[r], answer) : null;

        for (let i = 0; i < answer.length; i++) {
          let letter = "", cls = "tile";
          if (isGuess) {
            letter = guesses[r][i];
            cls += ` ${states[i]}`;
            if (r === revealRow) cls += " reveal";
          } else if (isCurrent && current[i]) {
            letter = current[i];
            cls += " filled";
            if (popLast && i === current.length - 1) cls += " pop";
          }
          const delay = r === revealRow ? ` style="animation-delay:${i * 0.12}s"` : "";
          tiles += `<div class="${cls}"${delay}>${letter}</div>`;
        }
        html += `<div class="wrow${isCurrent ? " current" : ""}">${tiles}</div>`;
      }
      return html;
    }

    function keyboardHTML() {
      const states = keyStates();
      return KEY_ROWS.map((row) => `
        <div class="krow">
          ${[...row].map((k) => {
            if (k === "+") return `<button class="key wide" data-key="ENTER" data-sound="none">Enter</button>`;
            if (k === "-") return `<button class="key wide" data-key="BACK" data-sound="none" aria-label="Delete">⌫</button>`;
            return `<button class="key ${states[k] || ""}" data-key="${k}" data-sound="none">${k}</button>`;
          }).join("")}
        </div>`).join("");
    }

    function endHTML() {
      if (!over) return "";
      const won = guesses.includes(answer);
      return `
        <div class="wordle-end card ${won ? "bg-mint" : "bg-peach"}">
          <h3>${won ? `🎉 Got it in ${guesses.length}/${MAX_GUESSES}!` : "😅 So close!"}</h3>
          <p>The word was <b>${answer}</b> — ${UI.esc(puzzle.hint)}</p>
          ${mode === "daily" ? `<p class="small">A new daily word arrives tomorrow.</p>` : ""}
          <div class="wordle-end-buttons">
            <button class="btn btn-dark" data-action="practice" data-sound="pop">Practice another <span class="btn-arrow">→</span></button>
            ${mode === "practice" ? `<button class="btn btn-outline" data-action="daily" data-sound="pop">Today's word</button>` : ""}
          </div>
        </div>`;
    }

    function draw() {
      app.innerHTML = `
        <section class="container wordle-page">
          <a href="#/play" class="back-link">← All games</a>
          <div class="wordle-head">
            <span class="chip ${mode === "daily" ? "bg-lime" : "bg-lav"}">
              ${mode === "daily" ? "📅 Daily word" : "🎯 Practice"} · ${UI.esc(puzzle.category || "STEM")}
            </span>
            <h1>STEM Wordle</h1>
            <p>Guess the ${answer.length}-letter science word in ${MAX_GUESSES} tries.
               <span class="legend"><i class="correct"></i>right spot <i class="present"></i>wrong spot <i class="absent"></i>not in word</span></p>
          </div>

          <div class="board" style="--len:${answer.length}">${boardHTML()}</div>

          <p class="wordle-msg" role="status" aria-live="polite">${message}</p>

          ${!over ? `
            <div class="hint-box">
              ${hintShown
                ? `<p>💡 ${UI.esc(puzzle.hint)}</p>`
                : `<button class="btn btn-outline" data-action="hint" data-sound="pop">💡 Show hint</button>`}
            </div>` : ""}

          ${endHTML()}

          <div class="keyboard" aria-label="Keyboard">${keyboardHTML()}</div>
        </section>`;
      // One-time animations: play them on this draw only, not on every redraw
      popLast = false;
      revealRow = -1;
    }

    // ----- Playing -----
    function shakeCurrentRow() {
      const row = app.querySelector(".wrow.current");
      if (row) { row.classList.remove("shake"); void row.offsetWidth; row.classList.add("shake"); }
    }

    function finishGame(won) {
      over = true;
      const revealTime = answer.length * 120 + 350;     // wait for the flip animation
      if (won) {
        const key = mode === "daily" ? `daily:${Store.today()}` : `word:${answer}`;
        const firstTime = !Store.get().solved.wordle[key];
        if (firstTime) Store.update((s) => { s.solved.wordle[key] = Store.today(); });
        setTimeout(() => {
          Sound.play("win");
          if (firstTime) UI.reward(mode === "daily" ? DAILY_REWARD : PRACTICE_REWARD, "Wordle solved");
        }, revealTime);
      } else {
        setTimeout(() => Sound.play("error"), revealTime);
      }
    }

    function submit() {
      if (current.length < answer.length) {
        message = "Not enough letters";
        Sound.play("error");
        draw();
        shakeCurrentRow();
        return;
      }
      guesses.push(current);
      revealRow = guesses.length - 1;
      current = "";
      message = "";
      Sound.play("pop");

      if (mode === "daily") {
        Store.update((s) => { s.wordleDaily = { date: Store.today(), word: answer, guesses: [...guesses] }; });
      }

      if (guesses[guesses.length - 1] === answer) finishGame(true);
      else if (guesses.length >= MAX_GUESSES) finishGame(false);
      draw();
    }

    function press(key) {
      if (over) return;
      if (key === "ENTER") return submit();
      if (key === "BACK") {
        current = current.slice(0, -1);
        message = "";
        return draw();
      }
      if (/^[A-Z]$/.test(key) && current.length < answer.length) {
        current += key;
        popLast = true;
        message = "";
        Sound.play("tick");
        draw();
      }
    }

    // ----- Input -----
    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") { e.preventDefault(); press("ENTER"); }
      else if (e.key === "Backspace") { e.preventDefault(); press("BACK"); }
      else if (/^[a-z]$/i.test(e.key)) press(e.key.toUpperCase());
    }

    function onClick(e) {
      const key = e.target.closest("[data-key]");
      if (key) return press(key.dataset.key);
      const action = e.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "hint") { hintShown = true; revealRow = -1; draw(); }
      if (action.dataset.action === "practice") startPractice();
      if (action.dataset.action === "daily") startDaily();
    }

    document.addEventListener("keydown", onKeyDown);
    app.addEventListener("click", onClick);
    startDaily();

    // Cleanup when leaving: stop catching keys and clicks for this game
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      app.removeEventListener("click", onClick);
    };
  }

  // For the Play hub: has today's daily been solved?
  function solvedToday() {
    return Boolean(Store.get().solved.wordle[`daily:${Store.today()}`]);
  }

  return { page, solvedToday, score };
})();
