// ✅ AUTH-UI.JS — FINAL ES MODULE VERSION
// Compatible with teacher code, resources.js, reservations.js, index.js

/* ------------------ TOKEN ------------------ */
export function getTokenPayload() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    console.error("Invalid token");
    localStorage.removeItem("token");
    return null;
  }
}

/* ------------------ USER ROLE ------------------ */
export function getUserRole() {
  const payload = getTokenPayload();
  return payload?.role ?? null;
}

/* ------------------ NAVBAR AUTH ------------------ */
export function updateAuthLinks() {
  const token = localStorage.getItem("token");
  const links = document.querySelectorAll(".auth-link");

  links.forEach((link) => {
    if (token) {
      if (link.dataset.auth === "guest") link.classList.add("hidden");
      if (link.dataset.auth === "user") link.classList.remove("hidden");
    } else {
      if (link.dataset.auth === "guest") link.classList.remove("hidden");
      if (link.dataset.auth === "user") link.classList.add("hidden");
    }
  });
}

/* ------------------ RESOURCE LINKS ------------------ */
export function updateResourceLinks() {
  const token = localStorage.getItem("token");
  const links = document.querySelectorAll(".res-link");

  links.forEach((link) => {
    if (!token) {
      link.classList.add("cursor-not-allowed", "pointer-events-none");
    } else {
      link.classList.remove("cursor-not-allowed", "pointer-events-none");
    }
  });
}

/* ------------------ HOME PAGE UI ------------------ */
export function updateHomePageUI() {
  const payload = getTokenPayload();
  if (!payload) return;

  const welcomeMsg = document.getElementById("welcome-message");
  const badge = document.getElementById("user-badge");

  if (welcomeMsg) welcomeMsg.textContent = `Welcome, ${payload.firstName}!`;

  if (badge) {
    badge.textContent = payload.role ?? "Member";
    badge.classList.add("bg-brand-green/10", "text-brand-green");
  }
}

/* ------------------ ACCESS GUARD ------------------ */
export function requireAuthOrBlockPage() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    JSON.parse(atob(token.split(".")[1]));
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
}

/* ------------------ LOGOUT ------------------ */
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

/* ------------------ INIT ------------------ */
export function initAuthUI() {
  updateAuthLinks();
  updateResourceLinks();
  updateHomePageUI();
}

document.addEventListener("DOMContentLoaded", initAuthUI);