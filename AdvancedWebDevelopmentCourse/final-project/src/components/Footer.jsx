export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#1e1e1e",
        color: "white",
        marginTop: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>
              Booking System
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
              Secure resource booking
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "0.75rem",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          © {new Date().getFullYear()} Booking System. All rights reserved.
        </div>
      </div>
    </footer>
  );
}