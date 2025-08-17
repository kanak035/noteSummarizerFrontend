import React from "react";
import Home from "./components/Home.jsx";
import Summarizer from "./components/Summarizer.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {/* Main content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summarize" element={<Summarizer />} />
            {/* catch-all → redirect */}
            <Route path="*" element={<Navigate to="/summarize" replace />} />
          </Routes>
        </div>

        {/* Footer (always visible) */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
