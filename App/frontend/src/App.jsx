import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Translation from "./components/Translation";
import Transcription from "./components/Transcription";
import FormatChanger from "./components/FormatChanger";
import StartEngine from "./components/StartEngine";
import { Languages, AudioLines, Home as HomeIcon, ArrowRightLeft, Moon } from "lucide-react";

// Backend API configuration for Vercel/Render
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";

function NavigationBar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: <HomeIcon size={16} /> },
    { path: "/translation", label: "Translate", icon: <Languages size={16} /> },
    { path: "/transcription", label: "Transcribe", icon: <AudioLines size={16} /> },
    { path: "/format-changer", label: "Convert", icon: <ArrowRightLeft size={16} /> },
  ];

  return (
    <nav className="glass-card m-4 px-6 py-3.5 flex items-center justify-between sticky top-4 z-50 border-amber-500/25 shadow-[0_16px_45px_rgba(0,0,0,0.75),0_0_30px_rgba(212,175,55,0.15)] backdrop-blur-2xl">
      {/* Brand Logo */}
      <Link
        to="/"
        className="flex items-center gap-3 font-bold group transition-all duration-300"
      >
        <span className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#e5c678] to-[#c8a34a] text-[#070a12] group-hover:scale-105 group-hover:rotate-6 transition-all shadow-[0_0_18px_rgba(212,175,55,0.4)] border border-amber-200/50">
          <Moon size={20} className="fill-[#070a12]" />
        </span>
        <div className="flex flex-col">
          <span className="gradient-bazaar-text font-serif font-black uppercase tracking-widest text-lg leading-tight">
            Teacher Utilities
          </span>
          <span className="text-[9px] text-amber-200/60 tracking-widest font-mono uppercase font-semibold">
            Educator Workbench
          </span>
        </div>
      </Link>

      {/* Central Navigation Links */}
      <div className="flex items-center gap-1 sm:gap-2 bg-[#070912]/80 p-1 rounded-xl border border-amber-500/20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-amber-500/20 text-[#f3e5ab] border border-amber-400/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <span className={isActive ? "text-amber-400" : "text-gray-400"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function App() {
  const [isEngineStarted, setIsEngineStarted] = useState(false);

  if (!isEngineStarted) {
    return <StartEngine onEngineStarted={() => setIsEngineStarted(true)} />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen relative">
        <NavigationBar />
        {/* Main Content Pane */}
        <main className="flex-1 px-4 pb-12 w-full max-w-5xl mx-auto relative z-10">
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
