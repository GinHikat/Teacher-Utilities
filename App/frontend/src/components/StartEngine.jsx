import React, { useState } from 'react';
import { Moon, Play, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

function StartEngine({ onEngineStarted }) {
  const [status, setStatus] = useState('offline'); // offline, booting, online

  const handleStart = async () => {
    setStatus('booting');
    
    try {
      // Fetch the sample docx file from public folder
      const response = await fetch('/sample.docx');
      const blob = await response.blob();
      const file = new File([blob], 'sample.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      // Call translation operation to wake up the backend
      const formData = new FormData();
      formData.append('files', file);
      formData.append('target_lang', 'en');

      // Call the API - this might take a while if the backend is waking up
      await axios.post('/api/translate', formData);
      
      setStatus('online');
      
      // Delay slightly for effect so user sees "ONLINE"
      setTimeout(() => {
        onEngineStarted();
      }, 800);

    } catch (error) {
      console.error('Failed to start engine', error);
      setStatus('offline');
      alert('Failed to wake up the engine. It might already be awake or there is a server error.');
      onEngineStarted(); // Let them proceed anyway
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#070a12] relative overflow-hidden">
      {/* Moonbeam & Candlelit Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#d4af37]/20 via-[#e69138]/15 to-transparent rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#7b9acc]/15 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-card w-full max-w-[500px] p-10 border border-amber-500/30 bg-[#0a0e1a]/95 rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(212,175,55,0.2)] relative overflow-hidden backdrop-blur-2xl">
        {/* Fine gold top rule */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        
        <div className="flex flex-col items-center text-center space-y-7 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 via-[#e5c158]/20 to-[#7b9acc]/10 flex items-center justify-center border border-amber-400/40 shadow-[0_0_30px_rgba(212,175,55,0.3)] relative">
            <div className="absolute inset-0 rounded-2xl border-t-2 border-amber-300/60 animate-spin" style={{ animationDuration: '4s' }} />
            <Moon className="text-amber-300 fill-amber-300/20" size={38} />
          </div>
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-xs font-semibold text-amber-300 tracking-widest uppercase font-mono">
              <Sparkles size={12} className="text-amber-400" />
              <span>Moon Shadow Bazaar</span>
            </div>
            <h2 className="text-2xl font-serif font-black gradient-bazaar-text tracking-wide uppercase pt-2">
              Teacher Utilities Engine
            </h2>
            <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
              Initialize the educator workbench services and wake up serverless ASGI engines.
            </p>
          </div>

          <div className="w-full pt-2 flex flex-col items-center gap-5">
            <button 
              onClick={handleStart}
              disabled={status === 'booting'}
              className="btn-bazaar-gold flex items-center justify-center gap-2 w-full py-4 text-sm font-extrabold uppercase tracking-[0.12em]"
            >
              {status === 'booting' ? (
                <>
                  <Loader2 size={18} className="animate-spin text-[#070a12]" />
                  INITIALIZING...
                </>
              ) : status === 'online' ? (
                <>
                  <Moon size={18} className="fill-[#070a12]" />
                  ENGINE ONLINE
                </>
              ) : (
                <>
                  <Play size={18} className="fill-[#070a12] ml-1" />
                  START ENGINE
                </>
              )}
            </button>
            
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              <div className={`w-2 h-2 rounded-full ${status === 'booting' ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]' : status === 'online' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`} />
              <span className="text-gray-400 font-mono text-[11px]">
                Status: {status === 'booting' ? 'Initializing Engine...' : status === 'online' ? 'Engine Ready' : 'Standby / Unloaded'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartEngine;
