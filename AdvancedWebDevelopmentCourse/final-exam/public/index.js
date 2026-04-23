const formContainer = document.getElementById("customer-form");
const listContainer = document.getElementById("customer-list");

let selectedCustomerId = null;

/* ---------- Render Form ---------- */
function renderForm() {
  formContainer.innerHTML = `
    <form id="customerForm" class="customer-form">

      <div class="form-row">
        <div class="field">
          <label>First name</label>
          <input type="text" name="first_name" required />
        </div>

        <div class="field">
          <label>Last name</label>
          <input type="text" name="last_name" required />
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label>Email</label>
          <input type="email" name="email" required />
        </div>

        <div class="field">
          <label>Phone</label>
          <input type="text" name="phone" />
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label>Birth date</label>
          <input type="date" name="birth_date" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" id="saveBtn">Add Customer</button>
        <button type="button" id="deleteBtn" style="display:none">Delete</button>
      </div>

    </form>
  `;

  document
    .getElementById("customerForm")
    .addEventListener("submit", handleSubmit);

  document
    .getElementById("deleteBtn")
    .addEventListener("click", handleDelete);
}

/* ---------- Load Customers ---------- */
async function loadCustomers() {
  try {
    const res = await fetch("/api/persons");
    const data = await res.json();

    listContainer.innerHTML = "";

    if (data.length === 0) {
      listContainer.innerHTML = "<p>No customers found.</p>";
      return;
    }

    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      div.addEventListener("click", () => selectCustomer(person));
      listContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    listContainer.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

/* ---------- Select Customer ---------- */
function selectCustomer(person) {
  const form = document.getElementById("customerForm");

  selectedCustomerId = person.id;

  form.first_name.value = person.first_name;
  form.last_name.value = person.last_name;
  form.email.value = person.email;
  form.phone.value = person.phone || "";
  form.birth_date.value = person.birth_date || "";

  document.getElementById("saveBtn").textContent = "Update Customer";
  document.getElementById("deleteBtn").style.display = "inline-block";
}

/* ---------- Create / Update ---------- */
async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;

  const payload = {
    first_name: form.first_name.value,
    last_name: form.last_name.value,
    email: form.email.value,
    phone: form.phone.value,
    birth_date: form.birth_date.value
  };

  const method = selectedCustomerId ? "PUT" : "POST";
  const url = selectedCustomerId
    ? `/api/persons/${selectedCustomerId}`
    : "/api/persons";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  resetForm();
  loadCustomers();
}

/* ---------- Delete ---------- */
async function handleDelete() {
  if (!selectedCustomerId) return;

  await fetch(`/api/persons/${selectedCustomerId}`, {
    method: "DELETE"
  });

  resetForm();
  loadCustomers();
}

/* ---------- Reset Form ---------- */
function resetForm() {
  selectedCustomerId = null;

  document.getElementById("customerForm").reset();
  document.getElementById("saveBtn").textContent = "Add Customer";
  document.getElementById("deleteBtn").style.display = "none";
}

/* ---------- Init ---------- */
renderForm();
loadCustomers();