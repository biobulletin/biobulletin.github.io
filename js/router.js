/* =========================================================
   Router — shows the right page for the address in the URL.

   We use "hash" addresses like  #/articles  or  #/article/sky-blue.
   Everything after the # never gets sent to the server, so
   GitHub Pages always serves the same index.html and JavaScript
   decides which page to draw. No "404 page not found" problems.
   ========================================================= */

const Router = (() => {
  const routes = [];     // list of { pattern, view }
  let cleanup = null;    // tidy-up function from the page we're leaving

  // Register a page: a regular expression + a function that draws it.
  // The view gets the <main> element and any captured parts of the URL.
  // It may return a function, which we call when the user leaves that page
  // (e.g. to stop listening for keyboard presses in a game).
  function add(pattern, view) {
    routes.push({ pattern, view });
  }

  // Turn "#/article/sky-blue" into "/article/sky-blue"
  function currentPath() {
    return location.hash.slice(1) || "/";
  }

  // Highlight the nav link for the current section
  function highlightNav(path) {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const base = link.dataset.nav;
      const isActive = base === "/" ? path === "/" : path.startsWith(base);
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  // Find the matching page and draw it
  function resolve() {
    const path = currentPath();
    const app = document.getElementById("app");

    if (typeof cleanup === "function") cleanup();
    cleanup = null;

    for (const route of routes) {
      const match = path.match(route.pattern);
      if (match) {
        const result = route.view(app, ...match.slice(1));
        cleanup = typeof result === "function" ? result : null;
        highlightNav(path);
        window.scrollTo(0, 0);
        app.focus({ preventScroll: true }); // screen readers start at the new page
        return;
      }
    }

    // No page matched → go home
    location.hash = "#/";
  }

  function start() {
    window.addEventListener("hashchange", resolve);
    resolve();
  }

  return { add, start };
})();
