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
            setLogs([...initialLogs, "Uploading file to server (this may take time for large files)...", "✓ File uploaded successfully.", ...jobData.logs]);
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

  const reset = () => {
    setFile(null)
    setJobId(null)
    setStatus('idle')
    setResultFile(null)
    setError(null)
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-purple-500/10 to-transparent">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 transition-transform transform group-hover:scale-110">
              <AudioLines className="text-purple-400" />
            </div>
            Audio Transcription (Splitting)
          </h2>
          <p className="text-gray-400 mt-2">Split large audio files into smaller duration-based chunks for easier processing.</p>
        </div>

        <div className="p-8 space-y-8">
          {status === 'idle' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* File Dropzone */}
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 ${file ? 'border-purple-500 bg-purple-500/5' : 'border-white/10'}`}
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
                  <div className={`p-4 rounded-full ${file ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                    {file ? <FileCheck size={32} /> : <AudioLines size={32} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{file ? file.name : "Select Audio File"}</h3>
                    <p className="text-sm text-gray-500">{file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "Supports .mp3, .wav, .m4a, .mp4"}</p>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock size={16} /> Chunk Duration (min)
                  </label>
                  <input 
                    type="number" 
                    value={chunkMinutes} 
                    onChange={(e) => setChunkMinutes(e.target.value)}
                    className="w-full input-field border-white/10 text-white"
                    placeholder="e.g., 45"
                  />
                </div>
              </div>

              <button 
                onClick={handleUpload} 
                disabled={!file}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${file ? 'btn-primary bg-purple-600 hover:bg-purple-500 shadow-purple-500/20 hover:shadow-purple-500/40' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'}`}
              >
                Start Splitting
              </button>
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center gap-8">
              <div className="relative">
                 <Loader2 className="animate-spin text-purple-500" size={80} strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-4">
                <div className="space-y-2">
                   <h3 className="text-2xl font-bold">Processing Audio...</h3>
                   <p className="text-gray-400 text-purple-200/60 font-mono text-sm">Elapsed Time: {elapsedTime}s</p>
                </div>
                {isBooting && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-500 text-sm max-w-sm mx-auto">
                      <Loader2 className="animate-spin" size={18} />
                      <p>Server is booting up (cold start from Render), this might take about 1 minute. Please wait...</p>
                  </motion.div>
                )}

                {/* Terminal Log View */}
                {logs.length > 0 && (
                    <div className="w-full max-w-sm mx-auto bg-black/40 rounded-lg p-3 border border-white/5 font-mono text-[10px] leading-relaxed overflow-hidden text-left">
                        <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-1">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                            </div>
                            <span className="text-[8px] text-gray-500 uppercase tracking-widest leading-none">Transcription Console</span>
                        </div>
                        <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
                            {logs.map((log, li) => (
                                <div key={li} className="flex gap-2">
                                    <span className="text-purple-500/50 select-none">›</span>
                                    <span className="text-gray-300">{log}</span>
                                </div>
                            ))}
                            {status === 'processing' && (
                                <div className="flex gap-2 animate-pulse">
                                    <span className="text-purple-400 select-none">›</span>
                                    <span className="text-purple-400/50">_</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <p className="text-gray-400 text-purple-200/60">We are splitting your file. Please wait.</p>
              </div>
            </motion.div>
          )}

          {status === 'completed' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center gap-10">
              <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                <FileCheck size={48} className="text-purple-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-bold">Splitting Complete!</h3>
                <p className="text-gray-400">Generated {numChunks} clips from your original file.</p>
              </div>
              <div className="flex w-full gap-4">
                <button onClick={handleDownload} className="flex-1 btn-primary bg-purple-600 hover:bg-purple-500 shadow-purple-500/20 hover:shadow-purple-500/40 py-4 text-xl flex items-center justify-center gap-3">
                  <Download size={24} /> Download (.ZIP)
                </button>
                <button onClick={reset} className="btn-secondary px-6">
                  <Trash2 className="text-gray-400" />
                </button>
              </div>

              {/* Instructions for NotebookLM */}
              <div className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-6 text-left space-y-4">
                <h4 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                  <span>Transcription Instructions</span>
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  After downloading the zip, unzip the files, paste on to{' '}
                  <a href="https://notebooklm.google.com/notebook/a9d76894-2bed-484e-ac8d-0aa85dde1cd1?addSource=true" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold">
                    NotebookLM <ExternalLink size={14} />
                  </a>
                  {' '}and Paste the prompt to start transcription:
                </p>
                
                <div className="relative group">
                  <pre className="bg-black/50 p-4 rounded-lg text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-y-auto max-h-60 border border-white/10 custom-scrollbar">
                    {PROMPT_TEXT}
                  </pre>
                  <button 
                    onClick={() => navigator.clipboard.writeText(PROMPT_TEXT)}
                    className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy Prompt"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-red-500">Splitting Failed</h3>
                <p className="text-gray-400">{error || "The processing failed. Please check the file format."}</p>
              </div>
              <button onClick={reset} className="btn-secondary">Try Again</button>
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
            className="mt-6 p-4 glass-card border-red-500/20 bg-red-500/5 text-red-100 flex items-center gap-3"
          >
            <AlertCircle className="text-red-400" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Transcription
