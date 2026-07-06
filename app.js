'use strict';

/* =====================================================
   Sage Hair — diario dei capelli
   Tutto locale: IndexedDB per voci e foto, localStorage
   per le preferenze. Nessun server, nessun account.
   ===================================================== */

// ---------- Tipi di voce e icone ----------
// l'ordine qui sotto decide l'ordine ovunque (legenda, scelta tipo, statistiche):
// dal più frequente al più raro
const TYPES = {
  shampoo:    { label: 'Shampoo' },
  impacco:    { label: 'Impacco' },
  colore:     { label: 'Colore' },
  lunghezza:  { label: 'Lunghezza' },
  taglio:     { label: 'Taglio' },
  schiaritura:{ label: 'Schiaritura' },
  calore:     { label: 'Phon / piastra' },
  nota:       { label: 'Nota' },
};

const ICONS = {
  // bolle di sapone
  shampoo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="13.5" r="5.6" fill="#cfe4ef" stroke="#5f8ca6" stroke-width="1.3"/>
    <path d="M5.9 12.6 a3.5 3.5 0 0 1 2.1-3.1" stroke="#ffffff" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="17" cy="7.8" r="3.4" fill="#cfe4ef" stroke="#5f8ca6" stroke-width="1.2"/>
    <path d="M15.3 7.3 a2 2 0 0 1 1.2-1.7" stroke="#ffffff" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <circle cx="18.3" cy="15.4" r="2.4" fill="#cfe4ef" stroke="#5f8ca6" stroke-width="1.1"/>
    <circle cx="13.7" cy="19.2" r="1.4" fill="#cfe4ef" stroke="#5f8ca6" stroke-width="1"/>
  </svg>`,
  // metro da sarta giallo: nastro steso con tacche e placchetta in punta
  lunghezza: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-8 12 12)">
      <rect x="2" y="9.6" width="20" height="4.8" rx="1.2" fill="#e6b84c" stroke="#8a6b1f" stroke-width="1.3"/>
      <g stroke="#8a6b1f" stroke-width="1">
        <line x1="6" y1="9.6" x2="6" y2="12"/>
        <line x1="9.5" y1="9.6" x2="9.5" y2="13.4"/>
        <line x1="13" y1="9.6" x2="13" y2="12"/>
        <line x1="16.5" y1="9.6" x2="16.5" y2="13.4"/>
      </g>
      <path d="M19.8 9.6 h1 a1.2 1.2 0 0 1 1.2 1.2 v2.4 a1.2 1.2 0 0 1 -1.2 1.2 h-1 Z" fill="#8a6b1f"/>
    </g>
  </svg>`,
  // ciotolina di legno con cucchiaio
  impacco: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 12.5h17a8.5 8.5 0 0 1-17 0z" fill="#a9805a" stroke="#6f4e33" stroke-width="1.3"/>
    <path d="M3.5 12.5h17" stroke="#6f4e33" stroke-width="1.3" stroke-linecap="round"/>
    <ellipse cx="16.6" cy="4.6" rx="2.5" ry="1.8" transform="rotate(40 16.6 4.6)" fill="#c49a6c" stroke="#6f4e33" stroke-width="1.1"/>
    <path d="M15.2 6.4 11 11.4" stroke="#6f4e33" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`,
  // flacone con teschietto
  schiaritura: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="9.5" y="2" width="5" height="3" rx="0.8" fill="#8fa387" stroke="#4e3b2c" stroke-width="1.1"/>
    <path d="M9.5 5h5v2l2 2.5V20a1.6 1.6 0 0 1-1.6 1.6H9.1A1.6 1.6 0 0 1 7.5 20V9.5L9.5 7z" fill="#f6f1e9" stroke="#4e3b2c" stroke-width="1.2"/>
    <circle cx="12" cy="13" r="2.6" fill="#4e3b2c"/>
    <circle cx="11.1" cy="12.6" r="0.65" fill="#f6f1e9"/>
    <circle cx="12.9" cy="12.6" r="0.65" fill="#f6f1e9"/>
    <path d="M10.6 16.6h2.8M11.3 15.8v1.6M12.7 15.8v1.6" stroke="#4e3b2c" stroke-width="1" stroke-linecap="round"/>
  </svg>`,
  // tavolozza da artista
  colore: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.8 2-1.7 0-1.5-1.6-1.9-1.6-3.2 0-1 .9-1.7 2.1-1.7H17a4.4 4.4 0 0 0 4.4-4.5C21.2 6 17 3 12 3z" fill="#f6f1e9" stroke="#7a5c44" stroke-width="1.3"/>
    <circle cx="8" cy="8.3" r="1.5" fill="#8fa387"/>
    <circle cx="13.3" cy="6.6" r="1.5" fill="#e6b84c"/>
    <circle cx="17" cy="9.6" r="1.5" fill="#b0563e"/>
    <circle cx="6.6" cy="13" r="1.5" fill="#7a5c44"/>
  </svg>`,
  // forbice
  taglio: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6.5" r="2.6" fill="none" stroke="#7a5c44" stroke-width="1.6"/>
    <circle cx="6" cy="17.5" r="2.6" fill="none" stroke="#7a5c44" stroke-width="1.6"/>
    <path d="M8.3 8 21 16.5M8.3 16 21 7.5" stroke="#4e3b2c" stroke-width="1.7" stroke-linecap="round"/>
  </svg>`,
  // estintore (calore: phon / piastra)
  calore: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="8.5" y="7" width="7" height="14" rx="2.4" fill="#c0503a" stroke="#7d2f1f" stroke-width="1.3"/>
    <rect x="10.7" y="3.6" width="2.6" height="3.4" fill="#8a8a8a" stroke="#555" stroke-width="1"/>
    <path d="M9.2 3.9h5.6" stroke="#555" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M10.5 3.9 5.6 6.2" stroke="#555" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M5.6 6.2c-1.2.6-1.4 2-.8 2.8" stroke="#555" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <rect x="10" y="11" width="4" height="5" rx="0.8" fill="#f6f1e9"/>
  </svg>`,
  // fogliolina (nota generica)
  nota: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 4.5C12 4.5 5.5 8 5 16.5c0 0 0 3 .5 3s.7-2.4 1.5-2.5c7.5-1 12.5-5.5 12.5-12.5z" fill="#8fa387" stroke="#6b8063" stroke-width="1.2"/>
    <path d="M7.5 16.5C10 12 13.5 9 17.5 7" stroke="#f6f1e9" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  </svg>`,

  // ---- icone di servizio e sotto-dettagli dell'impacco ----
  // lampadina (consigli)
  lampadina: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.8a6.2 6.2 0 0 1 3.5 11.3c-.7.5-1.1 1.2-1.1 2.1H9.6c0-.9-.4-1.6-1.1-2.1A6.2 6.2 0 0 1 12 2.8z" fill="#f4d06f" stroke="#8a6b1f" stroke-width="1.3"/>
    <path d="M9.9 18.4h4.2M10.4 20.4h3.2" stroke="#8a6b1f" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`,
  // bersaglio (fase del cronoprogramma)
  bersaglio: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8.6" fill="#f6f1e9" stroke="#b0563e" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5.3" fill="none" stroke="#b0563e" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="2.2" fill="#b0563e"/>
  </svg>`,
  // olive (hair oiling)
  oliva: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 6.5C13 3.5 16.5 3 19.5 4.5c-1.5 3-5 4-8 3z" fill="#8fa387" stroke="#6b8063" stroke-width="1.1"/>
    <ellipse cx="9" cy="14.5" rx="4.8" ry="5.6" fill="#7f9457" stroke="#55663a" stroke-width="1.2"/>
    <ellipse cx="16.3" cy="13.8" rx="3.7" ry="4.4" fill="#a5b671" stroke="#55663a" stroke-width="1.2"/>
    <circle cx="7.4" cy="12.4" r="1" fill="#c4d19a"/>
  </svg>`,
  // vasetto di miele (fase idratante)
  miele: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="7.2" y="3.6" width="9.6" height="2.8" rx="1.2" fill="#c98a33" stroke="#8a5a1f" stroke-width="1.1"/>
    <path d="M8 6.4h8v1.4c1.7 1 2.9 2.9 2.9 5.1A6.9 6.6 0 0 1 12 19.8a6.9 6.6 0 0 1-6.9-6.9c0-2.2 1.2-4.1 2.9-5.1z" fill="#e0a44b" stroke="#8a5a1f" stroke-width="1.2"/>
    <path d="M5.6 12.6h12.8" stroke="#fdf6e3" stroke-width="2.4"/>
  </svg>`,
  // avocado (fase nutriente)
  avocado: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.8c1.7 0 2.5 1.7 3.1 3.7.8 2.6 3.1 3.7 3.1 6.5a6.2 6.2 0 0 1-12.4 0c0-2.8 2.3-3.9 3.1-6.5.6-2 1.4-3.7 3.1-3.7z" fill="#5d7a44" stroke="#3f5430" stroke-width="1.2"/>
    <ellipse cx="12" cy="13.2" rx="4.2" ry="5" fill="#cdd98f"/>
    <circle cx="12" cy="14.4" r="2.3" fill="#8a5a33" stroke="#6f4526" stroke-width="1"/>
  </svg>`,
  // scudo (termoprotettore)
  scudo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l7 2.6v5.6c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V5.6z" fill="#8fa387" stroke="#6b8063" stroke-width="1.3"/>
    <path d="M9 11.8l2.2 2.2 4-4.4" stroke="#fdfcfa" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  // pesciolino (fase proteinizzante)
  pesce: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.2 12l4.6-3.4v6.8z" fill="#6d94ad" stroke="#46657a" stroke-width="1.1" stroke-linejoin="round"/>
    <ellipse cx="14.2" cy="12" rx="7" ry="4.7" fill="#9fc0d3" stroke="#46657a" stroke-width="1.2"/>
    <path d="M13.2 8.2c1.6 2.2 1.6 5.4 0 7.6" stroke="#46657a" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <circle cx="17.8" cy="10.8" r="1" fill="#2f4552"/>
  </svg>`,
};

// fasi del cronoprogramma capillare (sotto-dettaglio dell'impacco)
const PHASES = {
  idratante:      { label: 'Idratante',      icon: 'miele' },
  proteinizzante: { label: 'Proteinizzante', icon: 'pesce' },
  nutriente:      { label: 'Nutriente',      icon: 'avocado' },
};

// ---------- Stato ----------
const today = new Date();
const state = {
  view: 'calendar',
  year: today.getFullYear(),
  month: today.getMonth(),
  entries: [],
  unit: localStorage.getItem('chioma-unit') || 'cm',
  openDate: null,          // 'YYYY-MM-DD' del giorno aperto
  editing: null,           // voce in modifica (o null se nuova)
  editorType: 'impacco',
  photoSlots: [],          // [{blob, url}] foto correnti nell'editor
  impacco: { phase: null, oiling: false, ingredients: [] }, // sotto-dettagli impacco nell'editor
  formula: [],             // formula per colore/schiaritura nell'editor
  thermo: false,           // termoprotettore per phon/piastra nell'editor
};

let db;

// ---------- IndexedDB ----------
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('chioma', 2);
    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('entries')) {
        const entries = d.createObjectStore('entries', { keyPath: 'id' });
        entries.createIndex('date', 'date');
      }
      if (!d.objectStoreNames.contains('photos')) {
        const photos = d.createObjectStore('photos', { keyPath: 'id' });
        photos.createIndex('entryId', 'entryId');
      }
      if (!d.objectStoreNames.contains('meta')) {
        d.createObjectStore('meta', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function reqP(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const store = (name, mode = 'readonly') => db.transaction(name, mode).objectStore(name);

const getAllEntries = () => reqP(store('entries').getAll());
const putEntry = (e) => reqP(store('entries', 'readwrite').put(e));
const removeEntry = (id) => reqP(store('entries', 'readwrite').delete(id));
const putPhoto = (p) => reqP(store('photos', 'readwrite').put(p));
const getPhotosFor = (entryId) => reqP(store('photos').index('entryId').getAll(entryId));
const getAllPhotos = () => reqP(store('photos').getAll());

async function deletePhotosFor(entryId) {
  const photos = await getPhotosFor(entryId);
  for (const p of photos) await reqP(store('photos', 'readwrite').delete(p.id));
}

// "lapidi": id delle voci eliminate, con data — servono al sync per
// propagare le cancellazioni invece di far risorgere le voci
const getTombstones = () => reqP(store('meta').get('tombstones')).then((r) => (r && r.value) || []);
const setTombstones = (list) => reqP(store('meta', 'readwrite').put({ key: 'tombstones', value: list }));
async function addTombstone(id) {
  const list = await getTombstones();
  list.push({ id, deletedAt: Date.now() });
  await setTombstones(list);
}

async function reloadEntries() {
  state.entries = await getAllEntries();
  state.entries.sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
  updateCurrentLength();
}

// ---------- Utilità ----------
const $ = (sel) => document.querySelector(sel);
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(36).slice(2));
const pad = (n) => String(n).padStart(2, '0');
const dateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const todayKey = () => dateKey(today.getFullYear(), today.getMonth(), today.getDate());

const MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];

function formatDateLong(key) {
  const [y, m, d] = key.split('-').map(Number);
  const dow = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'][new Date(y, m - 1, d).getDay()];
  return `${dow} ${d} ${MONTHS[m - 1]} ${y}`;
}

function cmToDisplay(cm) {
  return state.unit === 'cm' ? cm : cm / 2.54;
}
function displayToCm(v) {
  return state.unit === 'cm' ? v : v * 2.54;
}
function fmtLen(cm) {
  return cmToDisplay(cm).toFixed(1).replace(/\.0$/, '') + ' ' + state.unit;
}
function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Navigazione viste ----------
function switchView(view) {
  state.view = view;
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.view === view));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + view));
  if (view === 'stats') renderStats();
  if (view === 'calendar') renderCalendar();
}

// ---------- Calendario ----------
function entriesByDate() {
  const map = {};
  for (const e of state.entries) (map[e.date] ||= []).push(e);
  return map;
}

function renderCalendar() {
  const { year, month } = state;
  $('#monthLabel').textContent = `${MONTHS[month]} ${year}`;
  const grid = $('#calendarGrid');
  grid.innerHTML = '';
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // lunedì = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDate = entriesByDate();
  const tKey = todayKey();

  for (let i = 0; i < firstDow; i++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell empty';
    grid.appendChild(cell);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(year, month, d);
    const cell = document.createElement('div');
    cell.className = 'day-cell' + (key === tKey ? ' today' : '');
    const dayEntries = byDate[key] || [];
    // ogni voce porta la sua icona; l'impacco aggiunge quelle dei sotto-dettagli
    const icons = [];
    for (const e of dayEntries) {
      icons.push(ICONS[e.type] || '');
      if (e.type === 'impacco') {
        if (e.phase && PHASES[e.phase]) icons.push(ICONS[PHASES[e.phase].icon]);
        if (e.oiling) icons.push(ICONS.oliva);
      }
    }
    const shown = icons.slice(0, 4);
    cell.innerHTML =
      `<span class="day-num">${d}</span>` +
      `<span class="day-icons">${shown.join('')}</span>` +
      (icons.length > 4 ? `<span class="day-more">+${icons.length - 4}</span>` : '');
    cell.addEventListener('click', () => openDayModal(key));
    grid.appendChild(cell);
  }

  $('#legend').innerHTML = Object.entries(TYPES)
    .map(([k, t]) => `<span class="legend-item">${ICONS[k]} ${t.label}</span>`)
    .join('');
}

// ---------- Modal giorno ----------
const modalOpenedAt = {};
function showModal(id) {
  modalOpenedAt[id] = performance.now();
  $('#' + id).classList.remove('hidden');
}
function hideModal(id) { $('#' + id).classList.add('hidden'); }

async function openDayModal(key) {
  state.openDate = key;
  $('#dayModalTitle').textContent = formatDateLong(key);
  await renderDayEntries();
  showModal('dayModal');
}

async function renderDayEntries() {
  const list = $('#dayEntries');
  const entries = state.entries.filter((e) => e.date === state.openDate);
  if (!entries.length) {
    list.innerHTML = '<p class="no-entries">Nessuna voce per questo giorno 🌱</p>';
    return;
  }
  list.innerHTML = '';
  for (const e of entries) {
    const card = document.createElement('div');
    card.className = 'entry-card';
    let lengthHtml = '';
    if (e.type === 'lunghezza' && e.lengthCm != null) lengthHtml = `<div class="entry-length">${fmtLen(e.lengthCm)}</div>`;
    if (e.type === 'taglio' && e.cutCm != null) lengthHtml = `<div class="entry-length">−${fmtLen(e.cutCm)}</div>`;
    const badges = [];
    if (e.type === 'impacco') {
      if (e.phase && PHASES[e.phase]) badges.push(`<span class="entry-badge">${ICONS[PHASES[e.phase].icon]} ${PHASES[e.phase].label}</span>`);
      if (e.oiling) badges.push(`<span class="entry-badge">${ICONS.oliva} Hair oiling</span>`);
    }
    if (e.type === 'calore' && e.thermo) badges.push(`<span class="entry-badge">${ICONS.scudo} Termoprotettore</span>`);
    const listChips = [...(e.ingredients || []), ...(e.formula || [])];
    const ingredientsHtml = listChips.length
      ? `<div class="ing-chips">${listChips.map((i) => `<span class="ing-chip">${escapeHtml(i)}</span>`).join('')}</div>` : '';
    card.innerHTML =
      `<span class="entry-icon">${ICONS[e.type] || ''}</span>
       <div class="entry-body">
         <div class="entry-type-label">${TYPES[e.type]?.label || e.type}</div>
         ${badges.length ? `<div class="entry-badges">${badges.join('')}</div>` : ''}
         ${lengthHtml}
         ${e.notes ? `<div class="entry-notes">${escapeHtml(e.notes)}</div>` : ''}
         ${ingredientsHtml}
         <div class="entry-thumbs"></div>
       </div>`;
    card.addEventListener('click', () => openEditor(e));
    list.appendChild(card);
    // miniature foto (asincrone)
    getPhotosFor(e.id).then((photos) => {
      const thumbs = card.querySelector('.entry-thumbs');
      photos.sort((a, b) => a.idx - b.idx).forEach((p) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(p.blob);
        img.addEventListener('click', (ev) => { ev.stopPropagation(); openLightbox(img.src); });
        thumbs.appendChild(img);
      });
    });
  }
}

// ---------- Editor voce ----------
// tipi con misura numerica: contatore a scorrimento invece della tastiera
const MEASURE_CONF = {
  lunghezza: {
    label: 'Lunghezza misurata', min: 10, max: 150, fallback: 60,
    tip: '<strong>Come si misura?</strong> Appoggia l\'inizio del metro all\'attaccatura dei capelli sulla fronte, poi segui la chioma fino al punto della schiena dove arriva la ciocca più lunga. Puoi misurare da bagnati o da asciutti, come preferisci: l\'importante è farlo sempre nello stesso modo, così le statistiche saranno più attendibili.',
  },
  taglio: {
    label: 'Quanto hai tagliato', min: 0.5, max: 30, fallback: 2,
    tip: 'In genere una spuntatina è 1–2 cm, un taglio deciso arriva a 10–15. Se non ricordi al centimetro, va benissimo una stima.',
  },
};

// lunghezza corrente: ultima misurazione meno i tagli fatti dopo di essa
function currentLengthCm() {
  const ms = state.entries.filter((e) => e.type === 'lunghezza' && e.lengthCm != null)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.createdAt || 0) - (b.createdAt || 0));
  if (!ms.length) return null;
  const last = ms[ms.length - 1];
  let cur = last.lengthCm;
  for (const e of state.entries) {
    if (e.type !== 'taglio' || e.cutCm == null) continue;
    const after = e.date > last.date || (e.date === last.date && (e.createdAt || 0) > (last.createdAt || 0));
    if (after) cur -= e.cutCm;
  }
  return Math.max(0, Math.round(cur * 10) / 10);
}

// la spilletta accanto allo switch cm/in: toccala per registrare una nuova misura
function updateCurrentLength() {
  const btn = $('#currentLen');
  const cur = currentLengthCm();
  if (cur == null) { btn.classList.add('hidden'); return; }
  btn.innerHTML = `${ICONS.lunghezza}<span>${fmtLen(cur)}</span>`;
  btn.classList.remove('hidden');
}

function openEditor(entry = null, presetType = null) {
  state.editing = entry;
  state.editorType = entry ? entry.type : (presetType || 'shampoo');
  state.impacco = {
    phase: entry?.phase || null,
    oiling: !!entry?.oiling,
    ingredients: [...(entry?.ingredients || [])],
  };
  state.formula = [...(entry?.formula || [])];
  state.thermo = !!entry?.thermo;
  state.photoSlots.forEach((s) => URL.revokeObjectURL(s.url));
  state.photoSlots = [];

  $('#editorTitle').textContent = entry ? 'Modifica voce' : 'Nuova voce';
  $('#notesInput').value = entry ? entry.notes || '' : '';
  $('#deleteEntryBtn').classList.toggle('hidden', !entry);

  renderTypePicker();
  renderPhotoGrid();

  if (entry) {
    getPhotosFor(entry.id).then((photos) => {
      photos.sort((a, b) => a.idx - b.idx).forEach((p) => {
        state.photoSlots.push({ blob: p.blob, url: URL.createObjectURL(p.blob) });
      });
      renderPhotoGrid();
    });
  }
  showModal('editorModal');
}

function renderTypePicker() {
  const picker = $('#typePicker');
  picker.innerHTML = '';
  for (const [k, t] of Object.entries(TYPES)) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'type-chip' + (k === state.editorType ? ' selected' : '');
    chip.innerHTML = `${ICONS[k]} ${t.label}`;
    chip.addEventListener('click', () => {
      state.editorType = k;
      renderTypePicker();
    });
    picker.appendChild(chip);
  }
  updateMeasureField();
}

// mostra/configura i campi specifici del tipo scelto (contatore, impacco, consiglio)
function updateMeasureField() {
  const conf = MEASURE_CONF[state.editorType];
  renderImpaccoField();
  // il consiglio (lampadina) sta sempre in fondo all'editor, dopo le foto
  const tipEl = $('#entryTip');
  const tipHtml = state.editorType === 'impacco' ? CRONO_TIP : (conf && conf.tip) || null;
  if (tipHtml) {
    tipEl.innerHTML = `<span class="tip-icon">${ICONS.lampadina}</span><span>${tipHtml}</span>`;
    tipEl.classList.remove('hidden');
  } else {
    tipEl.classList.add('hidden');
  }
  $('#measureField').classList.toggle('hidden', !conf);
  if (!conf) return;
  $('#measureLabel').textContent = conf.label;
  const slider = $('#measSlider');
  slider.min = conf.min;
  slider.max = conf.max;
  const e = state.editing;
  if (e && e.type === state.editorType) {
    state.measureCm = (state.editorType === 'lunghezza' ? e.lengthCm : e.cutCm) ?? conf.fallback;
  } else if (state.editorType === 'lunghezza') {
    state.measureCm = currentLengthCm() ?? conf.fallback; // riparti dalla lunghezza corrente
  } else {
    state.measureCm = conf.fallback;
  }
  renderMeasureValue();
}

function renderMeasureValue() {
  $('#measValue').textContent = fmtLen(state.measureCm);
  const slider = $('#measSlider');
  if (parseFloat(slider.value) !== state.measureCm) slider.value = state.measureCm;
}

function nudgeMeasure(deltaCm) {
  const conf = MEASURE_CONF[state.editorType];
  if (!conf) return;
  state.measureCm = Math.min(conf.max, Math.max(conf.min, Math.round((state.measureCm + deltaCm) * 10) / 10));
  renderMeasureValue();
}

// ---- campi specifici per tipo: impacco, colore/schiaritura, phon/piastra ----
const FORMULA_PLACEHOLDER = { colore: 'es. 7.35 per 10 vol', schiaritura: 'es. 20 vol · 6%' };
const CRONO_TIP = 'Il <strong>cronoprogramma capillare</strong> è la routine che alterna impacchi idratanti, nutrienti e proteici per mantenere i capelli in equilibrio. L\'hair oiling (bagno d\'olio) è un rituale a sé, che di solito si concentra sulla cute; se preferisci inquadrarlo nel cronoprogramma, l\'olio ricade in genere nella fase nutriente.';

function renderImpaccoField() {
  const isImp = state.editorType === 'impacco';
  const hasFormula = state.editorType === 'colore' || state.editorType === 'schiaritura';
  const isHeat = state.editorType === 'calore';
  $('#impaccoField').classList.toggle('hidden', !isImp);
  $('#phaseField').classList.toggle('hidden', !isImp);
  $('#formulaField').classList.toggle('hidden', !hasFormula);
  $('#thermoField').classList.toggle('hidden', !isHeat);

  if (hasFormula) {
    $('#formulaInput').placeholder = FORMULA_PLACEHOLDER[state.editorType];
    renderFormulaChips();
  }

  if (isHeat) $('#thermoCheck').checked = state.thermo;

  if (!isImp) return;
  $('#phaseLabelIcon').innerHTML = ICONS.bersaglio;

  const picker = $('#phasePicker');
  picker.innerHTML = '';
  for (const [k, p] of Object.entries(PHASES)) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'type-chip' + (state.impacco.phase === k ? ' selected' : '');
    chip.innerHTML = `${ICONS[p.icon]} ${p.label}`;
    chip.addEventListener('click', () => {
      state.impacco.phase = state.impacco.phase === k ? null : k; // ritocca per deselezionare
      if (state.impacco.phase) state.impacco.oiling = false;      // fase e oiling si escludono
      renderImpaccoField();
    });
    picker.appendChild(chip);
  }

  const oil = $('#oilingPicker');
  oil.innerHTML = '';
  const oilChip = document.createElement('button');
  oilChip.type = 'button';
  oilChip.className = 'type-chip' + (state.impacco.oiling ? ' selected' : '');
  oilChip.innerHTML = `${ICONS.oliva} Hair oiling`;
  oilChip.addEventListener('click', () => {
    state.impacco.oiling = !state.impacco.oiling;
    if (state.impacco.oiling) state.impacco.phase = null; // l'oiling azzera la fase
    renderImpaccoField();
  });
  oil.appendChild(oilChip);

  renderIngredientChips();
}

function renderFormulaChips() {
  const box = $('#formulaChips');
  box.innerHTML = '';
  state.formula.forEach((f, i) => {
    const chip = document.createElement('span');
    chip.className = 'ing-chip';
    chip.innerHTML = `${escapeHtml(f)} <button type="button" aria-label="Rimuovi ${escapeHtml(f)}">✕</button>`;
    chip.querySelector('button').addEventListener('click', () => {
      state.formula.splice(i, 1);
      renderFormulaChips();
    });
    box.appendChild(chip);
  });
}

function addFormula() {
  const input = $('#formulaInput');
  const v = input.value.trim();
  if (!v) return;
  if (!state.formula.some((x) => x.toLowerCase() === v.toLowerCase())) state.formula.push(v);
  input.value = '';
  input.focus();
  renderFormulaChips();
}

function renderIngredientChips() {
  const box = $('#ingredientChips');
  box.innerHTML = '';
  state.impacco.ingredients.forEach((ing, i) => {
    const chip = document.createElement('span');
    chip.className = 'ing-chip';
    chip.innerHTML = `${escapeHtml(ing)} <button type="button" aria-label="Rimuovi ${escapeHtml(ing)}">✕</button>`;
    chip.querySelector('button').addEventListener('click', () => {
      state.impacco.ingredients.splice(i, 1);
      renderIngredientChips();
    });
    box.appendChild(chip);
  });
}

function addIngredient() {
  const input = $('#ingredientInput');
  const v = input.value.trim();
  if (!v) return;
  if (!state.impacco.ingredients.some((x) => x.toLowerCase() === v.toLowerCase())) {
    state.impacco.ingredients.push(v);
  }
  input.value = '';
  input.focus();
  renderIngredientChips();
}

function renderPhotoGrid() {
  const grid = $('#photoGrid');
  grid.innerHTML = '';
  state.photoSlots.forEach((slot, i) => {
    const div = document.createElement('div');
    div.className = 'photo-slot';
    div.innerHTML = `<img src="${slot.url}" alt="Foto ${i + 1}"><button type="button" class="photo-remove" aria-label="Rimuovi foto">✕</button>`;
    div.querySelector('img').addEventListener('click', () => openLightbox(slot.url));
    div.querySelector('.photo-remove').addEventListener('click', () => {
      URL.revokeObjectURL(slot.url);
      state.photoSlots.splice(i, 1);
      renderPhotoGrid();
    });
    grid.appendChild(div);
  });
  if (state.photoSlots.length < 5) {
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'photo-add';
    add.textContent = '+';
    add.setAttribute('aria-label', 'Aggiungi foto');
    add.addEventListener('click', () => $('#photoInput').click());
    grid.appendChild(add);
  }
}

// ridimensiona/comprimi la foto per non gonfiare il database
async function processPhoto(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const MAX = 1600;
    const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.85));
    return blob || file;
  } catch {
    return file; // formato non leggibile dal canvas: salva l'originale
  }
}

async function onPhotosPicked(ev) {
  const files = [...ev.target.files];
  ev.target.value = '';
  for (const f of files) {
    if (state.photoSlots.length >= 5) break;
    const blob = await processPhoto(f);
    state.photoSlots.push({ blob, url: URL.createObjectURL(blob) });
  }
  renderPhotoGrid();
}

async function saveEntry() {
  const type = state.editorType;
  const notes = $('#notesInput').value.trim();
  const lengthCm = type === 'lunghezza' ? state.measureCm : null;
  const cutCm = type === 'taglio' ? state.measureCm : null;
  const isImp = type === 'impacco';
  const extra = {
    phase: isImp ? state.impacco.phase : null,
    oiling: isImp ? state.impacco.oiling : false,
    ingredients: isImp ? state.impacco.ingredients : [],
    formula: (type === 'colore' || type === 'schiaritura') ? state.formula : [],
    thermo: type === 'calore' ? state.thermo : false,
  };
  const entry = state.editing
    ? { ...state.editing, type, notes, lengthCm, cutCm, ...extra, updatedAt: Date.now() }
    : { id: uuid(), date: state.openDate, type, notes, lengthCm, cutCm, ...extra, createdAt: Date.now(), updatedAt: Date.now() };

  await putEntry(entry);
  await deletePhotosFor(entry.id);
  for (let i = 0; i < state.photoSlots.length; i++) {
    await putPhoto({ id: uuid(), entryId: entry.id, idx: i, blob: state.photoSlots[i].blob });
  }
  await reloadEntries();
  hideModal('editorModal');
  await renderDayEntries();
  renderCalendar();
}

async function deleteCurrentEntry() {
  if (!state.editing) return;
  if (!confirm('Eliminare questa voce e le sue foto?')) return;
  await deletePhotosFor(state.editing.id);
  await removeEntry(state.editing.id);
  await addTombstone(state.editing.id);
  await reloadEntries();
  hideModal('editorModal');
  await renderDayEntries();
  renderCalendar();
}

// ---------- Lightbox ----------
function openLightbox(src) {
  $('#lightboxImg').src = src;
  $('#lightbox').classList.remove('hidden');
}

// ---------- Statistiche ----------
function daysAgo(key) {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round((new Date().setHours(0, 0, 0, 0) - new Date(y, m - 1, d).getTime()) / 86400000);
}

function renderStats() {
  const el = $('#statsContent');
  const measurements = state.entries
    .filter((e) => e.type === 'lunghezza' && e.lengthCm != null)
    .sort((a, b) => a.date.localeCompare(b.date));

  let html = '';

  // --- riepilogo crescita ---
  if (measurements.length >= 1) {
    const first = measurements[0];
    const last = measurements[measurements.length - 1];
    const delta = last.lengthCm - first.lengthCm;
    const days = Math.max(1, daysAgo(first.date) - daysAgo(last.date));
    const perMonth = measurements.length >= 2 ? (delta / days) * 30.44 : null;
    html += `<div class="stat-card"><h3>La tua chioma</h3><div class="stat-highlights">
      <div class="stat-box"><div class="val">${fmtLen(last.lengthCm)}</div><div class="lbl">Ultima misura</div></div>
      ${measurements.length >= 2 ? `
        <div class="stat-box"><div class="val">${delta >= 0 ? '+' : ''}${fmtLen(Math.abs(delta) * Math.sign(delta) || 0).replace('-', '')}</div><div class="lbl">${delta >= 0 ? 'Crescita totale' : 'Variazione totale'}</div></div>
        <div class="stat-box"><div class="val">${perMonth >= 0 ? '+' : ''}${cmToDisplay(perMonth).toFixed(2)} ${state.unit}</div><div class="lbl">al mese</div></div>` : ''}
      <div class="stat-box"><div class="val">${measurements.length}</div><div class="lbl">Misurazioni</div></div>
    </div></div>`;
  }

  // --- grafico crescita ---
  if (measurements.length >= 2) {
    html += `<div class="stat-card"><h3>Andamento lunghezza</h3><div class="chart-wrap">${growthChartSVG(measurements)}</div></div>`;
  } else {
    html += `<div class="stat-card"><h3>Andamento lunghezza</h3><p class="muted">Registra almeno due misurazioni (📏 tipo "Lunghezza") per vedere il grafico della crescita.</p></div>`;
  }

  // --- conteggi per tipo ---
  const counts = {};
  for (const e of state.entries) counts[e.type] = (counts[e.type] || 0) + 1;
  const maxCount = Math.max(1, ...Object.values(counts));
  const rows = Object.entries(TYPES)
    .filter(([k]) => counts[k])
    .map(([k, t]) =>
      `<div class="type-count-row">${ICONS[k]}<span class="lbl">${t.label}</span>
       <div class="bar" style="width:${(counts[k] / maxCount) * 55}%"></div>
       <span class="n">${counts[k]}</span></div>`).join('');
  html += `<div class="stat-card"><h3>Voci registrate</h3>${rows || '<p class="muted">Ancora nessuna voce: tocca un giorno del calendario per iniziare.</p>'}</div>`;

  // --- ultimi eventi ---
  const lastOf = (type) => {
    const list = state.entries.filter((e) => e.type === type).sort((a, b) => b.date.localeCompare(a.date));
    return list[0] || null;
  };
  // stesso ordine per frequenza usato ovunque (v. TYPES)
  const eventLabels = {
    shampoo: 'Ultimo shampoo',
    impacco: 'Ultimo impacco',
    colore: 'Ultimo colore',
    taglio: 'Ultimo taglio',
    schiaritura: 'Ultima schiaritura',
    calore: 'Ultimo uso di phon/piastra',
  };
  const eventRows = Object.keys(eventLabels).map((t) => {
    const last = lastOf(t);
    const when = last
      ? (daysAgo(last.date) === 0 ? 'oggi' : daysAgo(last.date) === 1 ? 'ieri' : `${daysAgo(last.date)} giorni fa`)
      : 'mai';
    return `<div class="last-event-row">${ICONS[t]}<span>${eventLabels[t]}</span><span class="when">${when}</span></div>`;
  }).join('');
  html += `<div class="stat-card"><h3>Quanto tempo è passato…</h3>${eventRows}</div>`;

  el.innerHTML = html;
}

function growthChartSVG(measurements) {
  const W = 620, H = 250, PL = 46, PR = 16, PT = 16, PB = 34;
  const toDate = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
  const xs = measurements.map((m) => toDate(m.date));
  const ys = measurements.map((m) => cmToDisplay(m.lengthCm));
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  let yMin = Math.min(...ys), yMax = Math.max(...ys);
  if (yMax - yMin < 2) { yMin -= 1; yMax += 1; }
  const px = (x) => PL + ((x - xMin) / Math.max(1, xMax - xMin)) * (W - PL - PR);
  const py = (y) => PT + (1 - (y - yMin) / (yMax - yMin)) * (H - PT - PB);

  const pts = measurements.map((m, i) => `${px(xs[i]).toFixed(1)},${py(ys[i]).toFixed(1)}`).join(' ');
  const area = `${px(xs[0]).toFixed(1)},${(H - PB)} ${pts} ${px(xs[xs.length - 1]).toFixed(1)},${(H - PB)}`;

  // etichette asse Y (min, medio, max) e X (prima e ultima data)
  const yTicks = [yMin, (yMin + yMax) / 2, yMax].map((v) =>
    `<text x="${PL - 8}" y="${py(v) + 4}" text-anchor="end" font-size="11" fill="#9a8f83">${v.toFixed(1)}</text>
     <line x1="${PL}" y1="${py(v)}" x2="${W - PR}" y2="${py(v)}" stroke="#e9e2d8" stroke-dasharray="3 4"/>`).join('');
  const fmtD = (t) => { const d = new Date(t); return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${String(d.getFullYear()).slice(2)}`; };
  const xLabels =
    `<text x="${PL}" y="${H - 10}" font-size="11" fill="#9a8f83">${fmtD(xMin)}</text>
     <text x="${W - PR}" y="${H - 10}" text-anchor="end" font-size="11" fill="#9a8f83">${fmtD(xMax)}</text>`;
  const dots = measurements.map((m, i) =>
    `<circle cx="${px(xs[i]).toFixed(1)}" cy="${py(ys[i]).toFixed(1)}" r="4" fill="#6b8063" stroke="#fff" stroke-width="1.5"><title>${m.date}: ${fmtLen(m.lengthCm)}</title></circle>`).join('');

  return `<svg class="growth-chart" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    ${yTicks}${xLabels}
    <polygon points="${area}" fill="#8fa387" opacity="0.16"/>
    <polyline points="${pts}" fill="none" stroke="#6b8063" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}

// ---------- Timer ----------
const timer = {
  endsAt: null,       // timestamp fine, se in corsa
  remaining: null,    // ms rimanenti, se in pausa
  duration: 20 * 60 * 1000,
  interval: null,
};

function loadTimer() {
  try {
    const saved = JSON.parse(localStorage.getItem('chioma-timer') || 'null');
    if (saved) Object.assign(timer, saved);
    if (timer.endsAt && timer.endsAt <= Date.now()) { timer.endsAt = null; timer.remaining = null; }
  } catch { /* stato corrotto: si riparte puliti */ }
}
function persistTimer() {
  localStorage.setItem('chioma-timer', JSON.stringify({ endsAt: timer.endsAt, remaining: timer.remaining, duration: timer.duration }));
}

function timerMsLeft() {
  if (timer.endsAt) return Math.max(0, timer.endsAt - Date.now());
  if (timer.remaining != null) return timer.remaining;
  return timer.duration;
}

function renderTimer() {
  const ms = timerMsLeft();
  const totalSec = Math.round(ms / 1000);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  const disp = $('#timerDisplay');
  disp.textContent = `${pad(mm)}:${pad(ss)}`;
  disp.classList.toggle('running', !!timer.endsAt);
  $('#timerStart').textContent = timer.endsAt ? 'Pausa' : (timer.remaining != null ? 'Riprendi' : 'Avvia');
}

function tickTimer() {
  renderTimer();
  if (timer.endsAt && timer.endsAt <= Date.now()) {
    stopTicking();
    timer.endsAt = null;
    timer.remaining = null;
    persistTimer();
    renderTimer();
    timerFinished();
  }
}

function startTicking() {
  if (!timer.interval) timer.interval = setInterval(tickTimer, 250);
}
function stopTicking() {
  clearInterval(timer.interval);
  timer.interval = null;
}

function timerStartPause() {
  $('#timerDone').classList.add('hidden');
  if (timer.endsAt) {                    // pausa
    timer.remaining = timerMsLeft();
    timer.endsAt = null;
    stopTicking();
  } else {                               // avvia / riprendi
    const ms = timer.remaining != null ? timer.remaining : timer.duration;
    timer.endsAt = Date.now() + ms;
    timer.remaining = null;
    startTicking();
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }
  persistTimer();
  renderTimer();
}

function timerReset() {
  timer.endsAt = null;
  timer.remaining = null;
  stopTicking();
  persistTimer();
  $('#timerDone').classList.add('hidden');
  renderTimer();
}

function setTimerMinutes(min) {
  timer.duration = min * 60 * 1000;
  timer.endsAt = null;
  timer.remaining = null;
  stopTicking();
  persistTimer();
  $('#customMin').value = min;
  $('#timerDone').classList.add('hidden');
  renderTimer();
}

function timerFinished() {
  $('#timerDone').classList.remove('hidden');
  beep();
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Sage Hair ⏰', { body: 'Tempo dell\'impacco scaduto!' });
  }
  if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.32);
    });
  } catch { /* audio non disponibile */ }
}

// ---------- Backup: esporta / importa ----------
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
async function dataURLToBlob(dataUrl) {
  return (await fetch(dataUrl)).blob();
}

// ---------- Dataset completo: raccolta, applicazione, merge ----------
const stamp = (e) => e.updatedAt || e.createdAt || 0;

async function collectDataset() {
  const entries = await getAllEntries();
  const photos = [];
  for (const p of await getAllPhotos()) {
    photos.push({ id: p.id, entryId: p.entryId, idx: p.idx, data: await blobToDataURL(p.blob) });
  }
  return { entries, photos, tombstones: await getTombstones() };
}

async function applyDataset(ds) {
  await new Promise((resolve, reject) => {
    const t = db.transaction(['entries', 'photos'], 'readwrite');
    t.objectStore('entries').clear();
    t.objectStore('photos').clear();
    t.oncomplete = resolve;
    t.onerror = () => reject(t.error);
  });
  for (const e of ds.entries) await putEntry(e);
  for (const p of ds.photos) {
    await putPhoto({ id: p.id, entryId: p.entryId, idx: p.idx, blob: await dataURLToBlob(p.data) });
  }
  await setTombstones(ds.tombstones || []);
  await reloadEntries();
  renderCalendar();
}

// unione di due dataset: per ogni voce vince la versione più recente,
// le voci con "lapide" restano eliminate ovunque
function mergeDatasets(a, b) {
  const tombMap = new Map();
  for (const t of [...(a.tombstones || []), ...(b.tombstones || [])]) {
    if (!tombMap.has(t.id) || t.deletedAt > tombMap.get(t.id)) tombMap.set(t.id, t.deletedAt);
  }
  const pick = new Map(); // id -> { entry, ds di provenienza }
  for (const ds of [a, b]) {
    for (const e of ds.entries || []) {
      const cur = pick.get(e.id);
      if (!cur || stamp(e) > stamp(cur.entry)) pick.set(e.id, { entry: e, ds });
    }
  }
  const entries = [];
  const photos = [];
  for (const { entry, ds } of pick.values()) {
    if (tombMap.has(entry.id)) continue;
    entries.push(entry);
    // le foto seguono la versione vincente della voce
    photos.push(...(ds.photos || []).filter((p) => p.entryId === entry.id));
  }
  entries.sort((x, y) => x.date.localeCompare(y.date) || (x.createdAt || 0) - (y.createdAt || 0));
  return { entries, photos, tombstones: [...tombMap].map(([id, deletedAt]) => ({ id, deletedAt })) };
}

// ---------- Backup: esporta / condividi / importa ----------
async function buildBackupFile() {
  const ds = await collectDataset();
  const payload = { app: 'sage-hair', version: 2, exportedAt: new Date().toISOString(), unit: state.unit, ...ds };
  const d = new Date();
  const name = `sage_hair_backup_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_ore${pad(d.getHours())}-${pad(d.getMinutes())}.json`;
  return { payload, name, blob: new Blob([JSON.stringify(payload)], { type: 'application/json' }) };
}

async function exportData() {
  const status = $('#backupStatus');
  status.textContent = 'Preparo il backup…';
  const { payload, name, blob } = await buildBackupFile();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
  status.textContent = `Backup esportato: ${payload.entries.length} voci, ${payload.photos.length} foto.`;
}

async function shareBackup() {
  const status = $('#backupStatus');
  status.textContent = 'Preparo il backup…';
  const { payload, name, blob } = await buildBackupFile();
  const file = new File([blob], name, { type: 'application/json' });
  try {
    await navigator.share({ files: [file], title: 'Backup Sage Hair' });
    status.textContent = `Backup condiviso: ${payload.entries.length} voci, ${payload.photos.length} foto.`;
  } catch (err) {
    if (err.name !== 'AbortError') status.textContent = 'Condivisione non riuscita: ' + err.message;
    else status.textContent = '';
  }
}

async function importData(file) {
  const status = $('#backupStatus');
  try {
    const payload = JSON.parse(await file.text());
    if (!['sage-hair', 'chioma'].includes(payload.app) || !Array.isArray(payload.entries)) throw new Error('formato non valido');
    if (!confirm(`Importare ${payload.entries.length} voci e ${payload.photos?.length || 0} foto?\nVerranno unite a quelle già presenti (per ogni voce vince la versione più recente).`)) return;
    status.textContent = 'Importo…';
    const local = await collectDataset();
    const merged = mergeDatasets(local, { entries: payload.entries, photos: payload.photos || [], tombstones: payload.tombstones || [] });
    await applyDataset(merged);
    status.textContent = `Importazione completata: ora hai ${merged.entries.length} voci.`;
  } catch (err) {
    status.textContent = 'File non valido: ' + err.message;
  }
}

// ---------- Sincronizzazione WiFi ----------
function syncBaseUrl() {
  let url = $('#syncUrl').value.trim();
  if (!url) return null;
  if (!/^https?:\/\//.test(url)) url = 'http://' + url;
  return url.replace(/\/+$/, '');
}

async function syncNow() {
  const status = $('#syncStatus');
  const base = syncBaseUrl();
  if (!base) { status.textContent = 'Inserisci l\'indirizzo del computer (lo trovi nella finestra del server).'; return; }
  localStorage.setItem('chioma-sync-url', base);
  status.textContent = 'Sincronizzo…';
  try {
    const local = await collectDataset();
    const res = await fetch(base + '/api/data', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('il server ha risposto ' + res.status);
    const remote = await res.json();
    const merged = mergeDatasets(local, {
      entries: remote.entries || [], photos: remote.photos || [], tombstones: remote.tombstones || [],
    });
    await applyDataset(merged);
    const push = await fetch(base + '/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app: 'sage-hair', version: 2, syncedAt: new Date().toISOString(), ...merged }),
      signal: AbortSignal.timeout(60000), // le foto possono essere tante
    });
    if (!push.ok) throw new Error('invio non riuscito (' + push.status + ')');
    status.textContent = `Sincronizzato ✓ — ${merged.entries.length} voci, ${merged.photos.length} foto.`;
  } catch (err) {
    const why = err.name === 'TimeoutError' ? 'nessuna risposta dal computer' : err.message;
    status.textContent = 'Sync non riuscito: ' + why +
      '. Controlla che il server sia acceso e che telefono e computer siano sulla stessa rete WiFi.';
  }
}

// ---------- Unità di misura ----------
function toggleUnit() {
  state.unit = state.unit === 'cm' ? 'in' : 'cm';
  localStorage.setItem('chioma-unit', state.unit);
  $('#unitToggle').textContent = state.unit;
  updateCurrentLength();
  if (!$('#editorModal').classList.contains('hidden')) renderMeasureValue();
  if (state.view === 'stats') renderStats();
  if (state.openDate && !$('#dayModal').classList.contains('hidden')) renderDayEntries();
}

// ---------- Avvio ----------
async function init() {
  db = await openDB();
  await reloadEntries();

  $('#unitToggle').textContent = state.unit;

  // tabs
  document.querySelectorAll('.tab').forEach((t) =>
    t.addEventListener('click', () => switchView(t.dataset.view)));

  // calendario
  $('#prevMonth').addEventListener('click', () => {
    state.month--; if (state.month < 0) { state.month = 11; state.year--; }
    renderCalendar();
  });
  $('#nextMonth').addEventListener('click', () => {
    state.month++; if (state.month > 11) { state.month = 0; state.year++; }
    renderCalendar();
  });
  $('#todayBtn').addEventListener('click', () => {
    state.year = today.getFullYear(); state.month = today.getMonth();
    renderCalendar();
  });

  // modali
  document.querySelectorAll('.close-modal').forEach((b) =>
    b.addEventListener('click', () => hideModal(b.dataset.close)));
  // chiudi toccando fuori dal riquadro; ignora il "ghost click" che il
  // browser sintetizza subito dopo il tap che ha aperto il modal
  document.querySelectorAll('.modal-backdrop').forEach((bd) =>
    bd.addEventListener('click', (e) => {
      if (e.target !== bd) return;
      if (performance.now() - (modalOpenedAt[bd.id] || 0) < 400) return;
      bd.classList.add('hidden');
    }));

  $('#addEntryBtn').addEventListener('click', () => openEditor(null));
  $('#saveEntryBtn').addEventListener('click', saveEntry);
  $('#addIngredientBtn').addEventListener('click', addIngredient);
  $('#ingredientInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addIngredient(); }
  });
  $('#thermoCheck').addEventListener('change', (e) => { state.thermo = e.target.checked; });
  $('#addFormulaBtn').addEventListener('click', addFormula);
  $('#formulaInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addFormula(); }
  });
  $('#currentLen').addEventListener('click', () => {
    state.openDate = todayKey();
    openEditor(null, 'lunghezza');
  });
  $('#measMinus').addEventListener('click', () => nudgeMeasure(-0.5));
  $('#measPlus').addEventListener('click', () => nudgeMeasure(0.5));
  $('#measSlider').addEventListener('input', () => {
    state.measureCm = parseFloat($('#measSlider').value);
    $('#measValue').textContent = fmtLen(state.measureCm);
  });
  $('#deleteEntryBtn').addEventListener('click', deleteCurrentEntry);
  $('#photoInput').addEventListener('change', onPhotosPicked);
  $('#lightbox').addEventListener('click', () => $('#lightbox').classList.add('hidden'));

  // impostazioni
  $('#settingsBtn').addEventListener('click', () => {
    $('#backupStatus').textContent = '';
    $('#syncStatus').textContent = '';
    showModal('settingsModal');
  });
  $('#exportBtn').addEventListener('click', exportData);
  // dove il sistema ha il menu di condivisione (telefoni, in pratica),
  // "Condividi" diventa il gesto principale e il download passa in secondo piano
  const probeFile = new File(['x'], 'x.json', { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [probeFile] })) {
    $('#shareBtn').classList.remove('hidden');
    $('#shareBtn').addEventListener('click', shareBackup);
    $('#exportBtn').classList.replace('primary', 'ghost');
    $('#exportBtn').textContent = 'Scarica soltanto';
  }
  // sync WiFi: se l'app è servita dal server locale, l'indirizzo è già quello giusto
  const savedSyncUrl = localStorage.getItem('chioma-sync-url')
    || (location.protocol === 'http:' ? location.origin : '');
  $('#syncUrl').value = savedSyncUrl;
  $('#syncBtn').addEventListener('click', syncNow);
  $('#importBtn').addEventListener('click', () => $('#importInput').click());
  $('#importInput').addEventListener('change', (e) => {
    if (e.target.files[0]) importData(e.target.files[0]);
    e.target.value = '';
  });
  $('#unitToggle').addEventListener('click', toggleUnit);

  // timer
  loadTimer();
  renderTimer();
  if (timer.endsAt) startTicking();
  $('#timerStart').addEventListener('click', timerStartPause);
  $('#timerReset').addEventListener('click', timerReset);
  document.querySelectorAll('.preset').forEach((b) =>
    b.addEventListener('click', () => setTimerMinutes(parseInt(b.dataset.min, 10))));
  $('#customMin').addEventListener('change', () => {
    const v = parseInt($('#customMin').value, 10);
    if (v >= 1) setTimerMinutes(Math.min(v, 600));
  });

  renderCalendar();

  // service worker per l'uso offline (solo https/localhost)
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

init();
