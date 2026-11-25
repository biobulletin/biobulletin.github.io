/* =========================================================
   Avatar — "Bio bot", the club's robot mascot.

   The avatar is drawn as SVG from layers, like paper cut-outs
   stacked on top of each other:
     background → arms/body → ears/head → chest extra → screen
     → eyes/mouth → glasses → hat/antenna
   Each slot (colour, eyes, hat, accessory, background) picks
   one option from the CATALOG below.
   ========================================================= */

const Avatar = (() => {
  const INK = "#1E1B4B";
  const GLOW = "#BDEFD6";   // colour of the eyes and mouth on the screen

  // ---------- Everything you can buy ----------
  // price 0 = free and owned from the start
  const CATALOG = {
    color: {
      label: "Colour", icon: "🎨",
      items: [
        { id: "lav",   name: "Lavender",  price: 0,  value: "#C8B6FF" },
        { id: "mint",  name: "Mint",      price: 20, value: "#9EE6C0" },
        { id: "peach", name: "Peach",     price: 20, value: "#FFB98A" },
        { id: "sky",   name: "Sky",       price: 30, value: "#9CC2FF" },
        { id: "pink",  name: "Bubblegum", price: 30, value: "#FF9ECF" },
        { id: "lime",  name: "Lime",      price: 40, value: "#DDF45B" },
      ],
    },
    eyes: {
      label: "Eyes", icon: "👀",
      items: [
        { id: "round",  name: "Round",  price: 0 },
        { id: "happy",  name: "Happy",  price: 15 },
        { id: "sleepy", name: "Sleepy", price: 15 },
        { id: "wink",   name: "Wink",   price: 25 },
        { id: "big",    name: "Curious", price: 30 },
        { id: "star",   name: "Starry", price: 40 },
      ],
    },
    hat: {
      label: "Hats", icon: "🎩",
      items: [
        { id: "none",       name: "Antenna",    price: 0 },
        { id: "cap",        name: "Cap",        price: 40 },
        { id: "beanie",     name: "Beanie",     price: 50 },
        { id: "headphones", name: "Headphones", price: 60 },
        { id: "grad",       name: "Graduate",   price: 80 },
        { id: "crown",      name: "Crown",      price: 120 },
      ],
    },
    acc: {
      label: "Extras", icon: "🎀",
      items: [
        { id: "none",    name: "Nothing", price: 0 },
        { id: "bowtie",  name: "Bow tie", price: 30 },
        { id: "glasses", name: "Glasses", price: 40 },
        { id: "scarf",   name: "Scarf",   price: 40 },
        { id: "medal",   name: "Medal",   price: 70 },
      ],
    },
    bg: {
      label: "Background", icon: "🖼️",
      items: [
        { id: "mint",  name: "Mint",     price: 0,  value: "#BDEFD6" },
        { id: "cream", name: "Cream",    price: 10, value: "#FBF8F1" },
        { id: "lav",   name: "Lavender", price: 10, value: "#E4DAFF" },
        { id: "peach", name: "Peach",    price: 10, value: "#FFD8B5" },
        { id: "sky",   name: "Sky",      price: 10, value: "#BFD8FF" },
        { id: "pink",  name: "Pink",     price: 10, value: "#FFC2E2" },
        { id: "lime",  name: "Lime",     price: 10, value: "#EEF9A8" },
      ],
    },
  };

  const find = (slot, id) => CATALOG[slot].items.find((i) => i.id === id) || CATALOG[slot].items[0];

  // ---------- Drawing ----------
  function star(cx, cy, r) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r * 0.45 : r;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="${GLOW}"/>`;
  }

  function eyesSVG(type) {
    const L = 82, R = 118, Y = 96;
    const round = (x) => `<circle cx="${x}" cy="${Y}" r="8" fill="${GLOW}"/><circle cx="${x + 3}" cy="${Y - 3}" r="2.5" fill="#fff"/>`;
    const arc = (x, up) => `<path d="M${x - 8} ${Y + (up ? 3 : -1)} Q${x} ${Y + (up ? -8 : 7)} ${x + 8} ${Y + (up ? 3 : -1)}" stroke="${GLOW}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    switch (type) {
      case "happy":  return arc(L, true) + arc(R, true);
      case "sleepy": return arc(L, false) + arc(R, false);
      case "wink":   return round(L) + `<path d="M${R - 8} ${Y} L${R + 8} ${Y}" stroke="${GLOW}" stroke-width="5" stroke-linecap="round"/>`;
      case "star":   return star(L, Y, 11) + star(R, Y, 11);
      case "big":    return [L, R].map((x) => `<circle cx="${x}" cy="${Y}" r="11" fill="#fff"/><circle cx="${x + 2}" cy="${Y + 1}" r="6" fill="${INK}"/><circle cx="${x + 4}" cy="${Y - 2}" r="2" fill="#fff"/>`).join("");
      default:       return round(L) + round(R);
    }
  }

  function accSVG(type, part) {
    // "body" extras sit on the chest; "face" extras sit on the screen
    if (part === "body") {
      if (type === "bowtie") return `
        <polygon points="100,141 80,130 80,152" fill="#FF6B9A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="100,141 120,130 120,152" fill="#FF6B9A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="100" cy="141" r="5" fill="${INK}"/>`;
      if (type === "scarf") return `
        <rect x="56" y="134" width="88" height="16" rx="8" fill="#FF8A5B" stroke="${INK}" stroke-width="3"/>
        <rect x="112" y="142" width="16" height="34" rx="6" fill="#FF8A5B" stroke="${INK}" stroke-width="3"/>`;
      if (type === "medal") return `
        <path d="M86 140 L100 162 L114 140" stroke="#7C5CF0" stroke-width="6" fill="none"/>
        <circle cx="100" cy="166" r="12" fill="#FFD54A" stroke="${INK}" stroke-width="3"/>
        <text x="100" y="171" text-anchor="middle" font-size="13" font-weight="800" fill="${INK}">1</text>`;
      return "";
    }
    if (type === "glasses") return `
      <circle cx="82" cy="96" r="15" fill="rgba(255,255,255,0.12)" stroke="#DDF45B" stroke-width="4"/>
      <circle cx="118" cy="96" r="15" fill="rgba(255,255,255,0.12)" stroke="#DDF45B" stroke-width="4"/>
      <path d="M97 96 L103 96" stroke="#DDF45B" stroke-width="4"/>`;
    return "";
  }

  function hatSVG(type, bodyColor) {
    const antennaBall = bodyColor === "#DDF45B" ? "#FF9ECF" : "#DDF45B";
    const antenna = `
      <line x1="100" y1="58" x2="100" y2="36" stroke="${INK}" stroke-width="4"/>
      <circle cx="100" cy="30" r="9" fill="${antennaBall}" stroke="${INK}" stroke-width="3"/>`;
    switch (type) {
      case "cap": return `
        <path d="M46 70 Q46 26 100 26 Q154 26 154 70 Z" fill="#FF6B9A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M138 64 Q176 62 184 74 Q162 80 138 72 Z" fill="#FF6B9A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="100" cy="27" r="5" fill="${INK}"/>`;
      case "beanie": return `
        <path d="M48 66 Q48 24 100 24 Q152 24 152 66 Z" fill="#7C5CF0" stroke="${INK}" stroke-width="4"/>
        <rect x="44" y="56" width="112" height="16" rx="8" fill="#DDF45B" stroke="${INK}" stroke-width="4"/>
        <circle cx="100" cy="22" r="11" fill="#FFC2E2" stroke="${INK}" stroke-width="4"/>`;
      case "crown": return `
        <polygon points="58,64 62,24 82,44 100,14 118,44 138,24 142,64" fill="#FFD54A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="100" cy="50" r="6" fill="#FF6B9A" stroke="${INK}" stroke-width="2"/>
        <circle cx="76" cy="54" r="4" fill="#7C5CF0"/><circle cx="124" cy="54" r="4" fill="#7C5CF0"/>`;
      case "grad": return `
        <path d="M66 44 L66 64 Q100 74 134 64 L134 44 Z" fill="${INK}"/>
        <polygon points="100,14 168,38 100,60 32,38" fill="${INK}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M100 38 L152 46 L154 72" stroke="#DDF45B" stroke-width="3" fill="none"/>
        <circle cx="154" cy="75" r="5" fill="#DDF45B"/>`;
      case "headphones": return antenna + `
        <path d="M40 100 Q40 36 100 36 Q160 36 160 100" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
        <rect x="26" y="82" width="22" height="40" rx="10" fill="#FF6B9A" stroke="${INK}" stroke-width="4"/>
        <rect x="152" y="82" width="22" height="40" rx="10" fill="#FF6B9A" stroke="${INK}" stroke-width="4"/>`;
      default: return antenna;
    }
  }

  // Build the full avatar. `look` = { color, eyes, hat, acc, bg }
  function svg(look, className = "avatar-svg") {
    const body = find("color", look.color).value;
    const bg = find("bg", look.bg).value;
    return `
      <svg viewBox="0 0 200 200" class="${className}" role="img" aria-label="Bio bot avatar">
        <circle cx="100" cy="100" r="100" fill="${bg}"/>
        <!-- arms + body -->
        <rect x="44" y="146" width="20" height="36" rx="10" fill="${body}" stroke="${INK}" stroke-width="4"/>
        <rect x="136" y="146" width="20" height="36" rx="10" fill="${body}" stroke="${INK}" stroke-width="4"/>
        <rect x="60" y="134" width="80" height="66" rx="26" fill="${body}" stroke="${INK}" stroke-width="4"/>
        <circle cx="100" cy="176" r="6" fill="${INK}" opacity="0.25"/>
        <!-- ears + head -->
        <circle cx="42" cy="100" r="11" fill="${body}" stroke="${INK}" stroke-width="4"/>
        <circle cx="158" cy="100" r="11" fill="${body}" stroke="${INK}" stroke-width="4"/>
        <rect x="42" y="56" width="116" height="88" rx="40" fill="${body}" stroke="${INK}" stroke-width="4"/>
        <!-- chest extras go AFTER the head so the chin doesn't cover them -->
        ${accSVG(look.acc, "body")}
        <!-- face screen -->
        <rect x="58" y="72" width="84" height="56" rx="24" fill="${INK}"/>
        <ellipse cx="70" cy="114" rx="6" ry="3.5" fill="#FF9ECF" opacity="0.8"/>
        <ellipse cx="130" cy="114" rx="6" ry="3.5" fill="#FF9ECF" opacity="0.8"/>
        ${eyesSVG(look.eyes)}
        <path d="M92 113 Q100 120 108 113" stroke="${GLOW}" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${accSVG(look.acc, "face")}
        ${hatSVG(look.hat, body)}
      </svg>`;
  }

  // ---------- Owning & wearing ----------
  const itemKey = (slot, id) => `${slot}:${id}`;

  function owns(slot, id) {
    return find(slot, id).price === 0 || Store.get().owned.includes(itemKey(slot, id));
  }

  function wear(slot, id) {
    Store.update((s) => { s.avatar[slot] = id; });
  }

  // Returns "worn" | "bought" | "poor"
  function buyOrWear(slot, id) {
    if (owns(slot, id)) { wear(slot, id); return "worn"; }
    const item = find(slot, id);
    if (!Store.spend(item.price)) return "poor";
    Store.update((s) => { s.owned.push(itemKey(slot, id)); s.avatar[slot] = id; });
    return "bought";
  }

  const current = () => Store.get().avatar;

  return { CATALOG, svg, owns, buyOrWear, current, find };
})();
