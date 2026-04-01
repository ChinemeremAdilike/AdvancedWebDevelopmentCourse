// ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");
const resourceDescription = document.getElementById("resourceDescription");
const resourceAvailable = document.getElementById("resourceAvailable");
const resourcePrice = document.getElementById("resourcePrice");
const resourcePriceUnits = document.querySelectorAll("input[name='resourcePriceUnit']");

let createButton = null;
let updateButton = null;
let deleteButton = null;

let nameValid = false;
let descValid = false;
let priceValid = false;
let unitValid = false;

// ===============================
// 2) BUTTON HELPERS
// ===============================

const BUTTON_BASE =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out shadow-soft";
const BTN_ENABLED = "bg-brand-primary text-white hover:bg-brand-dark/80";
const BTN_DISABLED = "cursor-not-allowed opacity-50";

function addButton(text, value) {
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.name = "action";
  btn.value = value;
  btn.textContent = text;
  btn.className = `${BUTTON_BASE} ${BTN_ENABLED}`;
  actions.appendChild(btn);
  return btn;
}

function setEnabled(btn, enabled) {
  if (!btn) return;
  btn.disabled = !enabled;
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);
  if (!enabled) btn.classList.remove("hover:bg-brand-dark/80");
}

// ===============================
// 3) RENDER BUTTONS
// ===============================
function renderButtons() {
  actions.innerHTML = "";

  createButton = addButton("Create", "create");
  updateButton = addButton("Update", "update");
  deleteButton = addButton("Delete", "delete");

  // Disable all by default
  setEnabled(createButton, false);
  setEnabled(updateButton, false);
  setEnabled(deleteButton, false);
}

// ===============================
// 4) STRICT VALIDATION RULES (RESPECTS TEACHER SPECIFICATION)
// ===============================

// ✅ Allowed: A–Z, a–z, 0–9, space, äöå, comma, dot, hyphen
const allowedPattern = /^[A-Za-z0-9ÄÖÅäöå .,!-]+$/;

function validateName(value) {
  value = value.trim();
  return value.length >= 5 && value.length <= 30 && allowedPattern.test(value);
}

function validateDescription(value) {
  value = value.trim();
  return value.length >= 10 && value.length <= 50 && allowedPattern.test(value);
}

function validatePrice(value) {
  if (value.trim() === "") return false;
  return !isNaN(value) && Number(value) >= 0;
}

function validateUnits() {
  return document.querySelector("input[name='resourcePriceUnit']:checked") !== null;
}

function mark(el, ok) {
  el.classList.remove("is-valid", "is-invalid");
  el.classList.add(ok ? "is-valid" : "is-invalid");
}

// ===============================
// 5) MAIN CHECK FOR CREATE BUTTON
// ===============================
function refreshCreateState() {
  const allValid = nameValid && descValid && priceValid && unitValid;
  setEnabled(createButton, allValid);
}

// ===============================
// 6) EVENT LISTENERS
// ===============================

// ✅ NAME
function attachName() {
  const input = document.createElement("input");
  input.id = "resourceName";
  input.className =
    "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none " +
    "focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30";

  resourceNameContainer.appendChild(input);

  input.addEventListener("input", () => {
    nameValid = validateName(input.value);
    mark(input, nameValid);
    refreshCreateState();
  });
}

// ✅ DESCRIPTION
resourceDescription.addEventListener("input", () => {
  descValid = validateDescription(resourceDescription.value);
  mark(resourceDescription, descValid);
  refreshCreateState();
});

// ✅ PRICE
resourcePrice.addEventListener("input", () => {
  priceValid = validatePrice(resourcePrice.value);
  mark(resourcePrice, priceValid);
  refreshCreateState();
});

// ✅ UNIT
resourcePriceUnits.forEach((radio) =>
  radio.addEventListener("change", () => {
    unitValid = validateUnits();
    refreshCreateState();
  })
);

// ===============================
// 7) INIT
// ===============================
renderButtons();
attachName();

// Description/price/unit fields validated on input
unitValid = validateUnits();
priceValid = validatePrice(resourcePrice.value);
descValid = validateDescription(resourceDescription.value);
nameValid = false;

refreshCreateState();