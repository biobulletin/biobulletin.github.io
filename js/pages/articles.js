/* =========================================================
   Articles: shared helpers, the list page and the reader page
   ========================================================= */

import { Store } from "../store.js";
import { UI } from "../ui.js";
import { ARTICLES, CATEGORIES } from "../data/articles.js";

export const Articles = (() => {
  const REWARD = 10;   // coins for finishing an article

  // ---------- Helpers ----------
  const byId = (id) => ARTICLES.find((a) => a.id === id);

  // Newest first (dates are "YYYY-MM-DD", so text order = date order)
  const newestFirst = () => [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

  const categoryOf = (a) => CATEGORIES[a.category] || { emoji: "✨", color: "lav" };

  // ~200 words per minute, at least 1 minute
  function readingMinutes(a) {
    const words = a.body.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }

  function niceDate(dateText) {
    return new Date(dateText + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  // Turn the simple article format into HTML.
  // Escape first (so stray < > can't break the page), then add our formatting.
  function formatBody(text) {
    return text.trim().split(/\n\s*\n/).map((block) => {
      const line = UI.esc(block.trim()).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith("&gt; ")) return `<aside class="fun-fact"><span aria-hidden="true">💡</span><p>${line.slice(5)}</p></aside>`;
      return `<p>${line}</p>`;
    }).join("");
  }

  // One article card (Outliers-style: coloured top, text below)
  function card(a) {
    const cat = categoryOf(a);
    const read = Store.get().read[a.id];
    return `
      <a class="acard" href="#/article/${a.id}" data-sound="pop">
        <div class="acard-top bg-${cat.color}">
          <span class="acard-emoji" aria-hidden="true">${a.emoji}</span>
          ${read ? `<span class="acard-read">✓ Read</span>` : ""}
        </div>
        <div class="acard-body">
          <span class="chip bg-${cat.color}">${cat.emoji} ${UI.esc(a.category)}</span>
          <h3>${UI.esc(a.title)}</h3>
          <p>${UI.esc(a.excerpt)}</p>
          <div class="acard-meta">
            <span>${UI.esc(a.author)}</span>
            <span>${readingMinutes(a)} min read</span>
          </div>
        </div>
      </a>`;
  }

  // ---------- List page: #/articles ----------
  function listPage(app) {
    let activeCategory = "All";
    let search = "";

    const counts = {};
    ARTICLES.forEach((a) => (counts[a.category] = (counts[a.category] || 0) + 1));
    const usedCategories = Object.keys(CATEGORIES).filter((c) => counts[c]);

    app.innerHTML = `
      <section class="container articles-page">
        <div class="articles-head">
          <div>
            <span class="pill-label">The magazine</span>
            <h1>All articles</h1>
            <p>${ARTICLES.length} articles written by club members. Finish one to earn ${REWARD} coins.</p>
          </div>
          <label class="search">
            <span aria-hidden="true">🔍</span>
            <input type="search" id="articleSearch" placeholder="Search articles…" autocomplete="off">
          </label>
        </div>

        <div class="filter-row" role="group" aria-label="Filter by category">
          <button class="filter active" data-cat="All" data-sound="pop">All <small>${ARTICLES.length}</small></button>
          ${usedCategories.map((c) => `
            <button class="filter" data-cat="${c}" data-sound="pop">
              ${CATEGORIES[c].emoji} ${c} <small>${counts[c]}</small>
            </button>`).join("")}
        </div>

        <div class="article-grid" id="articleGrid"></div>
      </section>`;

    const grid = app.querySelector("#articleGrid");

    // Redraw only the grid when a filter or the search changes
    function drawGrid() {
      const q = search.toLowerCase();
      const list = newestFirst().filter((a) =>
        (activeCategory === "All" || a.category === activeCategory) &&
        [a.title, a.excerpt, a.author, a.category, a.body].join(" ").toLowerCase().includes(q)
      );
      grid.innerHTML = list.length
        ? list.map(card).join("")
        : `<div class="empty card"><span>🔭</span><p>No articles found. Try another search or category.</p></div>`;
    }

    app.querySelectorAll(".filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        app.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
        drawGrid();
      });
    });

    app.querySelector("#articleSearch").addEventListener("input", (e) => {
      search = e.target.value.trim();
      drawGrid();
    });

    drawGrid();
  }

  // ---------- Reader page: #/article/some-id ----------
  function readerPage(app, id) {
    const a = byId(id);
    if (!a) {
      app.innerHTML = `
        <section class="container reader-missing">
          <div class="card bg-peach">
            <h1>Article not found</h1>
            <p>It may have been renamed or removed.</p>
            <a class="btn btn-dark" href="#/articles">Back to articles <span class="btn-arrow">→</span></a>
          </div>
        </section>`;
      return;
    }

    const cat = categoryOf(a);
    const more = newestFirst().filter((x) => x.id !== a.id).slice(0, 2);

    app.innerHTML = `
      <div class="read-progress" aria-hidden="true"><span id="readBar"></span></div>

      <article class="container reader">
        <a href="#/articles" class="back-link">← All articles</a>

        <header class="reader-head">
          <span class="chip bg-${cat.color}">${cat.emoji} ${UI.esc(a.category)}</span>
          <h1>${UI.esc(a.title)}</h1>
          <div class="reader-meta">
            <span>By <b>${UI.esc(a.author)}</b></span>
            <span>${niceDate(a.date)}</span>
            <span>${readingMinutes(a)} min read</span>
          </div>
        </header>

        <div class="reader-hero bg-${cat.color}" aria-hidden="true">${a.emoji}</div>

        <div class="reader-body">${formatBody(a.body)}</div>

        <div class="finish-card card" id="finishCard"></div>
      </article>

      ${more.length ? `
        <section class="container keep-reading">
          <h2>Keep reading</h2>
          <div class="article-grid">${more.map(card).join("")}</div>
        </section>` : ""}
    `;

    // Finish box: claim coins once per article
    const finish = app.querySelector("#finishCard");
    function drawFinish() {
      if (Store.get().read[a.id]) {
        finish.innerHTML = `<span class="finish-emoji">✅</span>
          <div><h3>You've read this one</h3><p>Nice work! Pick another article below.</p></div>`;
      } else {
        finish.innerHTML = `<span class="finish-emoji">🎉</span>
          <div><h3>Made it to the end?</h3><p>Claim your reward for finishing this article.</p></div>
          <button class="btn btn-dark" id="finishBtn" data-sound="none">I finished reading <span class="btn-arrow">+${REWARD}</span></button>`;
        finish.querySelector("#finishBtn").addEventListener("click", () => {
          Store.update((s) => { s.read[a.id] = Store.today(); });
          UI.reward(REWARD, "Article finished");
          drawFinish();
        });
      }
    }
    drawFinish();

    // Reading progress bar at the top of the screen
    const bar = app.querySelector("#readBar");
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 1;
      bar.style.transform = `scaleX(${pct})`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Cleanup: when the reader leaves this page, stop listening to scroll
    return () => window.removeEventListener("scroll", onScroll);
  }

  return { card, newestFirst, listPage, readerPage };
})();
