// src/routes/resources.routes.js
import express from "express";
import pool from "../db/pool.js";
import { resourceValidators } from "../validators/resource.validators.js";
import { validationResult } from "express-validator";
import { logEvent } from "../services/log.service.js";

const router = express.Router();

// POST /api/resources → create resource with validation + duplicate check + logging
router.post("/", resourceValidators, async (req, res) => {
  // 1) Validate body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // F1: log validation failure
    await logEvent({
      actorUserId: null,
      message: `RESOURCE_CREATE_VALIDATION_FAILED: name="${req.body?.resourceName ?? ""}", errors=${JSON.stringify(
        errors.array().map(e => ({ field: e.path, msg: e.msg }))
      )}`,
      entityType: "resource",
      entityId: null,
    });

    return res.status(400).json({
      ok: false,
      code: "VALIDATION",
      message: "Your request was blocked by server-side validation.",
      errors: errors.array().map(e => ({ field: e.path, msg: e.msg })),
    });
  }

  // 2) Only "create" action is implemented
  const {
    action = "",
    resourceName = "",
    resourceDescription = "",
    resourceAvailable = false,
    resourcePrice = 0,
    resourcePriceUnit = "",
  } = req.body;

  if (action !== "create") {
    return res
      .status(400)
      .json({ ok: false, code: "NOT_IMPLEMENTED", message: "Only create is implemented right now." });
  }

  try {
    // 3) Duplicate check by name
    const dupe = await pool.query(
      "SELECT id FROM resources WHERE name = $1 LIMIT 1",
      [resourceName]
    );

    if (dupe.rows.length > 0) {
      // F1: log duplicate
      await logEvent({
        actorUserId: null,
        message: `RESOURCE_CREATE_BLOCKED_DUPLICATE: name="${resourceName}"`,
        entityType: "resource",
        entityId: dupe.rows[0].id,
      });

      return res.status(409).json({
        ok: false,
        code: "DUPLICATE",
        message: `A resource named "${resourceName}" already exists.`,
      });
    }

    // 4) Insert
    const insertSql = `
      INSERT INTO resources (name, description, available, price, price_unit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, available, price, price_unit, created_at
    `;
    const params = [
      resourceName,
      resourceDescription,
      Boolean(resourceAvailable),
      Number(resourcePrice),
      resourcePriceUnit,
    ];

    const { rows } = await pool.query(insertSql, params);
    const resource = rows[0];

    // F1: log success
    await logEvent({
      actorUserId: null,
      message: `RESOURCE_CREATED: name="${resource.name}", price=${resource.price}, unit="${resource.price_unit}"`,
      entityType: "resource",
      entityId: resource.id,
    });

    return res.status(201).json({
      ok: true,
      message: "Resource created successfully.",
      data: resource,
    });
  } catch (err) {
    console.error("Create resource error:", err);
    return res.status(500).json({
      ok: false,
      code: "SERVER_ERROR",
      message: "Internal database error.",
    });
  }
});

export default router;