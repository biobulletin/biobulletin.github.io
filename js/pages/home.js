/* =========================================================
   Home page
   Sections: hero → ribbons → the plan → pick your puzzle
             → about the club → FAQ
   ========================================================= */

const HomePage = (() => {
  // Clickable science stickers floating around the hero arch.
  // Each plays a different note of the scale, so clicking them
  // one after another plays a little tune.
  const STICKERS = [
    { emoji: "🚀", label: "Rocket" },
    { emoji: "🧪", label: "Test tube" },
    { emoji: "🧬", label: "DNA" },
    { emoji: "🧲", label: "Magnet" },
    { emoji: "💡", label: "Light bulb" },
    { emoji: "🔭", label: "Telescope" },
  ];

  const RIBBON_A = ["Written by students", "Read", "Play", "Level up", "Ask big questions"];
  const RIBBON_B = ["Physics", "Biology", "Chemistry", "Maths", "Technology", "Engineering"];

  const FAQ = [
    {
      q: "Who writes the articles?",
      a: "Club members! Every article is researched and written by students, then checked by the club editors before it goes up.",
    },
    {
      q: "Do I need an account?",
      a: "No. Your coins, avatar and progress are saved in this browser automatically. To move to another device, use the backup code on My Space.",
    },
    {
      q: "How do I earn coins?",
      a: "Finish reading an article, solve the Wordle or a crossword, or answer the quiz of the day. Spend coins on hats, colours and accessories for your avatar.",
    },
    {
      q: "Can I write for the club?",
      a: "Yes! Talk to any club member or the editors. You don't need to be an expert — curiosity is the only requirement.",
    },
  ];

  // Big animated atom inside the hero arch.
  // Each electron travels along an ellipse using <animateMotion>.
  const ORBIT_PATH = "M20,100 a80,30 0 1,0 160,0 a80,30 0 1,0 -160,0";
  function atomSVG() {
    const orbit = (angle, dur, color) => `
      <g transform="rotate(${angle} 100 100)">
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="#1E1B4B" stroke-width="4"/>
        <circle r="8" fill="${color}" stroke="#1E1B4B" stroke-width="3">
          <animateMotion dur="${dur}" repeatCount="indefinite" path="${ORBIT_PATH}"/>
        </circle>
      </g>`;
    return `
      <svg viewBox="0 0 200 200" class="big-atom" aria-hidden="true">
        ${orbit(0, "3s", "#FFC2E2")}
        ${orbit(60, "4s", "#BDEFD6")}
        ${orbit(-60, "5s", "#BFD8FF")}
        <circle cx="100" cy="100" r="20" fill="#DDF45B" stroke="#1E1B4B" stroke-width="4"/>
      </svg>`;
  }

  // Rotating round sticker with text around the edge
  function badgeSVG() {
    return `
      <svg viewBox="0 0 100 100" class="spin-badge" aria-hidden="true">
        <defs><path id="badgeCircle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"/></defs>
        <circle cx="50" cy="50" r="48" fill="#DDF45B" stroke="#1E1B4B" stroke-width="2"/>
        <text font-size="10.5" font-weight="800" letter-spacing="2.2" fill="#1E1B4B">
          <textPath href="#badgeCircle">100% STUDENT WRITTEN • STEM •</textPath>
        </text>
        <text x="50" y="58" text-anchor="middle" font-size="22">⚛️</text>
      </svg>`;
  }

  // Ribbon items, written twice so the scroll loops seamlessly
  function ribbon(items) {
    const one = items.map((t) => `<span>${t}</span><span class="star">✦</span>`).join("");
    return `<div class="ribbon-track">${one}${one}</div>`;
  }

  function render(app) {
    app.innerHTML = `
      <!-- ========== HERO ========== -->
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-text">
            <span class="pill-label">⚛️ A student-written STEM magazine</span>
            <h1>Small Questions,<br><span class="accent">Big Ideas.</span></h1>
            <p>Articles written by students who got curious and kept asking why.
               Read something new, solve a STEM puzzle, and level up your avatar along the way.</p>
            <div class="hero-buttons">
              <a class="btn btn-dark" href="#/articles" data-sound="pop">Start reading <span class="btn-arrow">→</span></a>
              <a class="btn btn-outline" href="#/play" data-sound="pop">Play a puzzle</a>
            </div>
          </div>

          <div class="hero-art">
            <button class="hero-arch" id="heroAtom" data-sound="none" aria-label="Spin the atom">
              ${atomSVG()}
            </button>
            ${badgeSVG()}
            ${STICKERS.map((s, i) => `
              <button class="sticker s${i}" data-note="${i}" data-sound="none" aria-label="${s.label}">${s.emoji}</button>
            `).join("")}
          </div>
        </div>
      </section>
      <div class="scallop" aria-hidden="true"></div>

      <!-- ========== RIBBONS ========== -->
      <div class="ribbons" aria-hidden="true">
        <div class="ribbon ribbon-lime">${ribbon(RIBBON_A)}</div>
        <div class="ribbon ribbon-ink">${ribbon(RIBBON_B)}</div>
      </div>

      <!-- ========== FRESH FROM THE CLUB (latest 3 articles) ========== -->
      <section class="container fresh">
        <div class="section-head">
          <span class="pill-label">Latest articles</span>
          <h2>Fresh from the club</h2>
          <p>New reads written by club members.</p>
        </div>
        <div class="article-grid">
          ${Articles.newestFirst().slice(0, 3).map(Articles.card).join("")}
        </div>
        <div class="fresh-foot">
          <a class="btn btn-dark" href="#/articles" data-sound="pop">See all articles <span class="btn-arrow">→</span></a>
        </div>
      </section>

      <!-- ========== THE PLAN ========== -->
      <section class="plan">
        <div class="container">
          <div class="plan-head">
            <div>
              <span class="pill-label">The plan</span>
              <h2>Read. Play. Level up.<br>That's the whole plan.</h2>
            </div>
            <p>Every article you finish and every puzzle you solve earns coins.
               Spend them to make your avatar uniquely yours.</p>
          </div>
          <div class="plan-cards">
            <a href="#/articles" class="plan-card bg-lime" data-sound="pop">
              <span class="plan-num">01</span><b>Read</b><small>Articles written by club members</small>
            </a>
            <a href="#/play" class="plan-card bg-lav" data-sound="pop">
              <span class="plan-num">02</span><b>Play</b><small>STEM Wordle and crosswords</small>
            </a>
            <a href="#/me" class="plan-card bg-mint" data-sound="pop">
              <span class="plan-num">03</span><b>Earn</b><small>Coins for everything you finish</small>
            </a>
            <a href="#/me" class="plan-card plan-card-dashed" data-sound="pop">
              <span class="plan-num">04</span><b>Style</b><small>Dress up your Atom bot</small>
            </a>
          </div>
        </div>
      </section>

      <!-- ========== PICK YOUR PUZZLE ========== -->
      <section class="container puzzles">
        <div class="section-head">
          <span class="pill-label">Games</span>
          <h2>Pick your puzzle</h2>
          <p>Quick STEM games. Short enough for a break, tricky enough to make you think.</p>
        </div>
        <div class="bento">
          <a href="#/play/wordle" class="bento-card bento-big bg-ink" data-sound="pop">
            <span class="chip bg-lime">New every day</span>
            <div class="mini-wordle" aria-hidden="true">
              <span class="t g">O</span><span class="t y">R</span><span class="t">B</span><span class="t g">I</span><span class="t">T</span>
            </div>
            <div>
              <h3>STEM Wordle</h3>
              <p>Guess the science word in six tries.</p>
            </div>
            <span class="bento-go">Play →</span>
          </a>
          <a href="#/play" class="bento-card bg-lav" data-sound="pop">
            <span class="bento-emoji">✏️</span>
            <h3>Crossword</h3><p>Clues from this month's articles.</p>
          </a>
          <a href="#/me" class="bento-card bg-mint" data-sound="pop">
            <span class="bento-emoji">❓</span>
            <h3>Quiz of the day</h3><p>One question. Five coins.</p>
          </a>
          <a href="#/me" class="bento-card bg-lime" data-sound="pop">
            <span class="bento-emoji">🎩</span>
            <h3>Avatar shop</h3><p>Hats, colours and more.</p>
          </a>
          <a href="#/articles" class="bento-card bg-pink" data-sound="pop">
            <span class="bento-emoji">📰</span>
            <h3>Latest articles</h3><p>Fresh from club members.</p>
          </a>
        </div>
      </section>

      <!-- ========== ABOUT THE CLUB ========== -->
      <section class="container about">
        <div class="about-note card">
          <span class="pill-label">About the club</span>
          <h2>Curious minds,<br><span class="accent">one article at a time.</span></h2>
          <p>We're a group of high school students who love asking questions about how the world works.
             Every week we research something that made us wonder, write it up in plain words,
             and share it here, along with puzzles to test what you learned.</p>
          <p class="signature">— The editors</p>
        </div>
        <div class="about-cta card bg-pink">
          <span class="bento-emoji">✍️</span>
          <h3>Want to write for us?</h3>
          <p>No experience needed. Bring a question you can't stop thinking about.</p>
          <a class="btn btn-dark" href="#/articles" data-sound="pop">See what we write <span class="btn-arrow">→</span></a>
        </div>
      </section>

      <!-- ========== FAQ ========== -->
      <section class="container faq">
        <div class="section-head">
          <span class="pill-label">FAQ</span>
          <h2>Questions? Answered.</h2>
        </div>
        <div class="faq-list">
          ${FAQ.map((f) => `
            <details class="faq-item">
              <summary data-sound="pop">${f.q}<span class="faq-icon" aria-hidden="true">+</span></summary>
              <p>${f.a}</p>
            </details>`).join("")}
        </div>
      </section>
    `;

    attachEvents(app);
  }

  // Little burst of coloured dots from a point (the sticker that was clicked)
  function sparkle(target) {
    const colors = ["#DDF45B", "#FFC2E2", "#BDEFD6", "#BFD8FF", "#7C5CF0"];
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement("span");
      dot.className = "spark";
      const angle = (Math.PI * 2 * i) / 8;
      dot.style.setProperty("--dx", `${Math.cos(angle) * 46}px`);
      dot.style.setProperty("--dy", `${Math.sin(angle) * 46}px`);
      dot.style.background = colors[i % colors.length];
      target.appendChild(dot);
      setTimeout(() => dot.remove(), 600);
    }
  }

  // Restart a CSS animation class even if it's mid-animation
  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function attachEvents(app) {
    app.querySelectorAll(".sticker").forEach((btn) => {
      btn.addEventListener("click", () => {
        Sound.play("note", Number(btn.dataset.note));
        replay(btn, "boing");
        sparkle(btn);
      });
    });

    const atom = app.querySelector("#heroAtom");
    atom.addEventListener("click", () => {
      Sound.play("boing");
      replay(atom, "spin");
    });
  }

  return render;
})();
