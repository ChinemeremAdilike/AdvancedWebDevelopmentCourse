import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <nav>
        <Link to="/">Home</Link> | <Link to="/form">Form</Link>
      </nav>
    </header>
  );
}