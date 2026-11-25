/* =========================================================
   App — the entry point. Imports every page, registers it with
   the router, and starts the site.

   Because index.html loads this with type="module", nothing here
   is a global: typing Store or UI in the browser console gives
   "not defined". That stops the one-line coin cheat.
   ========================================================= */

import { Router } from "./router.js";
import { Store } from "./store.js";
import { UI } from "./ui.js";
import { HomePage } from "./pages/home.js";
import { Articles } from "./pages/articles.js";
import { PlayPage } from "./pages/play.js";
import { Wordle } from "./pages/wordle.js";
import { Crossword } from "./pages/crossword.js";
import { MePage } from "./pages/me.js";

// Each line: "when the address looks like THIS, draw THAT page"
Router.add(/^\/$/, HomePage);

Router.add(/^\/articles$/, Articles.listPage, "Articles");

// One article, e.g. #/article/why-is-the-sky-blue → id = "why-is-the-sky-blue"
Router.add(/^\/article\/([\w-]+)$/, Articles.readerPage);

Router.add(/^\/play$/, PlayPage, "Play");
Router.add(/^\/play\/wordle$/, Wordle.page, "STEM Wordle");
Router.add(/^\/play\/crossword\/practice\/([\w-]+)$/, Crossword.practicePage, "Practice crossword");
Router.add(/^\/play\/crossword\/([\w-]+)$/, Crossword.page, "Crossword");

Router.add(/^\/me$/, MePage, "My Space");

// Footer year updates itself
document.getElementById("year").textContent = new Date().getFullYear();

UI.init();                  // coin counter, mute button, click sounds
Store.markActiveToday();    // counts towards the daily streak
Router.start();

// Testing helper: ONLY on your own computer (Live Server), never on the
// live site. Lets you type  dev.Store.award(100)  in the console.
if (["localhost", "127.0.0.1"].includes(location.hostname)) {
  window.dev = { Store, UI };
  console.info("🧪 Dev mode: try dev.Store.award(100) or dev.Store.reset()");
}
