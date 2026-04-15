import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#1e1e1e",
        color: "white",
        padding: "1rem 0",
        boxShadow: "0 8px 40px rgba(0, 0, 0, 0.45)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>
              Booking System
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
              Secure resource booking
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: "1rem", fontSize: "0.9rem" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/form" style={{ color: "white", textDecoration: "none" }}>
            Form
          </Link>
        </nav>
      </div>
    </header>
  );
}