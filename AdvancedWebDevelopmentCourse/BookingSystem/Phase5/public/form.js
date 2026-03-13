// public/form.js
// ===============================
// Form handling for resources page (F1: clear UI messages)
// ===============================

// -------------- Helpers --------------
function $(id) {
  return document.getElementById(id);
}

function getFormMessageEl() {
  return document.getElementById("formMessage"); // <div id="formMessage"> must exist in resources.html
}

/**
 * Show a success/error/info message in the UI.
 * type: "success" | "error" | "info"
 */
function showFormMessage(type, message) {
  const el = getFormMessageEl();
  if (!el) return;

  // Reset + base styling
  el.className = "mt-6 rounded-2xl border px-4 py-3 text-sm whitespace-pre-line";
  el.classList.remove("hidden");

  // Type-specific styling (Tailwind utility classes)
  if (type === "success") {
    el.classList.add("border-emerald-200", "bg-emerald-50", "text-emerald-900");
  } else if (type === "info") {
    el.classList.add("border-amber-200", "bg-amber-50", "text-amber-900");
  } else {
    // error (default)
    el.classList.add("border-rose-200", "bg-rose-50", "text-rose-900");
  }

  el.textContent = message;

  // Bring message into view (nice UX after submit)
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearFormMessage() {
  const el = getFormMessageEl();
  if (!el) return;
  el.textContent = "";
  el.classList.add("hidden");
}

/**
 * Try to read JSON from the response.
 * If JSON is not available, return a best‑effort object including raw text.
 */
async function readResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return { ok: false, error: "Invalid JSON response" };
    }
  }

  // Fallback: read as text (Express error HTML etc.)
  const text = await response.text().catch(() => "");
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: "Non-JSON response", raw: text };
  }
}

/**
 * Build a readable message for field validation errors returned by the API.
 * Expected format: { errors: [ { field, msg }, ... ] }
 */
function buildValidationMessage(errors) {
  if (!Array.isArray(errors) || errors.length === 0) {
    return "Your request was blocked by server-side validation. Please check your input fields.";
  }

  const lines = errors.map((e) => {
    const field = e.field || "field";
    const msg = e.msg || "Invalid value";
    return `• ${field}: ${msg}`;
  });

  return `Your request was blocked:\n\n${lines.join("\n")}`;
}

// -------------- Wiring --------------
document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (!form) return;
  form.addEventListener("submit", onSubmit);
});

async function onSubmit(event) {
  event.preventDefault();

  const submitter = event.submitter;
  const actionValue = (submitter && submitter.value) ? submitter.value : "create";

  const selectedUnit =
    document.querySelector('input[name="resourcePriceUnit"]:checked')?.value ?? "";

  const priceRaw = $("resourcePrice")?.value ?? "";
  const resourcePrice = priceRaw === "" ? 0 : Number(priceRaw);

  // Build payload exactly as backend expects
  const payload = {
    action: actionValue,
    resourceName: $("resourceName")?.value?.trim() ?? "",
    resourceDescription: $("resourceDescription")?.value?.trim() ?? "",
    resourceAvailable: $("resourceAvailable")?.checked ?? false,
    resourcePrice,
    resourcePriceUnit: selectedUnit,
  };

  try {
    clearFormMessage();

    const response = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await readResponseBody(response);

    // -----------------------------
    // F1: Status-based UI messages
    // -----------------------------
    if (response.status === 201) {
      // Success
      const name = body?.data?.name || payload.resourceName || "Resource";
      showFormMessage("success", `Resource "${name}" was created successfully.`);

      // Inform resources.js (optional for F1, but kept for consistency)
      window.onResourceActionSuccess?.({
        action: actionValue,
        data: "success",
        resource: body?.data
      });
      return;
    }

    if (response.status === 409) {
      // Duplicate
      const name = payload.resourceName || "This name";
      showFormMessage("info", `A resource named "${name}" already exists. Please choose a different name.`);
      return;
    }

    if (response.status === 400) {
      // Validation error: show field list
      const msg = buildValidationMessage(body?.errors);
      showFormMessage("error", msg);
      return;
    }

    // Other unexpected statuses
    const fallback = typeof body?.error === "string" ? body.error : "Unexpected server response";
    showFormMessage("error", `${fallback} (${response.status}). Please try again later.`);

  } catch (err) {
    // Network errors, CORS issues, server unreachable, etc.
    console.error("POST error:", err);
    showFormMessage("error", "Network error — could not reach the server. Check your environment and try again.");
  }
}
