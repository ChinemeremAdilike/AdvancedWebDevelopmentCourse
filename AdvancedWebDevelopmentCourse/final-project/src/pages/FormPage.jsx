import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FormPage() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      date: formData.get("date"),
    };

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data.json);
    } catch (error) {
      setResponse({ error: "Failed to submit form" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Form Page</h1>
        <p>Please fill in the form and submit the data to httpbin.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Name
              <br />
              <input
                type="text"
                name="name"
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>
              Email
              <br />
              <input
                type="email"
                name="email"
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>
              Date
              <br />
              <input
                type="date"
                name="date"
                required
                style={{ width: "100%", padding: "0.5rem" }}
              />
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {response && (
          <section style={{ marginTop: "2rem" }}>
            <h2>Server Response</h2>
            <pre
              style={{
                background: "#1e1e1e",
                color: "#00ff99",
                padding: "1rem",
                borderRadius: "8px",
                overflowX: "auto",
              }}
            >
              {JSON.stringify(response, null, 2)}
            </pre>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
