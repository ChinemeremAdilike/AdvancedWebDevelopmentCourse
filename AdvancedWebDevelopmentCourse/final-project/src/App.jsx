import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* Wrapper matches original <body> structure */}
      <div className="min-h-screen flex flex-col bg-brand-light text-brand-dark">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
