// ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameContainer = document.getElementById("resourceNameContainer");

// Example roles
const role = "admin"; // "reserver" | "admin"

// Will hold a reference to the Create button so we can enable/disable it
let createButton = null;
let updateButton = null;
let deleteButton = null;

// ===============================
// 2) Button creation helpers
// ===============================

const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out shadow-soft";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80";

function addButton({ label, value }) {
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.textContent = label;
  btn.name = "action";
  btn.value = value;
  btn.className = `${BUTTON_BASE_CLASSES} ${BUTTON_ENABLED_CLASSES}`;
  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;

  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else {
    btn.classList.add("hover:bg-brand-dark/80");
  }
}

// Render Create / Update / Delete buttons (ORIGINAL UI)
function renderActionButtons() {
  createButton = addButton({ label: "Create", value: "create" });
  updateButton = addButton({ label: "Update", value: "update" });
  deleteButton = addButton({ label: "Delete", value: "delete" });

  // Disable ALL by default (C1 requirement: Create only becomes enabled when valid)
  setButtonEnabled(createButton, false);
  setButtonEnabled(updateButton, false);
  setButtonEnabled(deleteButton, false);
}

// ===============================
// 3) Input creation (ORIGINAL UI)
// ===============================
function createResourceNameInput() {
  const input = document.createElement("input");

  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";

  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  resourceNameContainer.appendChild(input);
  return input;
}

// ===============================
// ✅ 4) VALIDATION HELPERS (C1)
// ===============================
window._resourceValidators = {
  isValidName(v) {
    v = v.trim();
    return /^[a-zA-Z0-9äöåÄÖÅ ]+$/.test(v) && v.length >= 5 && v.length <= 30;
  },

  isValidDescription(v) {
    v = v.trim();
    return v.length >= 10 && v.length <= 50;
  },

  // ✅ FIXED: Empty price is now INVALID
  isValidPrice(v) {
    if (v.trim() === "") return false; // 🔥 C1 FIX: empty is invalid
    return !isNaN(v) && Number(v) >= 0;
  },

  markField(el, ok) {
    el.classList.remove("is-valid", "is-invalid");
    el.classList.add(ok ? "is-valid" : "is-invalid");
  }
};

// ===============================
// 5) Bootstrap UI (ORIGINAL)
// ===============================
renderActionButtons();
createResourceNameInput();