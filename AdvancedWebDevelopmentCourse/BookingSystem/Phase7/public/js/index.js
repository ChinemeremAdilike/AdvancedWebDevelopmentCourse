// ✅ index.js - FIXED (NO imports, NO modules)

// Run authentication UI setup on page load
document.addEventListener("DOMContentLoaded", () => {
    if (typeof initAuthUI === "function") initAuthUI();
    if (typeof updateHomePageUI === "function") updateHomePageUI();
});

// Expose logout globally
window.logout = function () {
    localStorage.removeItem("token");
    window.location.href = "/";
};