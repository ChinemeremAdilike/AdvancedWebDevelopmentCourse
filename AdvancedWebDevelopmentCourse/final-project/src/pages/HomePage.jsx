import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-6 flex-grow">
        {/* Hero section */}
        <section className="py-16 grid gap-12 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-4 py-1 text-sm font-semibold text-brand-green">
              Privacy-First Availability Overview
            </span>

            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Simplify Resource Booking – Securely
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-black/70">
              Simplify resource and user management in one secure system. Show
              availability publicly without exposing personal details.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="w-full rounded-2xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-dark/80 transition-all duration-200 ease-out">
                Get started
              </button>

              <button className="w-full rounded-2xl border border-brand-blue px-6 py-3 text-sm font-semibold hover:bg-brand-dark/80 hover:text-white transition-all duration-200 ease-out">
                View bookings
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}