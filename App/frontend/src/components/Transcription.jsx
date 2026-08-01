import React, { useState } from 'react'
import axios from 'axios'
import { AudioLines, FileCheck, Loader2, Download, AlertCircle, Trash2, Clock, Copy, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PROMPT_TEXT = `You are a transcription assistant. Your only task is to convert audio files to raw text. You must follow these rules strictly:
TRANSCRIPTION RULES:


Transcribe verbatim — every word, filler word, hesitation, repetition exactly as spoken
Preserve all Vietnamese text exactly as spoken — do not translate, romanize, or alter any Vietnamese words, names, or phrases
Do not summarize, paraphrase, analyze, or interpret any content
Do not add punctuation, formatting, or corrections that were not in the original speech
Do not skip any portion of the audio, no matter how unclear — write [inaudible] for unclear segments
Keep speaker labels if multiple speakers are present (e.g., Speaker 1:, Speaker 2:)


PROCESSING ORDER — ONE FILE AT A TIME:
Process each audio file strictly one by one in the order listed. Do not move to the next file until the current one is fully transcribed.
After completing each file, output a checkpoint like this:
✅ CHECKPOINT X of Y files done. Continue to file X + 1
Then immediately begin the next transcription without waiting for confirmation.
OUTPUT FORMAT for each file (where X is the ordinal number of the file):
=== FILE X ===
[raw verbatim transcript here]
=== END OF FILE X ===
BEGIN NOW. Start with File 1 and work through all files in order until all are done. Do not stop until all files have a checkpoint marked ✅`;

function Transcription() {
  const [file, setFile] = useState(null)
  const [chunkMinutes, setChunkMinutes] = useState(45)
  const [isProcessing, setIsProcessing] = useState(false)
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState('idle') // idle, processing, completed, failed
  const [resultFile, setResultFile] = useState(null)
  const [error, setError] = useState(null)
  const [numChunks, setNumChunks] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [isBooting, setIsBooting] = useState(false)
  const [logs, setLogs] = useState([])
  const [copied, setCopied] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase()
      if (['mp3', 'wav', 'm4a', 'mp4'].includes(ext)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Only media files (.mp3, .wav, .m4a, .mp4) are supported.")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)
    setStatus('processing')
    const initialLogs = ["Initiating audio splitting request...", `Target chunk size: ${chunkMinutes} minutes`]
    setLogs(initialLogs)

    setStartTime(Date.now())
    const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (startTime || Date.now())) / 1000))
    }, 1000)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('chunk_minutes', chunkMinutes)

    try {
      setLogs(prev => [...prev, "Uploading file to server (this may take time for large files)..."])
      
      const res = await axios.post('/api/split-audio', formData);
      setIsBooting(false);
      const currentJobId = res.data.job_id;
      setJobId(currentJobId);

      setLogs(prev => [...prev, "✓ File uploaded successfully. Awaiting server processing..."])

      let isDone = false;
      while (!isDone) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          const statusRes = await axios.get(`/api/job-status/${currentJobId}`);
          const jobData = statusRes.data;
          
          if (jobData.logs && jobData.logs.length > 0) {
            setLogs([...initialLogs, "Uploading file to server...", "✓ File uploaded successfully.", ...jobData.logs]);
          }

          if (jobData.status === 'completed') {
            setResultFile(jobData.result_file);
            setNumChunks(jobData.num_chunks || 0);
            setStatus('completed');
            isDone = true;
          } else if (jobData.status === 'failed') {
            setError(jobData.error || "Processing failed on server.");
            setStatus('failed');
            isDone = true;
          }
        } catch (e) {
          console.error("Error fetching job status:", e);
        }
      }

    } catch (err) {
      if (!err.response) {
        setIsBooting(true);
      }
      setError(err.response?.data?.detail || "Upload failed. If the file is very large, it might have exceeded server limits.")
      setStatus('failed')
    } finally {
      setIsProcessing(false)
      clearInterval(timer)
      setStartTime(null)
    }
  }

  const handleDownload = () => {
    if (resultFile) {
      window.open(`${axios.defaults.baseURL}/api/download/${resultFile}`, '_blank')
    }
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(PROMPT_TEXT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setFile(null)
    setJobId(null)
    setStatus('idle')
    setResultFile(null)
    setError(null)
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bazaar-card overflow-hidden border-amber-500/30">
        <div className="p-8 border-b border-amber-500/20 bg-gradient-to-r from-[#d4af37]/15 to-transparent flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold flex items-center gap-3 text-white">
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-400/30 text-amber-300">
                <AudioLines size={28} />
              </div>
              Audio Partitioning & Transcription
            </h2>
            <p className="text-gray-300 mt-2 text-sm">Split large audio files into duration-based chunks for NotebookLM speech recognition.</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {status === 'idle' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* File Dropzone */}
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer hover:border-amber-400/60 hover:bg-[#d4af37]/5 ${file ? 'border-amber-400 bg-[#d4af37]/10' : 'border-amber-500/25'}`}
                onClick={() => document.getElementById('audio-input').click()}
              >
                <input 
                  type="file" 
                  id="audio-input" 
                  className="hidden" 
                  accept=".mp3,.wav,.m4a,.mp4"
                  onChange={handleFileChange} 
                />
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-4 rounded-2xl ${file ? 'bg-gradient-to-r from-[#d4af37] to-[#e5c158] text-[#070a12] shadow-lg shadow-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                    {file ? <FileCheck size={32} /> : <AudioLines size={32} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">{file ? file.name : "Select or Drop Audio File"}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "Supports .mp3, .wav, .m4a, .mp4"}</p>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Clock size={16} className="text-amber-400" /> Chunk Duration (Minutes)
                  </label>
                  <input 
                    type="number" 
                    value={chunkMinutes} 
                    onChange={(e) => setChunkMinutes(e.target.value)}
                    className="w-full input-bazaar bg-[#080b14] border-amber-500/30 text-white"
                    placeholder="e.g., 45"
                  />
                </div>
              </div>

              <button 
                onClick={handleUpload} 
                disabled={!file}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${file ? 'btn-bazaar-gold' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'}`}
              >
                Start Audio Partitioning
              </button>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center gap-8">
              <div className="relative">
                 <Loader2 className="animate-spin text-amber-400" size={72} strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-4 w-full">
                <div className="space-y-1">
                   <h3 className="text-2xl font-serif font-bold text-white">Partitioning Audio Tracks...</h3>
                   <p className="text-gray-400 font-mono text-xs">Elapsed Time: {elapsedTime}s</p>
                </div>
                {isBooting && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 text-amber-300 text-sm max-w-sm mx-auto">
                      <Loader2 className="animate-spin" size={18} />
                      <p>Server is booting up (cold start from Render), please wait...</p>
                  </motion.div>
                )}

                {/* Terminal Log View */}
                {logs.length > 0 && (
                    <div className="w-full max-w-md mx-auto bg-[#080b14] rounded-xl p-3 border border-amber-500/20 font-mono text-[11px] leading-relaxed overflow-hidden text-left">
                        <div className="flex items-center gap-2 mb-2 border-b border-amber-500/15 pb-1.5">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-rose-500/70" />
                                <div className="w-2 h-2 rounded-full bg-amber-500/70" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
                            </div>
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest leading-none font-semibold">Audio Processing Console</span>
                        </div>
                        <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
                            {logs.map((log, li) => (
                                <div key={li} className="flex gap-2">
                                    <span className="text-amber-400 select-none">›</span>
                                    <span className="text-gray-300">{log}</span>
                                </div>
                            ))}
                            {status === 'processing' && (
                                <div className="flex gap-2 animate-pulse">
                                    <span className="text-amber-400 select-none">›</span>
                                    <span className="text-amber-400/50">_</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
              </div>
            </motion.div>
          )}

          {status === 'completed' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center gap-8">
              <div className="w-20 h-20 bg-emerald-500/15 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <FileCheck size={40} className="text-emerald-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-serif font-bold text-white">Splitting Complete!</h3>
                <p className="text-gray-300">Successfully generated {numChunks} audio segments.</p>
              </div>
              <div className="flex w-full gap-4">
                <button onClick={handleDownload} className="flex-1 btn-bazaar-gold py-4 text-lg flex items-center justify-center gap-3">
                  <Download size={22} className="text-[#070a12]" /> Download Segments (.ZIP)
                </button>
                <button onClick={reset} className="btn-bazaar-ghost px-5">
                  <Trash2 className="text-gray-300" />
                </button>
              </div>

              {/* Instructions for NotebookLM */}
              <div className="w-full bg-[#0a0e1a] border border-amber-500/25 rounded-2xl p-6 text-left space-y-4 shadow-xl">
                <h4 className="text-base font-serif font-bold text-amber-300 flex items-center gap-2">
                  <span>NotebookLM Transcription Workflow</span>
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  After downloading the ZIP, extract the segments and upload them to{' '}
                  <a href="https://notebooklm.google.com/notebook/a9d76894-2bed-484e-ac8d-0aa85dde1cd1?addSource=true" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-1 font-bold">
                    NotebookLM <ExternalLink size={12} />
                  </a>
                  . Copy and paste the prompt below to perform verbatim transcription:
                </p>
                
                <div className="relative group">
                  <pre className="bg-[#080b14] p-4 rounded-xl text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-y-auto max-h-60 border border-amber-500/20 custom-scrollbar">
                    {PROMPT_TEXT}
                  </pre>
                  <button 
                    onClick={copyPrompt}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-lg text-xs font-bold text-amber-300 transition-all flex items-center gap-1.5"
                    title="Copy Prompt"
                  >
                    <Copy size={14} />
                    <span>{copied ? "COPIED!" : "COPY PROMPT"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/30">
                <AlertCircle size={32} className="text-rose-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-rose-400">Splitting Failed</h3>
                <p className="text-gray-300">{error || "The processing failed. Please check the file format."}</p>
              </div>
              <button onClick={reset} className="btn-bazaar-ghost">Try Again</button>
            </motion.div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {error && status === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6 p-4 bazaar-card border-rose-500/30 bg-rose-500/10 text-rose-200 flex items-center gap-3"
          >
            <AlertCircle className="text-rose-400" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Transcription
