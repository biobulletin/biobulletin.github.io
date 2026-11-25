/* =========================================================
   Play hub: #/play — lists all the games
   ========================================================= */

function PlayPage(app) {
  const solved = Wordle.solvedToday();

  app.innerHTML = `
    <section class="container play-page">
      <div class="section-head">
        <span class="pill-label">Games</span>
        <h1>Let's play</h1>
        <p>Every puzzle you solve earns coins for your avatar.</p>
      </div>

      <div class="bento">
        <a href="#/play/wordle" class="bento-card bento-big bg-ink" data-sound="pop">
          <span class="chip ${solved ? "bg-mint" : "bg-lime"}">${solved ? "✓ Solved today" : "📅 Today's word is ready"}</span>
          <div class="mini-wordle" aria-hidden="true">
            <span class="t g">O</span><span class="t y">R</span><span class="t">B</span><span class="t g">I</span><span class="t">T</span>
          </div>
          <div>
            <h3>STEM Wordle</h3>
            <p>Guess the science word in six tries. +15 coins for the daily word.</p>
          </div>
          <span class="bento-go">${solved ? "Practice more →" : "Play →"}</span>
        </a>

        <div class="bento-card bg-lav is-soon">
          <span class="bento-emoji">✏️</span>
          <h3>Crossword</h3><p>Coming in the next step.</p>
        </div>

        <a href="#/me" class="bento-card bg-mint" data-sound="pop">
          <span class="bento-emoji">❓</span>
          <h3>Quiz of the day</h3><p>On your My Space page.</p>
        </a>
      </div>
    </section>`;
}
