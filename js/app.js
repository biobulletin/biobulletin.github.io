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

Router.add(/^\/$/, placeholderPage({
  emoji: "🏠", title: "Home", step: 5, color: "lav",
  text: "The big hero, scrolling ribbons, how-it-works and the FAQ will live here.",
}));

Router.add(/^\/articles$/, placeholderPage({
  emoji: "📰", title: "Articles", step: 6, color: "mint",
  text: "All student articles, with category filters and search.",
}));

// One article, e.g. #/article/sky-blue → id = "sky-blue"
Router.add(/^\/article\/([\w-]+)$/, (app, id) => {
  placeholderPage({
    emoji: "📖", title: "Reading an article", step: 6, color: "sky",
    text: `This will show the article with the id “${id}”.`,
  })(app);
});

Router.add(/^\/play$/, placeholderPage({
  emoji: "🧩", title: "Play", step: 7, color: "lime",
  text: "STEM Wordle and crosswords.",
}));

Router.add(/^\/me$/, placeholderPage({
  emoji: "🤖", title: "My Space", step: 10, color: "pink",
  text: "Your avatar, coins, streak and quiz of the day.",
}));

// Footer year updates itself
document.getElementById("year").textContent = new Date().getFullYear();

Router.start();
