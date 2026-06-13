import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Translation from "./components/Translation";
import Transcription from "./components/Transcription";
import FormatChanger from "./components/FormatChanger";
import StartEngine from "./components/StartEngine";
import { Languages, AudioLines, Home as HomeIcon, ArrowRightLeft } from "lucide-react";

// Backend API configuration for Vercel/Render
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";

function App() {
  const [isEngineStarted, setIsEngineStarted] = useState(false);

  if (!isEngineStarted) {
    return <StartEngine onEngineStarted={() => setIsEngineStarted(true)} />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="glass-card m-4 px-6 py-4 flex items-center justify-between sticky top-4 z-50">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl group transition-all duration-300"
          >
            <span className="bg-gradient-to-br from-rose-500 to-violet-500 p-2 rounded-lg text-white group-hover:scale-110 group-hover:rotate-6 transition-all ring-4 ring-rose-500/10">
              TU
            </span>
            <span className="gradient-text font-extrabold uppercase tracking-tight">
              Teacher Utilities
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <HomeIcon size={18} /> Home
            </Link>
            <Link
              to="/translation"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Languages size={18} /> Translate
            </Link>
            <Link
              to="/transcription"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <AudioLines size={18} /> Transcribe
            </Link>
            <Link
              to="/format-changer"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowRightLeft size={18} /> Convert
            </Link>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 px-4 pb-12 w-full max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/translation" element={<Translation />} />
            <Route path="/transcription" element={<Transcription />} />
            <Route path="/format-changer" element={<FormatChanger />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
