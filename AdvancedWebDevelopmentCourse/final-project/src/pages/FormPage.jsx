import { useState } from "react";
import { Link } from "react-router-dom";

export default function FormPage() {
  const [response, setResponse] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      date: formData.get("date"),
    };

    const res = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResponse(data);
  }

  return (
    <section id="center">
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">← Back</Link>
      </nav>

      <h1>Form Page</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input type="text" name="name" required />
        </label>

        <label>
          Email
          <input type="email" name="email" required />
        </label>

        <label>
          Date
          <input type="date" name="date" required />
        </label>

        <button type="submit">Submit</button>
      </form>

      {response && (
        <pre style={{ marginTop: "1rem", textAlign: "left" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </section>
  );
}