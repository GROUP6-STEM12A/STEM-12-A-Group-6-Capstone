const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

let EQ = [];
let LOGS = [];

const usedQty = id =>
  LOGS.filter(l => l.eq === id && !l.after)
      .reduce((total, l) => total + l.qty, 0);

const brokenQty = e =>
  (e.b || 0) +
  LOGS.filter(l => l.eq === e.id && l.after)
      .reduce((total, l) => total + (l.after.broken || 0), 0);

const availQty = e => e.t - brokenQty(e) - usedQty(e.id);

const KEY = "stemLabLog.v1";
let data = { equipment: {}, logs: {} };

try {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    const d = JSON.parse(saved);
    data = { equipment: d.equipment || {}, logs: d.logs || {} };
  }
} catch (e) {}

const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify(data)); }
  catch (e) { throw { code: "unavailable" }; }
};

const listeners = { equipment: [], logs: [] };

const snapshot = name => ({
  docs: Object.entries(data[name]).map(([id, v]) => ({ id, data: () => v }))
});

const notify = name => listeners[name].forEach(fn => fn(snapshot(name)));
const clone = v => JSON.parse(JSON.stringify(v));

const db = {
  collection: name => ({
    onSnapshot(callback) {
      listeners[name].push(callback);
      callback(snapshot(name));
    },
    doc: id => ({
      async set(value) {
        data[name][id] = clone(value);
        persist();
        notify(name);
      },
      async update(value) {
        if (!data[name][id]) throw { code: "invalid_argument" };
        Object.assign(data[name][id], clone(value));
        persist();
        notify(name);
      }
    })
  })
};

window.addEventListener("storage", e => {
  if (e.key !== KEY || !e.newValue) return;
  try {
    const d = JSON.parse(e.newValue);
    data = { equipment: d.equipment || {}, logs: d.logs || {} };
    notify("equipment");
    notify("logs");
  } catch (er) {}
});

db.collection("equipment").onSnapshot(snap => {
  EQ = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (typeof render === "function") render();
});

db.collection("logs").onSnapshot(snap => {
  LOGS = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (typeof render === "function") render();
});