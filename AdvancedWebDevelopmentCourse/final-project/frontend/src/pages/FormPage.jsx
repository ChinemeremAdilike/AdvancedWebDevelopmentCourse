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
      message: formData.get("message"),
    };

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Failed to submit form" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-16 flex-grow">
        <h1 className="text-3xl font-semibold text-center">Form Page</h1>
        <p className="mt-2 text-center text-black/70">
          Please fill in the form and submit the data to the backend API.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              className="w-full rounded-md border border-gray-300 px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-brand-primary px-8 py-3 text-sm font-semibold
                         text-white shadow-soft hover:bg-brand-dark/80
                         transition-all duration-200 ease-out disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        {response && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold mb-2">
              Server Response
            </h2>
            <pre className="rounded-lg bg-black text-green-400 p-4 text-sm overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}