// form.js – C1 CSR validation

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("resourceForm");

  const nameEl = document.getElementById("resourceName");
  const descEl = document.getElementById("resourceDescription");
  const priceEl = document.getElementById("resourcePrice");

  const { isValidName, isValidDescription, isValidPrice, markField } =
    window._resourceValidators;

  const createBtn = [...document.querySelectorAll("button")]
    .find(btn => btn.value === "create");

  function setCreateEnabled(ok) {
    createBtn.disabled = !ok;
    createBtn.classList.toggle("cursor-not-allowed", !ok);
    createBtn.classList.toggle("opacity-50", !ok);
  }

  function validateAll() {
    const n = isValidName(nameEl.value);
    const d = isValidDescription(descEl.value);
    const p = isValidPrice(priceEl.value);

    markField(nameEl, n);
    markField(descEl, d);
    markField(priceEl, p);

    const ok = n && d && p;
    setCreateEnabled(ok);

    return ok;
  }

  nameEl.addEventListener("input", validateAll);
  descEl.addEventListener("input", validateAll);
  descEl.addEventListener("keyup", validateAll);
  priceEl.addEventListener("input", validateAll);

  validateAll();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateAll()) {
      alert("Fix validation errors first.");
      return;
    }

    alert("✅ Validation OK (CSR only)");
  });
});