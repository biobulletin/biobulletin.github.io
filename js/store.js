/* =========================================================
   Store — the save system.

   Everything the visitor earns (coins, articles read, puzzles
   solved, avatar items...) lives in one object called `state`.
   We keep a copy in the browser's localStorage, a small storage
   box every website gets in each browser. It survives closing the
   tab or restarting the computer, but it's per browser + device.
   ========================================================= */

const Store = (() => {
  // The label on our storage box. It still uses the project's first
  // placeholder name ON PURPOSE: changing it would make every browser
  // look in a new, empty box, and everyone would lose their progress.
  const KEY = "curious-atom-save-v1";
  const XP_PER_LEVEL = 50;

  // What a brand-new visitor starts with
  function defaults() {
    return {
      version: 1,
      name: "",                 // nickname shown on My Space
      coins: 0,                 // spendable in the avatar shop
      xp: 0,                    // everything ever earned → decides level
      read: {},                 // { articleId: "2026-11-25" }
      solved: { wordle: {}, crossword: {} },   // { puzzleId: "2026-11-25" }
      wordleDaily: null,        // today's Wordle in progress: { date, word, guesses }
      crosswordProgress: {},    // letters typed so far: { puzzleId: { "r,c": "A" } }
      quiz: {},                 // { "2026-11-25": true } one quiz per day
      days: [],                 // dates the visitor was active → streak
      avatar: { color: "lav", eyes: "round", hat: "none", acc: "none", bg: "mint" },
      owned: [],                // bought items, e.g. "hat:crown"
      muted: false,             // sound on/off
    };
  }

  // Combine saved data with defaults, so that if we add a new field
  // later, old saves still get it instead of breaking.
  function merge(base, saved) {
    const out = { ...base, ...saved };
    out.solved = { ...base.solved, ...(saved.solved || {}) };
    out.avatar = { ...base.avatar, ...(saved.avatar || {}) };
    return out;
  }

  // Read the box. try/catch because localStorage can be blocked
  // (e.g. some private-browsing modes) or contain broken data.
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? merge(defaults(), JSON.parse(raw)) : defaults();
    } catch (e) {
      return defaults();
    }
  }

  let state = load();
  const listeners = [];

  // Write the box, then tell anyone listening (e.g. the coin counter)
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) { /* storage blocked: progress lasts until the tab closes */ }
    listeners.forEach((fn) => fn(state));
  }

  function get() { return state; }

  // Change something, then save: Store.update(s => { s.name = "Aisha"; })
  function update(changeFn) {
    changeFn(state);
    save();
  }

  function onChange(fn) { listeners.push(fn); }

  // ---------- Dates & streak ----------
  // Local date as "YYYY-MM-DD" (local, so the day flips at the visitor's midnight)
  function dateKey(d = new Date()) {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
  const today = () => dateKey();

  // Days since 1 Jan 1970 by calendar date. Used to pick "today's" Wordle
  // word and quiz question. Date.UTC avoids daylight-saving hours.
  function dayNumber(d = new Date()) {
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  }

  function markActiveToday() {
    if (!state.days.includes(today())) {
      update((s) => {
        s.days.push(today());
        s.days = s.days.slice(-400);       // keep it small
      });
    }
  }

  // Count back day by day while each day is in the list.
  // If today isn't done yet, the streak still counts from yesterday.
  function streak() {
    const d = new Date();
    if (!state.days.includes(dateKey(d))) d.setDate(d.getDate() - 1);
    let count = 0;
    while (state.days.includes(dateKey(d))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  // ---------- Coins & levels ----------
  function award(amount) {
    update((s) => { s.coins += amount; s.xp += amount; });
  }

  function spend(amount) {
    if (state.coins < amount) return false;
    update((s) => { s.coins -= amount; });
    return true;
  }

  const level = () => Math.floor(state.xp / XP_PER_LEVEL) + 1;
  const levelProgress = () => (state.xp % XP_PER_LEVEL) / XP_PER_LEVEL;   // 0 → 1

  // ---------- Save codes (move progress to another device) ----------
  // JSON text → bytes → base64, so it's one copy-pasteable line
  function exportCode() {
    const bytes = new TextEncoder().encode(JSON.stringify(state));
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }

  function importCode(code) {
    try {
      const binary = atob(code.trim());
      const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
      const data = JSON.parse(new TextDecoder().decode(bytes));
      if (typeof data !== "object" || typeof data.coins !== "number") return false;
      state = merge(defaults(), data);
      save();
      return true;
    } catch (e) {
      return false;
    }
  }

  function reset() {
    state = defaults();
    save();
  }

  return {
    get, update, onChange,
    today, dateKey, dayNumber, markActiveToday, streak,
    award, spend, level, levelProgress, XP_PER_LEVEL,
    exportCode, importCode, reset,
  };
})();
