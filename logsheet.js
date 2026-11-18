const p2 = n => String(n).padStart(2, "0");

const fDate = t => {
  const d = new Date(t);
  return p2(d.getMonth() + 1) + "/" + p2(d.getDate()) + "/" + p2(d.getFullYear() % 100);
};

const fTime = t => {
  const d = new Date(t);
  let h = d.getHours();
  const ap = h >= 12 ? "p.m." : "a.m.";
  h = h % 12 || 12;
  return h + ":" + p2(d.getMinutes()) + " " + ap;
};

let returning = null;

function sheetRows(kind) {
  const rows = LOGS
    .filter(l => (l.kind || "individual") === kind)
    .sort((a, b) => a.e1 - b.e1)
    .map(l => `<tr>
      <td>${esc(l.name)}</td>
      <td>${esc(l.section)}</td>
      <td>${fDate(l.e1)}</td>
      <td>${fTime(l.e1)}</td>
      <td>${esc(l.eqName)}${l.qty > 1 ? " × " + l.qty : ""}</td>
      ${l.after
        ? `<td>${fDate(l.after.e)}</td><td>${fTime(l.after.e)}</td><td>${esc(l.after.remark)}</td>`
        : `<td colspan="2"><span class="out">In use</span> <button class="sm" type="button" data-id="${esc(l.id)}">Log after use</button></td><td></td>`}
    </tr>`);

  return rows.length
    ? rows.join("")
    : `<tr><td colspan="8">No entries yet.</td></tr>`;
}

function render() {
  const current = $("eq").value;
  $("eq").innerHTML = EQ.map(e =>
    `<option value="${esc(e.id)}">${esc(e.name)} (${availQty(e)} available)</option>`
  ).join("");
  if (current && EQ.some(e => e.id === current)) $("eq").value = current;

  $("logI").innerHTML = sheetRows("individual");
  $("logG").innerHTML = sheetRows("group");
}

$("lt").addEventListener("change", () => {
  const group = $("lt").value === "group";
  $("nml").textContent = group ? "Group name" : "Name";
  $("nm").placeholder = group ? "e.g. Group 3" : "";
});

$("logBtn").onclick = async () => {
  const kind    = $("lt").value;
  const name    = $("nm").value.trim();
  const section = $("sc").value.trim();
  const id      = $("eq").value;
  const qty     = parseInt($("qt").value, 10);
  const item    = EQ.find(e => e.id === id);

  if (!name || !section || !item) {
    $("msg").textContent = "Enter the name, section and equipment.";
    return;
  }
  if (!(qty > 0)) {
    $("msg").textContent = "Quantity must be at least 1.";
    return;
  }
  if (qty > availQty(item)) {
    $("msg").textContent = `Only ${availQty(item)} ${item.name} available.`;
    return;
  }

  try {
    const logId = "l" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
    await db.collection("logs").doc(logId).set({
      kind: kind,
      name: name,
      section: section,
      eq: id,
      eqName: item.name,
      qty: qty,
      e1: Date.now(),
      after: null
    });
    $("nm").value = "";
    $("sc").value = "";
    $("qt").value = 1;
    $("msg").textContent = "";
  } catch (er) {
    $("msg").textContent = "Couldn't save. Make sure your browser allows site storage.";
  }
};

document.addEventListener("click", ev => {
  const id = ev.target.dataset && ev.target.dataset.id;
  if (!id) return;

  returning = LOGS.find(l => l.id === id);
  if (!returning) return;

  $("retT").textContent = `Log after use: ${returning.eqName} × ${returning.qty} (${returning.name})`;
  $("rg").value = returning.qty;
  $("rb").value = 0;
  $("rm").value = "";
  $("msg2").textContent = "";
  $("ret").hidden = false;
  $("ret").scrollIntoView({ behavior: "smooth", block: "nearest" });
});

$("cancel").onclick = () => {
  $("ret").hidden = true;
  returning = null;
};

$("retBtn").onclick = async () => {
  if (!returning) return;

  const good   = parseInt($("rg").value, 10) || 0;
  const broken = parseInt($("rb").value, 10) || 0;

  if (good < 0 || broken < 0 ||  good + broken !==returning.qty) {
  $("msg2").textContent = `Good + broken must equal ${returning.qty}.`;
  return;
  }
const note = $("rm").value.trim();
const auto = broken ? `${broken} broken, ${good} good` : "All returned in good condition";

  try {
    await db.collection("logs").doc(returning.id).update({
      after: {
        e: Date.now(),
        good: good,
        broken: broken,
        remark: note ? auto + ". " + note : auto
      }
    });
    $("ret").hidden = true;
    returning = null;
  } catch (er) {
    $("msg2").textContent = "Couldn't save. Make sure your browser allows site storage.";
  }
};

render();

(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function p2(n) { return String(n).padStart(2, "0"); }
  function dayKey(t) { var d = new Date(t); return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
  function fDate(t) { var d = new Date(t); return p2(d.getMonth() + 1) + "/" + p2(d.getDate()) + "/" + p2(d.getFullYear() % 100); }
  function fTime(t) {
    var d = new Date(t), h = d.getHours(), ap = h >= 12 ? "p.m." : "a.m.";
    h = h % 12 || 12;
    return h + ":" + p2(d.getMinutes()) + " " + ap;
  }
  function logs() { return (typeof LOGS !== "undefined" && Array.isArray(LOGS)) ? LOGS : []; }

  function row(l) {
    var out = "In use";
    if (l.after) {
      out = fTime(l.after.e);
      if (dayKey(l.after.e) !== dayKey(l.e1)) out += " (" + fDate(l.after.e) + ")";
    }
    return '<tr><td>' + esc(l.name) + '</td><td>' + esc(l.section) + '</td><td>' + fTime(l.e1) +
      '</td><td>' + esc(l.eqName) + (l.qty > 1 ? " &times; " + l.qty : "") +
      '</td><td>' + out + '</td><td>' + (l.after ? esc(l.after.remark) : "") + '</td></tr>';
  }

  function table(title, label, rs) {
    var body = rs.length ? rs.map(row).join("") : '<tr><td colspan="6">No entries</td></tr>';
    return '<h4>' + title + ' (' + rs.length + ')</h4><div class="lsr-scroll"><table><thead><tr><th>' + label +
      '</th><th>Section</th><th>Time in</th><th>Equipment</th><th>Time out</th><th>Remarks</th></tr></thead><tbody>' +
      body + '</tbody></table></div>';
  }

  function render(dateStr) {
    var rows = logs().filter(function (l) { return l.e1 && dayKey(l.e1) === dateStr; })
      .sort(function (a, b) { return a.e1 - b.e1; });
    var ind = rows.filter(function (l) { return (l.kind || "individual") === "individual"; });
    var grp = rows.filter(function (l) { return l.kind === "group"; });

    var eq = {};
    rows.forEach(function (l) {
      var x = eq[l.eqName] = eq[l.eqName] || { used: 0, good: 0, broken: 0, out: 0 };
      x.used += l.qty;
      if (l.after) { x.good += l.after.good || 0; x.broken += l.after.broken || 0; } else { x.out += l.qty; }
    });
    var names = Object.keys(eq).sort();

    var pieces = 0, broken = 0, still = 0;
    rows.forEach(function (l) {
      pieces += l.qty;
      if (l.after) broken += l.after.broken || 0; else still += 1;
    });

    var pretty = new Date(dateStr + "T00:00").toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    var eqBody = names.length ? names.map(function (k) {
      return '<tr><td>' + esc(k) + '</td><td>' + eq[k].used + '</td><td>' + eq[k].good + '</td><td>' + eq[k].broken + '</td><td>' + eq[k].out + '</td></tr>';
    }).join("") : '<tr><td colspan="5">No activity on this day</td></tr>';

    document.getElementById("lsr-output").innerHTML =
      '<h3>STEM Laboratory Daily Report</h3><p>' + esc(pretty) + '</p>' +
      '<div class="lsr-stats">' +
        '<div><b>' + rows.length + '</b><span>Total logs</span></div>' +
        '<div><b>' + ind.length + ' / ' + grp.length + '</b><span>Individual / Group</span></div>' +
        '<div><b>' + pieces + '</b><span>Pieces used</span></div>' +
        '<div><b>' + broken + '</b><span>Broken</span></div>' +
        '<div><b>' + still + '</b><span>Still in use</span></div>' +
      '</div>' +
      '<h4>Equipment summary</h4><div class="lsr-scroll"><table><thead><tr><th>Equipment</th><th>Used</th><th>Returned good</th><th>Broken</th><th>Still in use</th></tr></thead><tbody>' +
      eqBody + '</tbody></table></div>' +
      table("Individual log sheet", "Name", ind) +
      table("Group log sheet", "Group", grp);
  }

  function mount() {
    var box = document.getElementById("lsr-report");
    if (!box) return;
    var input = box.querySelector("#lsr-date");
    input.value = dayKey(Date.now());
    function go() { if (input.value) render(input.value); }
    input.onchange = go;
    box.querySelector("#lsr-gen").onclick = go;
    box.querySelector("#lsr-print").onclick = function () { go(); window.print(); };
    go();

    var sig = "";
    setInterval(function () {
      var s = logs().map(function (l) { return l.id + (l.after ? l.after.e : ""); }).join("|");
      if (s !== sig) { sig = s; go(); }
    }, 1500);
  }

  window.LogsheetReport = { generate: render };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();