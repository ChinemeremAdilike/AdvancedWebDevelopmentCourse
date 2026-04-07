// src/app.js
import express from "express";
import resourcesRouter from "./routes/resources.routes.js";
import reservationsRouter from "./routes/reservations.routes.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Serve static assets (public folder)
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

//
// ✅ PUBLIC ROUTES (always accessible)
//
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(publicDir, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(publicDir, "register.html"));
});

//
// ✅ PROTECTED HTML PAGES (BUT NOT USING requireAuth!)
// ✅ These pages load normally, and their JavaScript checks the token.
// ✅ This matches Phase 7 architecture.
//
app.get("/resources", (req, res) => {
  res.sendFile(path.join(__dirname, "views/resources.html"));
});

app.get("/reservations", (req, res) => {
  res.sendFile(path.join(__dirname, "views/reservations.html"));
});

//
// ✅ PROTECTED API ROUTES (these DO require JWT)
//
app.use("/api/resources", resourcesRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/auth", authRoutes);

//
// API 404 fallback
//
app.use("/api", (req, res) => {
  return res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl,
  });
});

//
// Frontend 404 fallback
//
app.use((req, res) => {
  return res.status(404).send("404 - Page not found");
});

//
// Central error handler
//
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) return next(err);
  return res.status(500).json({
    ok: false,
    error: "Internal server error",
  });
});

export default app;