/* =========================================================
   My Space: #/me
   1. Dashboard  — hello + name, stat rings, level, avatar card,
                   topics, quiz of the day, this week, up next
   2. Shop       — buy and wear avatar items
   3. Backup     — save code to move progress, reset
   ========================================================= */

import { Store } from "../store.js";
import { Sound } from "../sound.js";
import { UI } from "../ui.js";
import { Avatar } from "../avatar.js";
import { ARTICLES, CATEGORIES } from "../data/articles.js";
import { CROSSWORDS, QUIZ } from "../data/puzzles.js";
import { Articles } from "./articles.js";

export function MePage(app) {
  const QUIZ_REWARD = 5;
  const QUIZ_TRIES = 3;
  const s = Store.get();

  // ---------- Numbers for the dashboard ----------
  const readCount = ARTICLES.filter((a) => s.read[a.id]).length;
  const crosswordsDone = CROSSWORDS.filter((c) => s.solved.crossword[c.id]).length;
  const wordlesDone = Object.keys(s.solved.wordle).length;
  const streak = Store.streak();
  const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);

  // ---------- Small building blocks ----------
  // Ring = a circle filled part-way with conic-gradient (like a pie chart)
  const statCard = (color, emoji, number, label, percent) => `
    <div class="stat card bg-${color}">
      <div class="ring" style="--p:${percent}"><span>${emoji}</span></div>
      <b>${number}</b>
      <small>${label}</small>
    </div>`;

  function weekHTML() {
    // Monday → Sunday of the current week
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const names = ["M", "T", "W", "T", "F", "S", "S"];
    return names.map((n, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const k = Store.dateKey(d);
      const active = s.days.includes(k);
      const isToday = k === Store.today();
      return `<div class="day${active ? " active" : ""}${isToday ? " today" : ""}"
                   title="${active ? "Visited" : "Not visited"}">
                <small>${n}</small><b>${d.getDate()}</b>${active ? "<i>✓</i>" : ""}
              </div>`;
    }).join("");
  }

  function upNextHTML() {
    const unread = Articles.newestFirst().filter((a) => !s.read[a.id]).slice(0, 3);
    if (!unread.length) return `<p class="all-read">🎉 You've read every article. New ones are coming soon!</p>`;
    return unread.map((a) => `
      <a class="next-item" href="#/article/${a.id}" data-sound="pop">
        <span class="next-emoji bg-${(CATEGORIES[a.category] || {}).color || "sage"}">${a.emoji}</span>
        <span class="next-text"><b>${UI.esc(a.title)}</b><small>${UI.esc(a.category)} · +10 coins</small></span>
        <span class="next-go" aria-hidden="true">↗</span>
      </a>`).join("");
  }

  function topicsHTML() {
    return Object.entries(CATEGORIES).map(([name, cat]) => {
      const total = ARTICLES.filter((a) => a.category === name).length;
      if (!total) return "";
      const done = ARTICLES.filter((a) => a.category === name && s.read[a.id]).length;
      return `<span class="chip bg-${cat.color}${done === total ? " complete" : ""}">${cat.emoji} ${name} ${done}/${total}</span>`;
    }).join("");
  }

  // ---------- Page ----------
  const displayName = s.name || "Explorer";
  const xpIntoLevel = s.xp % Store.XP_PER_LEVEL;

  app.innerHTML = `
    <section class="container me-page">

      <!-- ===== DASHBOARD ===== -->
      <div class="dash">
        <!-- Column 1 -->
        <div class="dash-col">
          <div class="hello">
            <h1>Hello, <span id="helloName">${UI.esc(displayName)}</span></h1>
            <button class="icon-btn" id="editName" aria-label="Change your name" data-sound="pop">✏️</button>
          </div>
          <form class="name-form" id="nameForm" hidden>
            <input id="nameInput" maxlength="20" placeholder="Your nickname" value="${UI.esc(s.name)}" autocomplete="off">
            <button class="btn btn-dark" type="submit" data-sound="pop">Save</button>
          </form>

          <div class="stats">
            ${statCard("teal", "📰", readCount, "Articles read", pct(readCount, ARTICLES.length))}
            ${statCard("blush", "🧩", crosswordsDone + wordlesDone, "Puzzles solved", pct(crosswordsDone, CROSSWORDS.length))}
            ${statCard("sage", "🔥", streak, "Day streak", pct(Math.min(streak, 7), 7))}
          </div>

          <div class="level card bg-sage">
            <div class="level-top">
              <b>Level ${Store.level()}</b>
              <span>${s.xp} XP total</span>
            </div>
            <div class="bar"><span style="width:${Store.levelProgress() * 100}%"></span></div>
            <small>${Store.XP_PER_LEVEL - xpIntoLevel} XP to level ${Store.level() + 1}</small>
          </div>
        </div>

        <!-- Column 2 -->
        <div class="dash-col">
          <div class="avatar-card card">
            <div class="avatar-card-top">
              <span>Level ${Store.level()}</span>
              <span>${Math.round(Store.levelProgress() * 100)}%</span>
            </div>
            <div class="bar dark"><span style="width:${Store.levelProgress() * 100}%"></span></div>
            <button class="avatar-big" id="bigAvatar" data-sound="none" aria-label="Pat your capybara"></button>
            <div class="avatar-actions">
              <a class="icon-btn" href="#shop" data-sound="pop" aria-label="Go to the shop" title="Shop">🛍️</a>
              <a class="icon-btn" href="#/articles" aria-label="Read articles" title="Read">📰</a>
              <a class="icon-btn" href="#/play" aria-label="Play games" title="Play">🧩</a>
            </div>
          </div>
          <div class="topics">${topicsHTML()}</div>
          <div class="quiz card" id="quizBox"></div>
        </div>

        <!-- Column 3 -->
        <div class="dash-col">
          <div class="card week-card">
            <h3>This week</h3>
            <div class="week">${weekHTML()}</div>
            <small>${streak ? `🔥 ${streak}-day streak. Come back tomorrow to keep it going!` : "Visit every day to build a streak."}</small>
          </div>
          <div class="card up-next">
            <h3>Up next</h3>
            ${upNextHTML()}
          </div>
        </div>
      </div>

      <!-- ===== SHOP ===== -->
      <div class="shop card" id="shop">
        <div class="shop-head">
          <div>
            <span class="pill-label">Avatar shop</span>
            <h2>Style your capybara</h2>
          </div>
          <div class="coin-balance">🪙 <b id="shopCoins"></b> coins to spend</div>
        </div>
        <div class="shop-tabs" role="tablist">
          ${Object.entries(Avatar.CATALOG).map(([slot, c], i) => `
            <button class="shop-tab${i === 0 ? " active" : ""}" data-tab="${slot}" role="tab" data-sound="pop">
              <span aria-hidden="true">${c.icon}</span> ${c.label}
            </button>`).join("")}
        </div>
        <div class="shop-grid" id="shopGrid"></div>
      </div>

      <!-- ===== BACKUP ===== -->
      <div class="backup card">
        <div>
          <span class="pill-label">Backup</span>
          <h2>Keep your progress safe</h2>
          <p>Your progress is saved in <b>this browser only</b>. Copy your save code and keep it somewhere safe
             (like a note on your phone). Paste it here on any device to get everything back.</p>
        </div>
        <div class="backup-actions">
          <button class="btn btn-dark" id="copyCode" data-sound="pop">Copy my save code <span class="btn-arrow">⧉</span></button>
          <textarea id="codeOut" readonly hidden rows="3" aria-label="Your save code"></textarea>

          <textarea id="codeIn" rows="3" placeholder="Paste a save code here…" aria-label="Paste a save code"></textarea>
          <div class="backup-row">
            <button class="btn btn-outline" id="loadCode" data-sound="none">Load save code</button>
            <button class="btn btn-danger" id="resetAll" data-sound="none">Reset everything</button>
          </div>
        </div>
      </div>
    </section>`;

  // =========================================================
  // Name
  // =========================================================
  const nameForm = app.querySelector("#nameForm");
  const nameInput = app.querySelector("#nameInput");
  app.querySelector("#editName").addEventListener("click", () => {
    nameForm.hidden = !nameForm.hidden;
    if (!nameForm.hidden) nameInput.focus();
  });
  nameForm.addEventListener("submit", (e) => {
    e.preventDefault();                       // stop the form reloading the page
    const name = nameInput.value.trim().slice(0, 20);
    Store.update((st) => { st.name = name; });
    app.querySelector("#helloName").textContent = name || "Explorer";
    nameForm.hidden = true;
    UI.toast(name ? `Nice to meet you, ${name}!` : "Name cleared", "👋");
  });

  // =========================================================
  // Avatar (dashboard card) + shop
  // =========================================================
  const big = app.querySelector("#bigAvatar");
  const grid = app.querySelector("#shopGrid");
  let tab = "color";

  function wiggle() {
    big.classList.remove("wiggle");
    void big.offsetWidth;
    big.classList.add("wiggle");
  }

  function drawAvatar() {
    big.innerHTML = Avatar.svg(Avatar.current());
    app.querySelector("#shopCoins").textContent = Store.get().coins;
  }

  function drawGrid() {
    const look = Avatar.current();
    const coins = Store.get().coins;
    grid.innerHTML = Avatar.CATALOG[tab].items.map((item) => {
      const owned = Avatar.owns(tab, item.id);
      const wearing = look[tab] === item.id;
      const badge = wearing ? `<span class="badge wearing">Wearing</span>`
        : owned ? `<span class="badge owned">Owned</span>`
        : `<span class="badge price">🪙 ${item.price}</span>`;
      return `
        <button class="shop-item${wearing ? " is-wearing" : ""}${!owned && coins < item.price ? " locked" : ""}"
                data-item="${item.id}" data-sound="none">
          ${Avatar.svg({ ...look, [tab]: item.id }, "avatar-mini")}
          <span class="item-name">${item.name}</span>
          ${badge}
        </button>`;
    }).join("");
  }

  app.querySelectorAll(".shop-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      tab = btn.dataset.tab;
      app.querySelectorAll(".shop-tab").forEach((b) => b.classList.toggle("active", b === btn));
      drawGrid();
    });
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-item]");
    if (!btn) return;
    const item = Avatar.find(tab, btn.dataset.item);
    const result = Avatar.buyOrWear(tab, item.id);
    if (result === "poor") {
      Sound.play("error");
      UI.toast(`You need ${item.price - Store.get().coins} more coins`, "🪙");
      return;
    }
    if (result === "bought") { Sound.play("coin"); UI.toast(`Bought ${item.name}! −${item.price} coins`, "🛍️"); }
    else Sound.play("pop");
    drawAvatar();
    drawGrid();
    wiggle();
  });

  big.addEventListener("click", () => { Sound.play("boing"); wiggle(); });

  // "#shop" would confuse the router (it watches the # part), so scroll by hand
  app.querySelector('[href="#shop"]').addEventListener("click", (e) => {
    e.preventDefault();
    app.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  });

  // =========================================================
  // Quiz of the day
  // =========================================================
  const quizBox = app.querySelector("#quizBox");
  const question = QUIZ[Store.dayNumber() % QUIZ.length];

  // "The Sun!" → "sun"
  // Order matters: tidy spaces and trim FIRST, so "the" is really at the start
  const normalise = (t) => t.toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")    // drop punctuation
    .replace(/\s+/g, " ")          // squash repeated spaces
    .trim()
    .replace(/^the /, "");         // "the sun" → "sun"
  const accepted = question.answers.map(normalise);

  function drawQuiz() {
    const today = Store.get().quiz[Store.today()] || { tries: 0 };
    const finished = today.correct || today.tries >= QUIZ_TRIES;

    if (finished) {
      quizBox.className = `quiz card ${today.correct ? "bg-teal" : "bg-blush"}`;
      quizBox.innerHTML = `
        <span class="pill-label">Quiz of the day</span>
        <h3>${UI.esc(question.q)}</h3>
        <p class="quiz-result">${today.correct
          ? `✅ Correct! <b>+${QUIZ_REWARD} coins</b>`
          : `The answer was <b>${UI.esc(question.answers[0])}</b>.`}</p>
        <p class="quiz-fact">💡 ${UI.esc(question.fact)}</p>
        <small>A new question arrives tomorrow.</small>`;
      return;
    }

    const left = QUIZ_TRIES - today.tries;
    quizBox.className = "quiz card";
    quizBox.innerHTML = `
      <span class="pill-label">Quiz of the day · +${QUIZ_REWARD} coins</span>
      <h3>${UI.esc(question.q)}</h3>
      <form class="quiz-form" id="quizForm">
        <input id="quizInput" placeholder="Type your answer…" autocomplete="off" aria-label="Your answer">
        <button class="icon-btn" type="submit" aria-label="Submit answer" data-sound="none">→</button>
      </form>
      <small>${left} ${left === 1 ? "try" : "tries"} left</small>`;

    quizBox.querySelector("#quizForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = quizBox.querySelector("#quizInput");
      const guess = normalise(input.value);
      if (!guess) return;
      const correct = accepted.includes(guess);

      Store.update((st) => {
        const t = st.quiz[Store.today()] || { tries: 0 };
        t.tries += 1;
        t.correct = correct;
        st.quiz[Store.today()] = t;
      });

      if (correct) {
        UI.reward(QUIZ_REWARD, "Quiz answered");
        Sound.play("chime");
      } else {
        Sound.play("error");
        quizBox.classList.remove("shake"); void quizBox.offsetWidth; quizBox.classList.add("shake");
      }
      setTimeout(drawQuiz, correct ? 0 : 400);
    });
  }

  // =========================================================
  // Backup: export / import / reset
  // =========================================================
  app.querySelector("#copyCode").addEventListener("click", async () => {
    const out = app.querySelector("#codeOut");
    out.value = Store.exportCode();
    out.hidden = false;
    out.select();
    try {
      await navigator.clipboard.writeText(out.value);
      UI.toast("Save code copied! Keep it somewhere safe", "📋");
    } catch (err) {
      UI.toast("Select the code below and copy it", "📋");   // clipboard blocked: user copies by hand
    }
  });

  app.querySelector("#loadCode").addEventListener("click", () => {
    const code = app.querySelector("#codeIn").value;
    if (code.trim() && Store.importCode(code)) {
      Sound.play("win");
      UI.toast("Progress loaded!", "✅");
      MePage(app);                              // redraw the whole page with the loaded save
    } else {
      Sound.play("error");
      UI.toast("That code doesn't look right. Check you copied all of it", "⚠️");
    }
  });

  // Reset needs two taps, so nobody wipes their progress by accident
  const resetBtn = app.querySelector("#resetAll");
  let armed = false, disarmTimer = null;
  resetBtn.addEventListener("click", () => {
    if (!armed) {
      armed = true;
      Sound.play("error");
      resetBtn.textContent = "Tap again to erase everything";
      disarmTimer = setTimeout(() => { armed = false; resetBtn.textContent = "Reset everything"; }, 4000);
      return;
    }
    clearTimeout(disarmTimer);
    Store.reset();
    Store.markActiveToday();
    Sound.play("pop");
    UI.toast("Progress reset. Fresh start!", "🧹");
    MePage(app);
  });

  drawAvatar();
  drawGrid();
  drawQuiz();
}
