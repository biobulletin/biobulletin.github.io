/* =========================================================
   App — registers every page with the router and starts it.
   For now each page is a placeholder; later steps replace them.
   ========================================================= */

// Builds a simple "coming soon" page
function placeholderPage({ emoji, title, text, step, color }) {
  return (app) => {
    app.innerHTML = `
      <section class="container page-placeholder">
        <div class="card bg-${color}">
          <span class="placeholder-emoji">${emoji}</span>
          <span class="pill-label">Coming in step ${step}</span>
          <h1>${title}</h1>
          <p>${text}</p>
        </div>
      </section>`;
  };
}

Router.add(/^\/$/, HomePage);

Router.add(/^\/articles$/, Articles.listPage);

// One article, e.g. #/article/why-is-the-sky-blue → id = "why-is-the-sky-blue"
Router.add(/^\/article\/([\w-]+)$/, Articles.readerPage);

Router.add(/^\/play$/, PlayPage);
Router.add(/^\/play\/wordle$/, Wordle.page);
Router.add(/^\/play\/crossword\/([\w-]+)$/, Crossword.page);

Router.add(/^\/me$/, placeholderPage({
  emoji: "🤖", title: "My Space", step: 10, color: "pink",
  text: "Your avatar, coins, streak and quiz of the day.",
}));

// Footer year updates itself
document.getElementById("year").textContent = new Date().getFullYear();

UI.init();                  // coin counter, mute button, click sounds
Store.markActiveToday();    // counts towards the daily streak
Router.start();
