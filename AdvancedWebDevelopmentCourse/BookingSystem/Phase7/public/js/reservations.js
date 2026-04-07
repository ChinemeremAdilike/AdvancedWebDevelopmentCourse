// Helper for authorized API calls
async function api(url, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        ...options
    });

    return res.json();
}

// Feedback
function showMessage(text, ok = true) {
    const box = document.getElementById("message");
    box.classList.remove("hidden");
    box.textContent = text;
    box.className =
        "mt-6 rounded-2xl px-4 py-3 text-sm " +
        (ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700");
}

// ✅ Load list of reservations (FIXED to use data.data)
async function loadReservations() {
    const list = document.getElementById("reservationList");
    list.innerHTML = "";

    const data = await api("/api/reservations");

    if (!data.ok) {
        showMessage("Failed to load reservations", false);
        return;
    }

    // ✅ backend returns data.data (NOT data.reservations)
    data.data.forEach(r => {
        const div = document.createElement("div");
        div.className =
            "p-3 border rounded-xl cursor-pointer hover:bg-black/5 transition";
        div.textContent =
            `#${r.id} | Resource ${r.resource_id} | ${r.start_time} → ${r.end_time}`;
        div.onclick = () => fillForm(r);
        list.appendChild(div);
    });
}

// ✅ Load selected reservation into form (FIXED property names)
function fillForm(r) {
    document.getElementById("reservationId").value = r.id;
    document.getElementById("resourceId").value = r.resource_id;
    document.getElementById("userId").value = r.user_id;
    document.getElementById("startTime").value = r.start_time.slice(0, 16);
    document.getElementById("endTime").value = r.end_time.slice(0, 16);
    document.getElementById("note").value = r.note || "";
    document.getElementById("status").value = r.status;
}

// ✅ DOM fully loaded BEFORE attaching event listeners
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("reservationForm");
    const createBtn = document.getElementById("createBtn");
    const updateBtn = document.getElementById("updateBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    // ✅ CREATE
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const payload = {
            resourceId: Number(resourceId.value),
            userId: Number(userId.value),
            startTime: new Date(startTime.value).toISOString(),
            endTime: new Date(endTime.value).toISOString(),
            note: note.value.trim(),
            status: status.value
        };

        const data = await api("/api/reservations", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (data.ok) {
            showMessage("✅ Reservation created!");
            form.reset();
            loadReservations();
        } else {
            showMessage("❌ Failed to create reservation", false);
        }
    });

    // ✅ UPDATE
    updateBtn.addEventListener("click", async () => {
        const id = reservationId.value;
        if (!id) return showMessage("Select a reservation first", false);

        const payload = {
            resourceId: Number(resourceId.value),
            userId: Number(userId.value),
            startTime: new Date(startTime.value).toISOString(),
            endTime: new Date(endTime.value).toISOString(),
            note: note.value.trim(),
            status: status.value
        };

        const data = await api(`/api/reservations/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        });

        if (data.ok) {
            showMessage("✅ Reservation updated!");
            loadReservations();
        } else {
            showMessage("❌ Update failed!", false);
        }
    });

    // ✅ DELETE
    deleteBtn.addEventListener("click", async () => {
        const id = reservationId.value;
        if (!id) return showMessage("Select a reservation first", false);

        const data = await api(`/api/reservations/${id}`, {
            method: "DELETE"
        });

        // DELETE returns 204 No Content → treat as success
        showMessage("✅ Reservation deleted!");
        form.reset();
        loadReservations();
    });

    // ✅ Initial load
    loadReservations();
});
