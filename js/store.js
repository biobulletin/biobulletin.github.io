/* =========================================================
   Store — the save system.

   Everything the visitor earns (coins, articles read, puzzles
   solved, avatar items...) lives in one object called `state`.
   We keep a copy in the browser's localStorage, a small storage
   box every website gets in each browser. It survives closing the
   tab or restarting the computer, but it's per browser + device.

   TAMPER SEAL
   Each save is stored together with a "fingerprint" (a short code
   calculated from the save's exact text). If someone edits the save
   by hand in DevTools, the fingerprint no longer matches, and we
   ignore the edited save. It's a lock on a diary, not a bank vault:
   someone who reads this code could still forge one, but it stops
   casual editing.
   ========================================================= */

export const Store = (() => {
  // The label on our storage box. It still uses the project's first
  // placeholder name ON PURPOSE: changing it would make every browser
  // look in a new, empty box, and everyone would lose their progress.
  const KEY = "curious-atom-save-v1";
  const XP_PER_LEVEL = 50;
  const SALT = "biobulletin:2026";   // mixed into every fingerprint

  // Fingerprint (hash): turns any text into a short code. Change even one
  // character of the text and the code comes out completely different.
  // (This is the well-known "cyrb53" hash: fast and simple, not for passwords.)
  function fingerprint(text) {
    const str = SALT + text;
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }

  // state → sealed text: {"data":"...the save...","sig":"k3j9x..."}
  function seal(obj) {
    const data = JSON.stringify(obj);
    return JSON.stringify({ data, sig: fingerprint(data) });
  }

  // sealed text → state, or null if it was edited / isn't a valid save
  function unseal(text) {
    const box = JSON.parse(text);
    if (!box || typeof box.data !== "string" || box.sig !== fingerprint(box.data)) return null;
    const obj = JSON.parse(box.data);
    return obj && typeof obj === "object" && typeof obj.coins === "number" ? obj : null;
  }

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
  let tampered = false;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const saved = unseal(raw);
      if (saved) return merge(defaults(), saved);
      // An old save from before the seal existed: quietly start fresh.
      // Anything else (edited, broken) also starts fresh, but we say so.
      const old = JSON.parse(raw);
      if (!(old && old.sig === undefined && typeof old.coins === "number")) tampered = true;
      return defaults();
    } catch (e) {
      tampered = true;
      return defaults();
    }
  }

  let state = load();
  const listeners = [];

  // Write the box, then tell anyone listening (e.g. the coin counter)
  function save() {
    try {
      localStorage.setItem(KEY, seal(state));
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
  // Sealed text → bytes → base64, so it's one copy-pasteable line.
  // The seal travels inside the code, so an edited code is rejected too.
  function exportCode() {
    const bytes = new TextEncoder().encode(seal(state));
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }

  function importCode(code) {
    try {
      const binary = atob(code.trim());
      const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
      const data = unseal(new TextDecoder().decode(bytes));
      if (!data) return false;
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
    wasTampered: () => tampered,
  };
})();
