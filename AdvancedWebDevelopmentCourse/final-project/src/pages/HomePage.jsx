import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />

      <section id="center">
        <h1>Get started</h1>
        <p>
          Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
        </p>

        <button onClick={() => setCount(c => c + 1)}>
          Count is {count}
        </button>
      </section>

      <Footer />
    </>
  );
}