import React, { useState } from 'react';
import { Brain, Play, Loader2 } from 'lucide-react';
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
      // If it fails, we should still probably let them in, but alert them
      alert('Failed to wake up the engine. It might already be awake or there is a server error.');
      onEngineStarted(); // Let them proceed anyway
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#08080f]">
      {/* Background radial gradient to match the dark aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#131322] via-[#08080f] to-black pointer-events-none" />
      
      <div className="glass-card w-full max-w-[520px] p-12 scale-110 border border-white/5 bg-[#10101b]/90 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Subtle top glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-7 relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#0a192f] flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative">
            <div className="absolute inset-0 rounded-full border-t border-cyan-400/40 animate-spin" style={{ animationDuration: '3s' }} />
            <Brain className="text-cyan-400" size={32} />
          </div>
          
          <div className="space-y-5">
            <h2 className="text-[24px] font-bold text-cyan-400 tracking-wide">Teacher Utilities Engine</h2>
          </div>

          <div className="w-full pt-4 flex flex-col items-center gap-5">
            <button 
              onClick={handleStart}
              disabled={status === 'booting'}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white rounded-xl font-bold text-[13px] uppercase tracking-[0.1em] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
            >
              {status === 'booting' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  INITIALIZING...
                </>
              ) : status === 'online' ? (
                <>
                  <Brain size={18} />
                  ONLINE
                </>
              ) : (
                <>
                  <Play size={18} className="fill-white ml-1" />
                  START ENGINE
                </>
              )}
            </button>
            
            <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide uppercase">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'booting' ? 'bg-yellow-400 animate-pulse' : status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
              <span className="text-gray-500">
                Status: {status === 'booting' ? 'Initializing / Loading...' : status === 'online' ? 'Online / Loaded' : 'Offline / Unloaded'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartEngine;
