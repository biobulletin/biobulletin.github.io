/* =========================================================
   Crossword builder — turns a list of words into a grid.

   The idea (like building with LEGO):
   1. Put the longest word down first, going across.
   2. For each other word, look for a letter it shares with a word
      already on the grid, and try crossing there.
   3. Only allow a spot if it follows crossword rules:
        - letters that overlap must match
        - no touching side-by-side with other words
        - the squares just before and after the word are empty
   4. Among the legal spots, pick the one with the most crossings,
      then the one that keeps the grid most compact.
   5. Number the starting squares in reading order (1, 2, 3...).

   It's deterministic: the same words always give the same grid,
   so every student sees the same puzzle.
   ========================================================= */

export const CrosswordBuilder = (() => {
  const STEP = { across: [0, 1], down: [1, 0] };   // [row change, column change]
  const key = (r, c) => `${r},${c}`;

  function build(entries) {
    const words = entries
      .map((e, i) => ({ answer: e.answer.toUpperCase().replace(/[^A-Z]/g, ""), clue: e.clue, order: i }))
      .filter((w) => w.answer.length >= 2)
      .sort((a, b) => b.answer.length - a.answer.length || a.order - b.order);

    const cells = new Map();     // "r,c" → { letter, across: wordIndex?, down: wordIndex? }
    const placed = [];           // { answer, clue, r, c, dir }

    // ---- Can this word go here? Returns number of crossings, or -1 if illegal ----
    function check(word, r, c, dir) {
      const [dr, dc] = STEP[dir];
      // Squares right before the start and right after the end must be empty
      if (cells.has(key(r - dr, c - dc))) return -1;
      if (cells.has(key(r + dr * word.length, c + dc * word.length))) return -1;

      let crossings = 0;
      for (let i = 0; i < word.length; i++) {
        const rr = r + dr * i, cc = c + dc * i;
        const cell = cells.get(key(rr, cc));
        if (cell) {
          if (cell.letter !== word[i]) return -1;   // letters must match
          if (cell[dir] !== undefined) return -1;   // can't lie on top of a same-direction word
          crossings++;
        } else {
          // New square: nothing may touch it from the sides
          // (for "across" that's above/below; for "down" it's left/right)
          if (cells.has(key(rr + dc, cc + dr)) || cells.has(key(rr - dc, cc - dr))) return -1;
        }
      }
      return crossings;
    }

    function place(w, r, c, dir) {
      const [dr, dc] = STEP[dir];
      const index = placed.length;
      for (let i = 0; i < w.answer.length; i++) {
        const k = key(r + dr * i, c + dc * i);
        const cell = cells.get(k) || { letter: w.answer[i] };
        cell[dir] = index;
        cells.set(k, cell);
      }
      placed.push({ answer: w.answer, clue: w.clue, r, c, dir });
    }

    // Size of the grid if we added a word at this spot (smaller = tidier)
    function areaWith(word, r, c, dir) {
      const [dr, dc] = STEP[dir];
      let minR = r, maxR = r + dr * (word.length - 1), minC = c, maxC = c + dc * (word.length - 1);
      cells.forEach((_, k) => {
        const [rr, cc] = k.split(",").map(Number);
        minR = Math.min(minR, rr); maxR = Math.max(maxR, rr);
        minC = Math.min(minC, cc); maxC = Math.max(maxC, cc);
      });
      return (maxR - minR + 1) * (maxC - minC + 1);
    }

    function bestSpot(w) {
      let best = null;
      cells.forEach((cell, k) => {
        // A crossing square can only be used by one across + one down word
        if (cell.across !== undefined && cell.down !== undefined) return;
        const dir = cell.across !== undefined ? "down" : "across";
        const [dr, dc] = STEP[dir];
        const [cr, cc] = k.split(",").map(Number);
        for (let i = 0; i < w.answer.length; i++) {
          if (w.answer[i] !== cell.letter) continue;
          const r = cr - dr * i, c = cc - dc * i;
          const crossings = check(w.answer, r, c, dir);
          if (crossings < 1) continue;
          const area = areaWith(w.answer, r, c, dir);
          if (!best || crossings > best.crossings || (crossings === best.crossings && area < best.area)) {
            best = { r, c, dir, crossings, area };
          }
        }
      });
      return best;
    }

    // ---- Place words ----
    if (words.length) place(words[0], 0, 0, "across");
    let waiting = words.slice(1);

    // Keep trying: a word that didn't fit earlier may fit once others are placed
    let progress = true;
    while (waiting.length && progress) {
      progress = false;
      waiting = waiting.filter((w) => {
        const spot = bestSpot(w);
        if (!spot) return true;            // still waiting
        place(w, spot.r, spot.c, spot.dir);
        progress = true;
        return false;
      });
    }

    // ---- Shift everything so the top-left is (0, 0) ----
    let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
    cells.forEach((_, k) => {
      const [r, c] = k.split(",").map(Number);
      minR = Math.min(minR, r); minC = Math.min(minC, c);
      maxR = Math.max(maxR, r); maxC = Math.max(maxC, c);
    });
    const grid = new Map();
    cells.forEach((cell, k) => {
      const [r, c] = k.split(",").map(Number);
      grid.set(key(r - minR, c - minC), cell);
    });
    placed.forEach((p) => { p.r -= minR; p.c -= minC; });

    // ---- Number the clues in reading order ----
    const starts = [...new Set(placed.map((p) => key(p.r, p.c)))]
      .map((k) => k.split(",").map(Number))
      .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const numberAt = {};
    starts.forEach(([r, c], i) => (numberAt[key(r, c)] = i + 1));

    placed.forEach((p, index) => {
      p.index = index;
      p.num = numberAt[key(p.r, p.c)];
      const [dr, dc] = STEP[p.dir];
      p.cells = [...p.answer].map((_, i) => key(p.r + dr * i, p.c + dc * i));
    });

    return {
      rows: placed.length ? maxR - minR + 1 : 0,
      cols: placed.length ? maxC - minC + 1 : 0,
      cells: grid,
      words: placed,
      numberAt,
      skipped: waiting.map((w) => w.answer),
    };
  }

  return { build, key };
})();
