/* =========================================================
   App — registers every page with the router and starts it.
   ========================================================= */

// Each line: "when the address looks like THIS, draw THAT page"
Router.add(/^\/$/, HomePage);

Router.add(/^\/articles$/, Articles.listPage);

// One article, e.g. #/article/why-is-the-sky-blue → id = "why-is-the-sky-blue"
Router.add(/^\/article\/([\w-]+)$/, Articles.readerPage);

Router.add(/^\/play$/, PlayPage);
Router.add(/^\/play\/wordle$/, Wordle.page);
Router.add(/^\/play\/crossword\/([\w-]+)$/, Crossword.page);

Router.add(/^\/me$/, MePage);

// Footer year updates itself
document.getElementById("year").textContent = new Date().getFullYear();

UI.init();                  // coin counter, mute button, click sounds
Store.markActiveToday();    // counts towards the daily streak
Router.start();
