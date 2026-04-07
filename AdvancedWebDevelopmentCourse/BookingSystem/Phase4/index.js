require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

app.use(express.json());

const pool = new Pool();

// -----------------------------
// SERVER‑SIDE VALIDATION (DATA MODEL)
// -----------------------------
function validateResource(body) {
  const errors = [];

  if (typeof body.resourceName !== "string" || body.resourceName.trim() === "") {
    errors.push({ field: "resourceName", msg: "resourceName is required" });
  }

  if (
    typeof body.resourceDescription !== "string" ||
    body.resourceDescription.trim() === ""
  ) {
    errors.push({
      field: "resourceDescription",
      msg: "resourceDescription is required",
    });
  }

  if (typeof body.resourceAvailable !== "boolean") {
    errors.push({
      field: "resourceAvailable",
      msg: "resourceAvailable must be boolean",
    });
  }

  if (typeof body.resourcePrice !== "number" || body.resourcePrice < 0) {
    errors.push({
      field: "resourcePrice",
      msg: "resourcePrice must be non‑negative number",
    });
  }

  const validUnits = ["hour", "day", "week", "month"];
  if (!validUnits.includes(body.resourcePriceUnit)) {
    errors.push({
      field: "resourcePriceUnit",
      msg: "resourcePriceUnit must be hour/day/week/month",
    });
  }

  return errors;
}

// -----------------------------
// CREATE RESOURCE (TASK E)
// -----------------------------
app.post("/api/resources", async (req, res) => {
  const errors = validateResource(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const {
    resourceName,
    resourceDescription,
    resourceAvailable,
    resourcePrice,
    resourcePriceUnit,
  } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO resources (name, description, available, price, price_unit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        resourceName.trim(),
        resourceDescription.trim(),
        resourceAvailable,
        resourcePrice,
        resourcePriceUnit,
      ]
    );

    res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});