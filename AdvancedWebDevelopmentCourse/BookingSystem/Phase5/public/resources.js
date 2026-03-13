// public/resources.js

// ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
const resourceNameCnt = document.getElementById("resourceNameCnt");
const resourceDescriptionCnt = document.getElementById("resourceDescriptionCnt");
// Example roles
const role = "admin"; // "reserver" | "admin"

// Will hold a reference to the Create button so we can enable/disable it
let createButton = null;

// Primay editing button
let primaryActionButton = null;

// Optional: Update/Delete (edit mode)
let updateButton = null;
let deleteButton = null;

// Used for clearing inputs
let clearButton = null;

// Resource name and description validation status
let resourceNameValid = false;
let resourceDescriptionValid = false;

// Updates from form.js
let formMode = "create";

// ===============================
// F1: UI message helper (exported for form.js)
// ===============================
function showMessage(type, textOrList) {
  const box = document.getElementById("messageBox");
  if (!box) {
    alert(Array.isArray(textOrList) ? textOrList.join("\n") : textOrList);
    return;
  }

  const base = "mt-4 text-sm rounded-xl px-4 py-3 border";
  const cls =
    type === "success" ? "bg-green-50 text-green-800 border-green-300" :
    type === "warning" ? "bg-amber-50 text-amber-800 border-amber-300" :
    "bg-rose-50 text-rose-800 border-rose-300";

  box.className = `${base} ${cls}`;

  if (Array.isArray(textOrList)) {
    box.innerHTML = `<p><strong>Your request was blocked:</strong></p>
      <ul class="list-disc ml-5 mt-1">
        ${textOrList.map(e => `<li>${e}</li>`).join("")}
      </ul>`;
  } else {
    box.textContent = textOrList;
  }
}
window.showMessage = showMessage;

// ===============================
// 2) Button creation helpers
// ===============================

const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;

  btn.disabled = !enabled;

  // Keep disabled look in one place
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  // Remove/Add hover style
  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else {
    if (btn.value === "create" || btn.textContent === "Create") {
      btn.classList.add("hover:bg-brand-dark/80");
    }
  }
}

function renderActionButtons(currentRole) {
  actions.innerHTML = "";
  if (currentRole === "admin" && formMode === "create") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    clearButton = addButton({
      label: "Clear",
      type: "button",
      classes: BUTTON_ENABLED_CLASSES,
    });

    setButtonEnabled(createButton, false);
    setButtonEnabled(clearButton, true);
    primaryActionButton = createButton;

    clearButton.addEventListener("click", clearResourceForm);
  }

  if (currentRole === "admin" && formMode === "edit") {
    updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });

    setButtonEnabled(updateButton, false);
    setButtonEnabled(deleteButton, true);
    primaryActionButton = updateButton;
  }
}

// ==========================================
// 3) Input creation + validation + clearing
// ==========================================
function createResourceNameInput(container) {
  const input = document.createElement("input");

  // Core attributes
  input.id = "resourceName";
  input.name = "resourceName";
  input.type = "text";
  input.placeholder = "e.g., Meeting Room A";

  // Base Tailwind styling
  input.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white
    px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30
    transition-all duration-200 ease-out
  `;

  container.appendChild(input);
  return input;
}

function isResourceNameValid(value) {
  const trimmed = value.trim();
  // A–Z, a–z, 0–9, ä ö å, space, , . -
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ,.\-]+$/;
  const lengthValid = trimmed.length >= 5 && trimmed.length <= 30;
  const charactersValid = allowedPattern.test(trimmed);
  return lengthValid && charactersValid;
}

function createResourceDescriptionArea(container) {
  const textarea = document.createElement("textarea");

  textarea.id = "resourceDescription";
  textarea.name = "resourceDescription";
  textarea.rows = 5;
  textarea.placeholder =
    "Describe location, capacity, included equipment, or any usage notes…";

  textarea.className = `
    mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none
    focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 transition-all duration-200 ease-out
  `;

  container.appendChild(textarea);
  return textarea;
}

function isResourceDescriptionValid(value) {
  const trimmed = value.trim();
  // A–Z, a–z, 0–9, ä ö å, space, , . -
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ,.\-]+$/;
  const lengthValid = trimmed.length >= 10 && trimmed.length <= 50;
  const charactersValid = allowedPattern.test(trimmed);
  return lengthValid && charactersValid;
}

function setInputVisualState(input, state) {
  input.classList.remove(
    "border-green-500",
    "bg-green-100",
    "focus:ring-green-500/30",
    "border-red-500",
    "bg-red-100",
    "focus:ring-red-500/30",
    "focus:border-brand-blue",
    "focus:ring-brand-blue/30"
  );

  input.classList.add("focus:ring-2");

  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-100", "focus:ring-green-500/30");
  } else if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-100", "focus:ring-red-500/30");
  } else {
    // neutral
  }
}

function attachResourceNameValidation(input) {
  const update = () => {
    const raw = input.value;
    if (raw.trim() === "") {
      setInputVisualState(input, "neutral");
      setButtonEnabled(primaryActionButton, false);
      return;
    }
    resourceNameValid = isResourceNameValid(raw);

    setInputVisualState(input, resourceNameValid ? "valid" : "invalid");
    setButtonEnabled(primaryActionButton, resourceNameValid && resourceDescriptionValid);
  };

  input.addEventListener("input", update);
  update();
}

function attachResourceDescriptionValidation(textarea) {
  const update = () => {
    const raw = textarea.value;
    if (raw.trim() === "") {
      setInputVisualState(textarea, "neutral");
      setButtonEnabled(primaryActionButton, false);
      return;
    }

    resourceDescriptionValid = isResourceDescriptionValid(raw);
    setInputVisualState(textarea, resourceDescriptionValid ? "valid" : "invalid");
    setButtonEnabled(primaryActionButton, resourceNameValid && resourceDescriptionValid);
  };

  textarea.addEventListener("input", update);
  update();
}

// Clear button functionality
function clearResourceForm() {
  resourceNameInput.value = "";
  resourceNameInput.dispatchEvent(new Event("input", { bubbles: true }));
  resourceDescriptionArea.value = "";
  resourceDescriptionArea.dispatchEvent(new Event("input", { bubbles: true }));

  const defaultAvailable = document.getElementById("resourceAvailable");
  if (defaultAvailable) defaultAvailable.checked = false;

  const priceInput = document.getElementById("resourcePrice");
  if (priceInput) {
    priceInput.value = "";
    priceInput.dispatchEvent(new Event("input", { bubbles: true }));
  }

  const defaultUnit = document.querySelector('input[name="resourcePriceUnit"][value="hour"]');
  if (defaultUnit) defaultUnit.checked = true;

  setButtonEnabled(primaryActionButton, false);
}

// ===============================
// 4) Bootstrapping
// ===============================
renderActionButtons(role);

// Create + validate input
const resourceNameInput = createResourceNameInput(resourceNameCnt);
attachResourceNameValidation(resourceNameInput);
const resourceDescriptionArea = createResourceDescriptionArea(resourceDescriptionCnt);
attachResourceDescriptionValidation(resourceDescriptionArea);

// From form.js — when server confirms create, switch UI to "edit"
window.onResourceActionSuccess = ({ action, data }) => {
  if (action === "create" && data === "success") {
    // Keep the inputs as-is, but flip primary button to Update if you want
    // For F1 we can remain in create mode too; showing messages is the key.
    // If you prefer to switch:
    // formMode = "edit";
    // renderActionButtons(role);
  }
};