let searchText = "";

function render() {
  const list = EQ.filter(e => e.name.toLowerCase().includes(searchText));

  if (list.length === 0) {
    $("invb").innerHTML = EQ.length === 0
      ? `<tr><td colspan="5">No equipment yet. Use "Add or edit equipment" below.</td></tr>`
      : `<tr><td colspan="5">No equipment found.</td></tr>`;
    return;
  }

  $("invb").innerHTML = list.map(e => {
    const available = availQty(e);
    return `<tr>
      <td>${esc(e.name)}</td>
      <td class="n ${available <= 0 ? "low" : ""}">${available}</td>
      <td class="n">${usedQty(e.id)}</td>
      <td class="n">${brokenQty(e)}</td>
      <td class="n">${e.t}</td>
    </tr>`;
  }).join("");
}

function runSearch() {
  searchText = $("searchBar").value.trim().toLowerCase();
  render();
}

$("searchBar").addEventListener("input", runSearch);

document.querySelector(".search-box i").addEventListener("click", () => {
  runSearch();
  $("searchBar").focus();
});

$("addEq").onclick = async () => {
  const name   = $("en").value.trim();
  const total  = parseInt($("et").value, 10);
  const broken = parseInt($("eb").value, 10) || 0;

  if (!name || !slug(name) || !(total >= 0) || broken < 0 || broken > total) {
    $("eqerr").textContent =
      "Enter a name, a total, and a broken count that is not above the total.";
    return;
  }

  try {
    await db.collection("equipment").doc(slug(name)).set({
      name: name,
      t: total,
      b: broken
    });
    $("en").value = "";
    $("eqerr").textContent = "";
  } catch (er) {
    $("eqerr").textContent =
      "Couldn't save. Make sure your browser allows site storage.";
  }
};

render();