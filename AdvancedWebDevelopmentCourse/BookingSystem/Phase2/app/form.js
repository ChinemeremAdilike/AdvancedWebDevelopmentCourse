// form.js – FIXED VERSION FOR TASK C (FULL CSR VALIDATION)

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("resourceForm");

  const nameEl = document.getElementById("resourceName");
  const descEl = document.getElementById("resourceDescription");
  const priceEl = document.getElementById("resourcePrice");
  const unitEls = document.querySelectorAll("input[name='resourcePriceUnit']");

  // ✅ Get validators from resources.js (already attached globally)
  const {
    isValidName,
    isValidDescription,
    isValidPrice,
    markField
  } = window._resourceValidators;

  // ✅ Find the Create button generated in resources.js
  const createBtn = [...document.querySelectorAll("button")]
    .find(btn => btn.value === "create");

  function setCreateEnabled(ok) {
    if (!createBtn) return;
    createBtn.disabled = !ok;
    createBtn.classList.toggle("cursor-not-allowed", !ok);
    createBtn.classList.toggle("opacity-50", !ok);
  }

  function validateAll() {
    const n = isValidName(nameEl.value);
    const d = isValidDescription(descEl.value);
    const p = isValidPrice(priceEl.value);
    const u = [...unitEls].some(r => r.checked);

    markField(nameEl, n);
    markField(descEl, d);
    markField(priceEl, p);

    unitEls.forEach(radio => {
      const label = radio.parentElement;
      if (u) {
        label.classList.remove("is-invalid");
        label.classList.add("is-valid");
      } else {
        label.classList.remove("is-valid");
        label.classList.add("is-invalid");
      }
    });

    const ok = n && d && p && u;
    setCreateEnabled(ok);
    return ok;
  }

  nameEl.addEventListener("input", validateAll);
  descEl.addEventListener("input", validateAll);
  priceEl.addEventListener("input", validateAll);
  unitEls.forEach(r => r.addEventListener("change", validateAll));

  validateAll();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateAll()) {
      alert("❌ Fix validation errors before submitting.");
      return;
    }
    alert("✅ Validation OK — CSR only (Task C passed)");
  });

});
