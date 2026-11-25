/* =========================================================
   Avatar — the BioBulletin capybara (from the club logo).

   Drawn as SVG from layers, like paper cut-outs stacked
   on top of each other:
     background → body + paws → ears → head → cheeks
     → snout → eyes → chest extra → glasses → hat
   Each slot (fur, eyes, hat, extra, background) picks one
   option from the CATALOG below.
   ========================================================= */

import { Store } from "./store.js";

export const Avatar = (() => {
  const LINE = "#4A210E";      // dark brown outline, from the logo
  const EYE = "#2B1208";

  // ---------- Everything you can buy ----------
  // price 0 = free and owned from the start
  // Fur items have two colours: fur + a darker snout
  const CATALOG = {
    color: {
      label: "Fur", icon: "🎨",
      items: [
        { id: "caramel",  name: "Caramel",  price: 0,  value: "#D48753", snout: "#9C6146" },
        { id: "golden",   name: "Golden",   price: 20, value: "#E5A962", snout: "#B07A45" },
        { id: "chestnut", name: "Chestnut", price: 20, value: "#A8643C", snout: "#77432A" },
        { id: "cocoa",    name: "Cocoa",    price: 30, value: "#7E4E36", snout: "#573323" },
        { id: "cream",    name: "Cream",    price: 30, value: "#EBCFA5", snout: "#C19C70" },
        { id: "sage",     name: "Mossy",    price: 50, value: "#9DBB97", snout: "#6E8F6A" },
      ],
    },
    eyes: {
      label: "Eyes", icon: "👀",
      items: [
        { id: "dot",     name: "Calm",    price: 0 },
        { id: "sleepy",  name: "Sleepy",  price: 15 },
        { id: "happy",   name: "Happy",   price: 15 },
        { id: "wink",    name: "Wink",    price: 25 },
        { id: "big",     name: "Curious", price: 30 },
        { id: "star",    name: "Starry",  price: 40 },
      ],
    },
    hat: {
      label: "Hats", icon: "🎩",
      items: [
        { id: "none",   name: "Nothing",  price: 0 },
        { id: "leaf",   name: "Leaf",     price: 30 },
        { id: "orange", name: "Orange",   price: 40 },
        { id: "cap",    name: "Cap",      price: 40 },
        { id: "beanie", name: "Beanie",   price: 50 },
        { id: "grad",   name: "Graduate", price: 80 },
        { id: "crown",  name: "Crown",    price: 120 },
      ],
    },
    acc: {
      label: "Extras", icon: "🎀",
      items: [
        { id: "none",    name: "Nothing",     price: 0 },
        { id: "glasses", name: "Glasses",     price: 30 },
        { id: "bowtie",  name: "Bow tie",     price: 30 },
        { id: "scarf",   name: "Plaid scarf", price: 40 },
        { id: "medal",   name: "Medal",       price: 70 },
      ],
    },
    bg: {
      label: "Background", icon: "🖼️",
      items: [
        { id: "vanilla", name: "Vanilla", price: 0,  value: "#FAE9AC" },
        { id: "sage",    name: "Sage",    price: 10, value: "#DCEADA" },
        { id: "teal",    name: "Blue",    price: 10, value: "#D3E8EF" },
        { id: "rose",    name: "Rose",    price: 10, value: "#EEDDDB" },
        { id: "blush",   name: "Blush",   price: 10, value: "#F9D7D3" },
        { id: "sand",    name: "Sand",    price: 10, value: "#F2E4CF" },
        { id: "cream",   name: "Cream",   price: 10, value: "#FFF8EA" },
      ],
    },
  };

  // Unknown ids (e.g. from an old save) fall back to the free first item
  const find = (slot, id) => CATALOG[slot].items.find((i) => i.id === id) || CATALOG[slot].items[0];

  // ---------- Drawing helpers ----------
  const L = 78, R = 122, EY = 94;      // eye positions

  function star(cx, cy, r, fill) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r * 0.45 : r;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
  }

  function eyesSVG(type) {
    const dot = (x) => `<ellipse cx="${x}" cy="${EY}" rx="4.5" ry="5.5" fill="${EYE}"/><circle cx="${x + 1.5}" cy="${EY - 2}" r="1.5" fill="#fff"/>`;
    // up = happy "^" arcs, down = sleepy closed lids
    const arc = (x, up) => `<path d="M${x - 7} ${EY + (up ? 2 : -2)} Q${x} ${EY + (up ? -7 : 5)} ${x + 7} ${EY + (up ? 2 : -2)}" stroke="${EYE}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    switch (type) {
      case "sleepy": return arc(L, false) + arc(R, false);
      case "happy":  return arc(L, true) + arc(R, true);
      case "wink":   return dot(L) + `<path d="M${R - 7} ${EY} L${R + 7} ${EY}" stroke="${EYE}" stroke-width="3.5" stroke-linecap="round"/>`;
      case "big":    return [L, R].map((x) => `<circle cx="${x}" cy="${EY}" r="9" fill="#fff" stroke="${LINE}" stroke-width="2"/><circle cx="${x + 1}" cy="${EY + 1}" r="5.5" fill="${EYE}"/><circle cx="${x + 3}" cy="${EY - 2}" r="1.8" fill="#fff"/>`).join("");
      case "star":   return star(L, EY, 9, "#E5A92F") + star(R, EY, 9, "#E5A92F");
      default:       return dot(L) + dot(R);
    }
  }

  // Chest extras sit on the neck/body; glasses sit on the face
  function chestSVG(type) {
    if (type === "scarf") return `
      <g stroke="${LINE}" stroke-width="3">
        <rect x="54" y="144" width="92" height="20" rx="10" fill="#7A232C"/>
        <rect x="114" y="152" width="18" height="34" rx="7" fill="#7A232C"/>
      </g>
      <g stroke="#5F6A35" stroke-width="3" opacity="0.9">
        <path d="M70 146 V162 M88 146 V162 M106 146 V162 M124 146 V162 M140 148 V160"/>
        <path d="M117 166 H129 M117 176 H129"/>
      </g>
      <path d="M56 154 H144" stroke="#C4884E" stroke-width="1.5" opacity="0.8"/>`;
    if (type === "bowtie") return `
      <polygon points="100,152 80,141 80,163" fill="#CE2424" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="100,152 120,141 120,163" fill="#CE2424" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="100" cy="152" r="5" fill="${LINE}"/>`;
    if (type === "medal") return `
      <path d="M86 146 L100 168 L114 146" stroke="#4D96AC" stroke-width="6" fill="none"/>
      <circle cx="100" cy="172" r="12" fill="#F2C14E" stroke="${LINE}" stroke-width="3"/>
      <text x="100" y="177" text-anchor="middle" font-size="13" font-weight="800" fill="${LINE}">1</text>`;
    return "";
  }

  // Round wire glasses, like the ones in the logo
  function glassesSVG(type) {
    if (type !== "glasses") return "";
    return `
      <g fill="rgba(255,255,255,0.18)" stroke="#1A1A1A" stroke-width="2.8">
        <circle cx="${L}" cy="${EY}" r="12"/>
        <circle cx="${R}" cy="${EY}" r="12"/>
      </g>
      <path d="M90 92 Q100 86 110 92" stroke="#1A1A1A" stroke-width="2.8" fill="none"/>`;
  }

  function hatSVG(type) {
    switch (type) {
      // The logo's leaf, lying on the head
      case "leaf": return `
        <path d="M60 64 Q86 30 140 46 Q118 74 60 64 Z" fill="#4D5519" stroke="#2F350C" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M66 62 Q100 52 134 48" stroke="#C49A52" stroke-width="2" fill="none"/>
        <path d="M84 59 L92 48 M102 55 L110 44 M118 52 L124 44" stroke="#C49A52" stroke-width="1.6" fill="none"/>`;
      // Capybaras in Japanese hot springs famously wear oranges on their heads
      case "orange": return `
        <circle cx="100" cy="42" r="18" fill="#F39A2B" stroke="${LINE}" stroke-width="3"/>
        <circle cx="94" cy="38" r="1.5" fill="#D9771A"/><circle cx="106" cy="46" r="1.5" fill="#D9771A"/><circle cx="104" cy="34" r="1.5" fill="#D9771A"/>
        <path d="M100 24 Q112 14 120 22 Q110 28 100 24 Z" fill="#5E8A3A" stroke="${LINE}" stroke-width="2"/>`;
      case "cap": return `
        <path d="M50 74 Q50 32 100 32 Q150 32 150 74 Z" fill="#CE2424" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M136 68 Q176 66 184 78 Q162 84 136 76 Z" fill="#CE2424" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="100" cy="33" r="5" fill="${LINE}"/>`;
      case "beanie": return `
        <path d="M52 70 Q52 28 100 28 Q148 28 148 70 Z" fill="#79A178" stroke="${LINE}" stroke-width="4"/>
        <rect x="48" y="60" width="104" height="16" rx="8" fill="#FAE9AC" stroke="${LINE}" stroke-width="4"/>
        <circle cx="100" cy="26" r="11" fill="#CE2424" stroke="${LINE}" stroke-width="4"/>`;
      case "grad": return `
        <path d="M68 48 L68 66 Q100 76 132 66 L132 48 Z" fill="#2B1208"/>
        <polygon points="100,18 166,40 100,62 34,40" fill="#2B1208" stroke="#2B1208" stroke-width="2" stroke-linejoin="round"/>
        <path d="M100 40 L150 48 L152 74" stroke="#F2C14E" stroke-width="3" fill="none"/>
        <circle cx="152" cy="77" r="5" fill="#F2C14E"/>`;
      case "crown": return `
        <polygon points="62,66 66,28 84,48 100,18 116,48 134,28 138,66" fill="#F2C14E" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="100" cy="52" r="6" fill="#CE2424" stroke="${LINE}" stroke-width="2"/>
        <circle cx="78" cy="56" r="4" fill="#4D96AC"/><circle cx="122" cy="56" r="4" fill="#4D96AC"/>`;
      default: return "";
    }
  }

  // Each drawing needs its own clip id: the shop shows many avatars on one
  // page, and ids must be unique within a page.
  let clipCount = 0;

  // Build the full avatar. `look` = { color, eyes, hat, acc, bg }
  function svg(look, className = "avatar-svg") {
    const fur = find("color", look.color);
    const bg = find("bg", look.bg).value;
    const clip = `capyClip${++clipCount}`;
    return `
      <svg viewBox="0 0 200 200" class="${className}" role="img" aria-label="Capybara avatar">
        <!-- everything is trimmed to the round badge -->
        <clipPath id="${clip}"><circle cx="100" cy="100" r="100"/></clipPath>
        <g clip-path="url(#${clip})">
        <circle cx="100" cy="100" r="100" fill="${bg}"/>
        <!-- body + front paws -->
        <ellipse cx="100" cy="186" rx="60" ry="46" fill="${fur.value}" stroke="${LINE}" stroke-width="4"/>
        <ellipse cx="80" cy="192" rx="11" ry="8" fill="${fur.snout}" stroke="${LINE}" stroke-width="3"/>
        <ellipse cx="120" cy="192" rx="11" ry="8" fill="${fur.snout}" stroke="${LINE}" stroke-width="3"/>
        <!-- ears -->
        <ellipse cx="62" cy="62" rx="12" ry="11" fill="${fur.snout}" stroke="${LINE}" stroke-width="4"/>
        <ellipse cx="138" cy="62" rx="12" ry="11" fill="${fur.snout}" stroke="${LINE}" stroke-width="4"/>
        <!-- head: a wide, rounded box (capybaras have square-ish heads) -->
        <rect x="48" y="58" width="104" height="98" rx="44" fill="${fur.value}" stroke="${LINE}" stroke-width="4"/>
        <ellipse cx="66" cy="116" rx="7" ry="4" fill="#E88A7A" opacity="0.55"/>
        <ellipse cx="134" cy="116" rx="7" ry="4" fill="#E88A7A" opacity="0.55"/>
        <!-- the big blunt snout -->
        <rect x="68" y="104" width="64" height="44" rx="22" fill="${fur.snout}" stroke="${LINE}" stroke-width="3"/>
        <ellipse cx="88" cy="117" rx="4" ry="2.6" fill="${LINE}"/>
        <ellipse cx="112" cy="117" rx="4" ry="2.6" fill="${LINE}"/>
        <path d="M100 121 L100 132 M93 135 Q100 140 107 135" stroke="${LINE}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        ${eyesSVG(look.eyes)}
        ${chestSVG(look.acc)}
        ${glassesSVG(look.acc)}
        ${hatSVG(look.hat)}
        </g>
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

  // The look being worn. Ids that no longer exist fall back to the free item.
  function current() {
    const look = Store.get().avatar;
    const out = {};
    Object.keys(CATALOG).forEach((slot) => (out[slot] = find(slot, look[slot]).id));
    return out;
  }

  return { CATALOG, svg, owns, buyOrWear, current, find };
})();
