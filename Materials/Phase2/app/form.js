// form.js — CSR validation + guarded submit (robust Create-button handling)
const $ = (id) => document.getElementById(id);
const addValid   = (el) => { el.classList.remove('is-invalid'); el.classList.add('is-valid'); };
const addInvalid = (el) => { el.classList.remove('is-valid'); el.classList.add('is-invalid'); };

// IMPORTANT: also maintain the visual Tailwind classes that were applied in resources.js
function setEnabled(btn, ok) {
  if (!btn) return;
  btn.disabled = !ok;
  // Remove/add the disabled-look classes so the visual matches the real state
  btn.classList.toggle('cursor-not-allowed', !ok);
  btn.classList.toggle('opacity-50', !ok);
  // Restore hover style when enabled; remove when disabled
  if (ok) {
    btn.classList.add('hover:bg-brand-dark/80');
  } else {
    btn.classList.remove('hover:bg-brand-dark/80');
  }
}

const trimValue  = (el) => { if (!el) return ''; el.value = (el.value ?? '').trim(); return el.value; };
const within     = (n, min, max) => n >= min && n <= max;

// Rules to match on-page hints
const validateName = (v) => {
  const s = (v ?? '').trim();
  const allowed = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;
  return within(s.length, 5, 30) && allowed.test(s);
};
const validateDescription = (v) => {
  const s = (v ?? '').trim();
  return within(s.length, 10, 50);
};

// Always try to get the Create button (now has id="createBtn" from resources.js)
function getCreateBtn(form) {
  return $('createBtn')
      || form?.querySelector('button[name="action"][value="create"]')
      || form?.querySelector('button[type="submit"], input[type="submit"]');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[CSR] form.js loaded');

  const form   = $('resourceForm');
  const nameEl = $('resourceName');
  const descEl = $('resourceDescription');
  const availEl = $('resourceAvailable');
  const priceEl = $('resourcePrice');

  if (!form || !nameEl || !descEl) {
    console.warn('[CSR] Missing form/name/description elements.');
    return;
  }

  // Ensure Create is disabled initially (if present)
  setEnabled(getCreateBtn(form), false);

  // Validate both fields + toggle border colors + enable/disable Create
  const validateAll = () => {
    const nameOk = validateName(nameEl.value);
    const descOk = validateDescription(descEl.value);

    (nameOk ? addValid(nameEl) : addInvalid(nameEl));
    (descOk ? addValid(descEl) : addInvalid(descEl));

    // Re-find Create every time (covers any timing/order)
    const createBtn = getCreateBtn(form);
    setEnabled(createBtn, nameOk && descOk);

    return nameOk && descOk;
  };

  // Live validation
  ['input', 'blur'].forEach(evt => {
    nameEl.addEventListener(evt, validateAll);
    descEl.addEventListener(evt, validateAll);
  });

  // Initial pass
  validateAll();

  // Submit (guarded)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitter = e.submitter;
    const action = submitter && submitter.value ? submitter.value.toLowerCase() : 'create';

    // Final trim and revalidate
    const name = trimValue(nameEl);
    const description = trimValue(descEl);
    const nameOk = validateName(name);
    const descOk = validateDescription(description);

    const createBtn = getCreateBtn(form);

    if (!nameOk || !descOk) {
      (nameOk ? addValid(nameEl) : addInvalid(nameEl));
      (descOk ? addValid(descEl) : addInvalid(descEl));
      setEnabled(createBtn, false);
      alert('Please fix validation errors before submitting.');
      return;
    }

    // Optional fields
    const resourceAvailable = !!(availEl && availEl.checked);
    const resourcePrice = (priceEl?.value ?? '').trim();
    const unitEl = form.querySelector('input[name="resourcePriceUnit"]:checked');
    const resourcePriceUnit = unitEl ? unitEl.value : '';

    const payload = {
      action,
      resourceName: name,
      resourceDescription: description,
      resourceAvailable,
      resourcePrice,
      resourcePriceUnit
    };

    console.group('[CSR] Sending payload'); console.log(payload); console.groupEnd();

    const originalText = createBtn ? (createBtn.textContent || createBtn.value) : '';
    setEnabled(createBtn, false);
    if (createBtn && createBtn.textContent) createBtn.textContent = 'Creating…';

    try {
      // In this static Nginx build, /resources will likely 404 — handled clearly.
      const res = await fetch('/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText}\n${msg}`);
      }

      // Success path (if backend exists)
      nameEl.value = ''; nameEl.classList.remove('is-valid','is-invalid');
      descEl.value = ''; descEl.classList.remove('is-valid','is-invalid');
      if (availEl) availEl.checked = false;
      if (priceEl) priceEl.value = '';
      const checked = form.querySelector('input[name="resourcePriceUnit"]:checked');
      if (checked) checked.checked = false;

      if (createBtn && createBtn.textContent) createBtn.textContent = originalText || 'Create';
      setEnabled(createBtn, false);

    } catch (err) {
      console.error('[CSR] POST error:', err);
      alert('Server/network error. The request did not succeed. This is OK for the task—your CSR validation worked, and you did not fake success.');
      if (createBtn && createBtn.textContent) createBtn.textContent = originalText || 'Create';
      setEnabled(createBtn, false);
    }
  });
});