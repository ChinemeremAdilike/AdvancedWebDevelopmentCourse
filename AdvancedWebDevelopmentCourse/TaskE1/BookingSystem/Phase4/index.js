require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const { body, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 5000; // <-- fix: use PORT with fallback

// --- Middleware ---
app.use(express.json()); // parse application/json

// Optional: return JSON instead of HTML when JSON parsing fails
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ ok: false, error: "Invalid JSON" });
  }
  next(err);
});

// Serve ./public as static assets
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// --- Views ---
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});
app.get("/resources", (_req, res) => {
  res.sendFile(path.join(publicDir, "resources.html"));
});

// --- Postgres pool (reads PG* from .env) ---
const pool = new Pool({});

// --- Validation rules ---
const resourceValidators = [
  body("action")
    .exists({ checkFalsy: true }).withMessage("action is required")
    .trim()
    .isIn(["create"])
    .withMessage("action must be 'create'"),

  body("resourceName")
    .exists({ checkFalsy: true }).withMessage("resourceName is required")
    .isString().withMessage("resourceName must be a string")
    .trim()
    .isLength({ min: 3, max: 80 }).withMessage("resourceName must be 3-80 characters")
    .escape(), // simple output-escape

  body("resourceDescription")
    .exists({ checkFalsy: true }).withMessage("resourceDescription is required")
    .isString().withMessage("resourceDescription must be a string")
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage("resourceDescription must be 10-1000 characters")
    .escape(), // also escape to neutralize scripts

  body("resourceAvailable")
    .exists({ checkFalsy: true }).withMessage("resourceAvailable is required")
    .isBoolean().withMessage("resourceAvailable must be boolean")
    .toBoolean(),

  body("resourcePrice")
    .exists({ checkFalsy: true }).withMessage("resourcePrice is required")
    .isFloat({ min: 0 }).withMessage("resourcePrice must be a non-negative number")
    .toFloat(),

  body("resourcePriceUnit")
    .exists({ checkFalsy: true }).withMessage("resourcePriceUnit is required")
    .isString().withMessage("resourcePriceUnit must be a string")
    .trim()
    .isIn(["hour", "day", "week", "month"]) // <-- align with your message
    .withMessage("resourcePriceUnit must be 'hour', 'day', 'week', or 'month'")
];

// --- Create resource ---
app.post("/api/resources", resourceValidators, async (req, res) => {
  // 1) Validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }

  // 2) Extract validated & coerced fields
  const {
    action,
    resourceName,
    resourceDescription,
    resourceAvailable,
    resourcePrice,
    resourcePriceUnit
  } = req.body;

  if (action !== "create") {
    return res.status(400).json({ ok: false, error: "Only create is implemented right now" });
  }

  // 3) Persist EXACT values (no hashing, no doubling, no forced boolean)
  const insertSql = `
    INSERT INTO resources (name, description, available, price, price_unit)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, description, available, price, price_unit, created_at
  `;
  const params = [
    resourceName,                   // store as plain text (already escaped for output)
    resourceDescription,            // sanitized above via .escape()
    resourceAvailable,              // do not override
    resourcePrice,                  // do not multiply
    resourcePriceUnit
  ];

  try {
    const { rows } = await pool.query(insertSql, params);
    return res.status(201).json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error("DB insert failed:", err);
    return res.status(500).json({ ok: false, error: "Database error" });
  }
});

// --- 404 for unknown /api routes ---
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});