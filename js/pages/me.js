/* =========================================================
   My Space: #/me
   Step 9: avatar + shop. (Stats, quiz and backup arrive in Step 10.)
   ========================================================= */

function MePage(app) {
  let tab = "color";

  app.innerHTML = `
    <section class="container me-page">
      <div class="section-head">
        <span class="pill-label">My Space</span>
        <h1>Your Bio bot</h1>
        <p>Earn coins by reading and playing, then spend them to make your bot uniquely yours.</p>
      </div>

      <div class="shop-layout">
        <div class="avatar-stage card">
          <button class="avatar-big" id="bigAvatar" data-sound="none" aria-label="Poke your bot"></button>
          <div class="coin-balance">🪙 <b id="shopCoins"></b> coins to spend</div>
        </div>

        <div class="shop card">
          <div class="shop-tabs" role="tablist">
            ${Object.entries(Avatar.CATALOG).map(([slot, s]) => `
              <button class="shop-tab${slot === tab ? " active" : ""}" data-tab="${slot}" role="tab" data-sound="pop">
                <span aria-hidden="true">${s.icon}</span> ${s.label}
              </button>`).join("")}
          </div>
          <div class="shop-grid" id="shopGrid"></div>
        </div>
      </div>
    </section>`;

  const big = app.querySelector("#bigAvatar");
  const grid = app.querySelector("#shopGrid");

  function drawAvatar() {
    big.innerHTML = Avatar.svg(Avatar.current());
    app.querySelector("#shopCoins").textContent = Store.get().coins;
  }

  // Wiggle the big avatar (restart the animation each time)
  function wiggle() {
    big.classList.remove("wiggle");
    void big.offsetWidth;
    big.classList.add("wiggle");
  }

  function drawGrid() {
    const look = Avatar.current();
    const coins = Store.get().coins;
    grid.innerHTML = Avatar.CATALOG[tab].items.map((item) => {
      const owned = Avatar.owns(tab, item.id);
      const wearing = look[tab] === item.id;
      const affordable = coins >= item.price;
      let badge;
      if (wearing) badge = `<span class="badge wearing">Wearing</span>`;
      else if (owned) badge = `<span class="badge owned">Owned</span>`;
      else badge = `<span class="badge price">🪙 ${item.price}</span>`;

      // Preview = your current look with just this one item swapped in
      return `
        <button class="shop-item${wearing ? " is-wearing" : ""}${!owned && !affordable ? " locked" : ""}"
                data-item="${item.id}" data-sound="none">
          ${Avatar.svg({ ...look, [tab]: item.id }, "avatar-mini")}
          <span class="item-name">${item.name}</span>
          ${badge}
        </button>`;
    }).join("");
  }

  // Switch tabs
  app.querySelectorAll(".shop-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      tab = btn.dataset.tab;
      app.querySelectorAll(".shop-tab").forEach((b) => b.classList.toggle("active", b === btn));
      drawGrid();
    });
  });

  // Buy or wear an item
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-item]");
    if (!btn) return;
    const item = Avatar.find(tab, btn.dataset.item);
    const result = Avatar.buyOrWear(tab, item.id);

    if (result === "bought") {
      Sound.play("coin");
      UI.toast(`Bought ${item.name}! −${item.price} coins`, "🛍️");
    } else if (result === "worn") {
      Sound.play("pop");
    } else {
      Sound.play("error");
      UI.toast(`You need ${item.price - Store.get().coins} more coins`, "🪙");
      return;
    }
    drawAvatar();
    drawGrid();
    wiggle();
  });

  // Poke the bot for fun
  big.addEventListener("click", () => {
    Sound.play("boing");
    wiggle();
  });

  drawAvatar();
  drawGrid();
}
