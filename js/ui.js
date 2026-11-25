/* =========================================================
   UI helpers shared by every page:
   - toast pop-up messages
   - coin counter + mute button in the nav
   - click sounds on links and buttons
   - reward(): give coins with sound + message in one call
   ========================================================= */

const UI = (() => {
  // ---------- Toasts: small messages that slide in, then disappear ----------
  function toast(message, emoji = "✨") {
    const box = document.getElementById("toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="toast-emoji" aria-hidden="true">${emoji}</span><span class="toast-text"></span>`;
    el.querySelector(".toast-text").textContent = message;   // textContent = safe, no HTML injection
    box.appendChild(el);
    setTimeout(() => el.classList.add("leaving"), 2600);
    setTimeout(() => el.remove(), 3000);
  }

  // ---------- Coins in one line: add + sound + toast ----------
  function reward(amount, message) {
    Store.award(amount);
    Sound.play("coin");
    toast(`+${amount} coins · ${message}`, "🪙");
  }

  // ---------- Coin counter in the nav ----------
  let shownCoins = null;
  function renderCoins() {
    const el = document.getElementById("coinCount");
    const coins = Store.get().coins;
    el.textContent = coins;
    if (shownCoins !== null && coins !== shownCoins) {
      const pill = el.closest(".coin-pill");
      pill.classList.remove("bump");
      void pill.offsetWidth;          // restart the animation
      pill.classList.add("bump");
    }
    shownCoins = coins;
  }

  // ---------- Mute button ----------
  function renderMute() {
    const btn = document.getElementById("muteBtn");
    const muted = Store.get().muted;
    btn.textContent = muted ? "🔇" : "🔊";
    btn.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");
    btn.setAttribute("aria-pressed", String(muted));
  }

  function init() {
    renderCoins();
    renderMute();
    Store.onChange(() => { renderCoins(); renderMute(); });

    document.getElementById("muteBtn").addEventListener("click", () => {
      Store.update((s) => { s.muted = !s.muted; });
      Sound.play("pop");              // only heard when turning sound back ON
    });

    // Every link/button clicks softly. An element can choose its own
    // sound with data-sound="pop", or stay silent with data-sound="none".
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-sound], a, button");
      if (!el) return;
      const name = el.dataset.sound || "click";
      if (name !== "none") Sound.play(name);
    });
  }

  return { init, toast, reward };
})();
