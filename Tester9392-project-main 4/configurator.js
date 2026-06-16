/* =====================================================================
   ByNanz.nl — Configurator: live preview, opties & prijsberekening
   ===================================================================== */

/* ---------- Optie-data ---------- */

// Koordkleuren (touw waar de vlaggetjes aan hangen)
const CORDS = [
  { id: 'muisgrijs',  name: 'Muis-grijs',  hex: '#B8B0A8' },
  { id: 'lichtroze',  name: 'Licht-roze',  hex: '#FADCD9' },
  { id: 'oudroze',    name: 'Oud-roze',    hex: '#D7A9A0' },
  { id: 'fuchsia',    name: 'Fuchsia',     hex: '#C44E89' },
  { id: 'lichtblauw', name: 'Licht-blauw', hex: '#BCD4E0' },
  { id: 'jeansblauw', name: 'Jeans-blauw', hex: '#5B7C99' },
];

// Viltkleuren voor de vlaggetjes.
// 'patroon: true' = bedrukt vlaggetje met een patroon-foto (image).
// De overige zijn blanco (effen) kleuren.
const FELTS = [
  { id: 'patroon1', name: 'Patroon 1', patroon: true, img: 'ChatGPT_Image_Jun_16__2026_at_07_30_24_PM.png' },
  { id: 'patroon2', name: 'Patroon 2', patroon: true, img: 'ChatGPT_Image_Jun_16__2026_at_07_30_36_PM.png' },
  { id: 'patroon3', name: 'Patroon 3', patroon: true, img: 'ChatGPT_Image_Jun_16__2026_at_07_31_28_PM.png' },
  { id: 'lichtroze',  name: 'Licht roze', hex: '#FADCD9' },
  { id: 'lichtblauw', name: 'Licht blauw', hex: '#BCD4E0' },
  { id: 'mintgroen',  name: 'Mint groen', hex: '#B5E0C8' },
];

// Lettertypes voor de naam
const FONTS = [
  { id: 'serif',  name: 'Klassiek',  family: "'Playfair Display', serif" },
  { id: 'sans',   name: 'Modern',    family: "'Poppins', sans-serif" },
  { id: 'script', name: 'Speels',    family: "'Brush Script MT', cursive" },
];

/* ---------- Prijslogica ---------- */
const PRICE_BASE = 9.95;        // basisprijs (koord + afwerking)
const PRICE_PER_FLAG = 2.75;    // prijs per letter/vlaggetje

/* ---------- Configuratie-state ---------- */
const config = {
  name: 'NOAH',
  cord: CORDS[0].id,
  font: FONTS[0].id,
  feltMode: 'mix',                 // 'mix' = afwisselend, 'single' = één kleur
  singleFelt: FELTS[0].id,
  mixFelts: ['patroon1', 'lichtroze', 'patroon2', 'lichtblauw', 'mintgroen'],
};

/* ---------- Helpers ---------- */
function feltById(id) { return FELTS.find((f) => f.id === id) || FELTS[0]; }
function cordById(id) { return CORDS.find((c) => c.id === id) || CORDS[0]; }
function fontById(id) { return FONTS.find((f) => f.id === id) || FONTS[0]; }

function cleanName() {
  return (config.name || '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 12);
}

function letterFlagCount() {
  return cleanName().replace(/ /g, '').length;
}

// Aan begin en eind komt altijd een blanco vlag: elke naam krijgt 2 extra vlaggen.
const EDGE_FLAGS = 2;

function flagCount() {
  const letters = letterFlagCount();
  return letters === 0 ? 0 : letters + EDGE_FLAGS;
}

function totalPrice() {
  return PRICE_BASE + flagCount() * PRICE_PER_FLAG;
}

function euro(n) {
  return '€ ' + n.toFixed(2).replace('.', ',');
}

// Blanco (effen) viltkleuren — gebruikt voor de verplichte blanco rand-vlaggen.
const PLAIN_FELTS = FELTS.filter((f) => !f.patroon);

/* Eerste viltkleur in de selectie die blanco (geen patroon) is. */
function firstPlainFelt(ids) {
  const id = ids.find((x) => !feltById(x).patroon);
  return feltById(id || PLAIN_FELTS[0].id);
}

/* Viltkleur voor de blanco rand-vlaggen (begin & eind). */
function edgeFelt() {
  if (config.feltMode === 'single') return firstPlainFelt([config.singleFelt]);
  const mix = config.mixFelts.length ? config.mixFelts : [FELTS[0].id];
  return firstPlainFelt(mix);
}

/* Viltkleur voor letter-vlaggetje op index i (0-based, alleen de letters). */
function feltForIndex(i) {
  if (config.feltMode === 'single') return feltById(config.singleFelt);
  const mix = config.mixFelts.length ? config.mixFelts : [FELTS[0].id];
  return feltById(mix[i % mix.length]);
}

/* Pas de achtergrond van een vilt-element aan op basis van patroon/effen. */
function applyFeltBackground(el, felt) {
  if (felt.patroon && felt.img) {
    el.style.backgroundImage = "url('" + felt.img + "')";
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundColor = '';
  } else {
    el.style.backgroundImage = '';
    el.style.background = felt.hex;
  }
}

/* ---------- Render: live preview ---------- */
function renderPreview() {
  const garland = document.getElementById('previewGarland');
  const cord = cordById(config.cord);
  const font = fontById(config.font);
  const name = cleanName();

  garland.style.setProperty('--cord', cord.hex);
  garland.innerHTML = '';

  if (!name.trim()) {
    garland.innerHTML = '<p style="color:var(--taupe-soft);padding:2rem;">Typ een naam om je slinger te zien ✨</p>';
    return;
  }

  // Bouw een blanco vlag (zonder letter) voor de rand.
  function buildFlag(felt, char) {
    const flag = document.createElement('div');
    flag.className = 'flag';

    const string = document.createElement('div');
    string.className = 'string';

    const feltEl = document.createElement('div');
    feltEl.className = 'felt';
    applyFeltBackground(feltEl, felt);
    feltEl.style.fontFamily = font.family;

    if (felt.patroon) {
      feltEl.style.color = '#fff';
      feltEl.style.textShadow = '0 1px 3px rgba(0,0,0,0.45)';
    } else {
      feltEl.style.color = isLight(felt.hex) ? 'var(--taupe)' : '#fff';
    }

    feltEl.textContent = char || '';

    flag.appendChild(string);
    flag.appendChild(feltEl);
    garland.appendChild(flag);
  }

  // Verplichte blanco vlag aan het begin.
  buildFlag(edgeFelt(), '');

  let flagIndex = 0;
  name.split('').forEach((char) => {
    if (char === ' ') {
      const gap = document.createElement('div');
      gap.style.width = '24px';
      garland.appendChild(gap);
      return;
    }
    buildFlag(feltForIndex(flagIndex), char);
    flagIndex++;
  });

  // Verplichte blanco vlag aan het eind.
  buildFlag(edgeFelt(), '');
}

/* Bepaal of een hex-kleur licht is (voor leesbare tekstkleur). */
function isLight(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62;
}

/* ---------- Render: prijs & samenvatting ---------- */
function renderSummary() {
  const count = flagCount();
  const letters = letterFlagCount();
  document.getElementById('sumName').textContent = cleanName() || '—';
  document.getElementById('sumFlags').textContent = count === 0
    ? '0 vlaggetjes'
    : count + ' vlaggetjes (incl. 2 blanco)';
  document.getElementById('sumCord').textContent = cordById(config.cord).name;

  const sumColors = document.getElementById('sumColors');
  if (sumColors) {
    if (config.feltMode === 'single') {
      sumColors.textContent = feltById(config.singleFelt).name;
    } else {
      sumColors.textContent = config.mixFelts.map((id) => feltById(id).name).join(', ');
    }
  }

  document.getElementById('totalPrice').textContent = euro(totalPrice());

  const addBtn = document.getElementById('addToCart');
  addBtn.disabled = count === 0;
}

function renderAll() {
  renderPreview();
  renderSummary();
}

/* ---------- Swatch / optie-bouwers ---------- */
function buildSwatches(containerId, items, currentId, onSelect, opts = {}) {
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = '';
  items.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch' + (item.id === currentId ? ' selected' : '');
    btn.title = item.name;
    if (opts.colored) {
      applyFeltBackground(btn, item);
      btn.classList.add('swatch--color');
      if (item.patroon) btn.classList.add('swatch--pattern');
    } else {
      btn.textContent = item.name;
      btn.classList.add('swatch--label');
    }
    btn.addEventListener('click', () => {
      onSelect(item.id);
      wrap.querySelectorAll('.swatch').forEach((s) => s.classList.remove('selected'));
      btn.classList.add('selected');
      renderAll();
    });
    wrap.appendChild(btn);
  });
}

/* Multi-select voor de mix-viltkleuren (toevoegen/verwijderen). */
function buildMixSwatches() {
  const wrap = document.getElementById('mixFelts');
  wrap.innerHTML = '';
  FELTS.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch swatch--color' +
      (item.patroon ? ' swatch--pattern' : '') +
      (config.mixFelts.includes(item.id) ? ' selected' : '');
    applyFeltBackground(btn, item);
    btn.title = item.name;
    btn.addEventListener('click', () => {
      if (config.mixFelts.includes(item.id)) {
        if (config.mixFelts.length > 1) {
          config.mixFelts = config.mixFelts.filter((f) => f !== item.id);
        }
      } else {
        config.mixFelts.push(item.id);
      }
      buildMixSwatches();
      buildMixOrder();
      renderAll();
    });
    wrap.appendChild(btn);
  });
}

/* ---------- Volgorde aanpassen (drag & drop) ---------- */
let dragSrcIndex = null;

/* Verplaats een mix-kleur van index 'from' naar index 'to'. */
function moveMixFelt(from, to) {
  if (to < 0 || to >= config.mixFelts.length || from === to) return;
  const moved = config.mixFelts.splice(from, 1)[0];
  config.mixFelts.splice(to, 0, moved);
  buildMixOrder();
  renderAll();
}

function buildMixOrder() {
  const wrap = document.getElementById('mixOrder');
  if (!wrap) return;
  wrap.innerHTML = '';

  config.mixFelts.forEach((id, index) => {
    const felt = feltById(id);
    const chip = document.createElement('div');
    chip.className = 'order-chip';
    chip.setAttribute('draggable', 'true');
    chip.dataset.index = String(index);
    chip.title = 'Sleep om de volgorde aan te passen';

    const dot = document.createElement('span');
    dot.className = 'order-dot' + (felt.patroon ? ' order-dot--pattern' : '');
    applyFeltBackground(dot, felt);

    const label = document.createElement('span');
    label.className = 'order-label';
    label.textContent = (index + 1) + '. ' + felt.name;

    // Verplaats-knoppen (werken op touch én desktop).
    const moves = document.createElement('span');
    moves.className = 'order-moves';

    const upBtn = document.createElement('button');
    upBtn.type = 'button';
    upBtn.className = 'order-move';
    upBtn.textContent = '\u2191';
    upBtn.setAttribute('aria-label', 'Naar voren verplaatsen');
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => moveMixFelt(index, index - 1));

    const downBtn = document.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'order-move';
    downBtn.textContent = '\u2193';
    downBtn.setAttribute('aria-label', 'Naar achteren verplaatsen');
    downBtn.disabled = index === config.mixFelts.length - 1;
    downBtn.addEventListener('click', () => moveMixFelt(index, index + 1));

    moves.appendChild(upBtn);
    moves.appendChild(downBtn);

    const handle = document.createElement('span');
    handle.className = 'order-handle';
    handle.textContent = '\u2630';

    chip.appendChild(handle);
    chip.appendChild(dot);
    chip.appendChild(label);
    chip.appendChild(moves);

    chip.addEventListener('dragstart', (e) => {
      dragSrcIndex = index;
      chip.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    chip.addEventListener('dragend', () => {
      dragSrcIndex = null;
      wrap.querySelectorAll('.order-chip').forEach((c) => c.classList.remove('dragging', 'drag-over'));
    });
    chip.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      chip.classList.add('drag-over');
    });
    chip.addEventListener('dragleave', () => chip.classList.remove('drag-over'));
    chip.addEventListener('drop', (e) => {
      e.preventDefault();
      chip.classList.remove('drag-over');
      const targetIndex = index;
      if (dragSrcIndex === null || dragSrcIndex === targetIndex) return;
      const moved = config.mixFelts.splice(dragSrcIndex, 1)[0];
      config.mixFelts.splice(targetIndex, 0, moved);
      buildMixOrder();
      renderAll();
    });

    wrap.appendChild(chip);
  });
}

/* ---------- Vilt-modus (mix vs. één kleur) ---------- */
function initFeltMode() {
  const radios = document.querySelectorAll('input[name="feltMode"]');
  const mixPanel = document.getElementById('mixPanel');
  const singlePanel = document.getElementById('singlePanel');

  function sync() {
    if (config.feltMode === 'mix') {
      mixPanel.style.display = '';
      singlePanel.style.display = 'none';
    } else {
      mixPanel.style.display = 'none';
      singlePanel.style.display = '';
    }
  }

  radios.forEach((r) => {
    r.addEventListener('change', () => {
      config.feltMode = r.value;
      sync();
      renderAll();
    });
  });
  sync();
}

/* ---------- Toevoegen aan winkelwagen ---------- */
function initAddToCart() {
  document.getElementById('addToCart').addEventListener('click', () => {
    const count = flagCount();
    if (count === 0) return;

    const item = {
      id: 'slinger_' + Date.now(),
      type: 'Naamslinger op maat',
      name: cleanName(),
      cord: cordById(config.cord).name,
      cordHex: cordById(config.cord).hex,
      font: fontById(config.font).name,
      feltMode: config.feltMode,
      felts: config.feltMode === 'single'
        ? [feltById(config.singleFelt).name]
        : config.mixFelts.map((f) => feltById(f).name),
      flags: count,
      price: totalPrice(),
      qty: 1,
    };

    const cart = getCart();
    cart.push(item);
    saveCart(cart);

    // Bevestiging tonen
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('nameInput');
  nameInput.value = config.name;
  nameInput.addEventListener('input', (e) => {
    config.name = e.target.value;
    renderAll();
  });

  buildSwatches('cordSwatches', CORDS, config.cord, (id) => { config.cord = id; }, { colored: true });
  buildSwatches('fontSwatches', FONTS, config.font, (id) => { config.font = id; });
  buildSwatches('singleFelt', FELTS, config.singleFelt, (id) => { config.singleFelt = id; }, { colored: true });
  buildMixSwatches();
  buildMixOrder();
  initFeltMode();
  initAddToCart();

  renderAll();
});
