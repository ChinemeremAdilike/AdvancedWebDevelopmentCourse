// resources.js — render action buttons only (validation lives in form.js)
document.addEventListener("DOMContentLoaded", () => {
  const actions = document.getElementById("resourceActions");
  if (!actions) return;

  const role = "admin"; // change to "reserver" if needed

  const BUTTON_BASE =
    "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";
  const BUTTON_THEME =
    "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

  const addBtn = (label, value) => {
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.name = "action";
    btn.value = value;
    btn.textContent = label;
    btn.className = `${BUTTON_BASE} ${BUTTON_THEME}`;
    actions.appendChild(btn);
    return btn;
  };

  const setEnabled = (btn, enabled) => {
    if (!btn) return;
    btn.disabled = !enabled;
    btn.classList.toggle("cursor-not-allowed", !enabled);
    btn.classList.toggle("opacity-50", !enabled);
    if (!enabled) {
      btn.classList.remove("hover:bg-brand-dark/80");
    } else {
      btn.classList.add("hover:bg-brand-dark/80");
    }
  };

  // Create the buttons
  const createBtn = addBtn("Create", "create");
  createBtn.id = "createBtn"; // <-- stable id so form.js can always find it

  const updateBtn = role === "admin" ? addBtn("Update", "update") : null;
  const deleteBtn = role === "admin" ? addBtn("Delete", "delete") : null;

  // Disabled by default; form.js will enable Create when inputs are valid
  setEnabled(createBtn, false);
  setEnabled(updateBtn, false);
  setEnabled(deleteBtn, false);
});