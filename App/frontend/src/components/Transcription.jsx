import React, { useState } from 'react'
import axios from 'axios'
import { AudioLines, FileCheck, Loader2, Download, AlertCircle, Trash2, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Transcription() {
  const [file, setFile] = useState(null)
  const [chunkMinutes, setChunkMinutes] = useState(45)
  const [isProcessing, setIsProcessing] = useState(false)
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState('idle') // idle, processing, completed, failed
  const [resultFile, setResultFile] = useState(null)
  const [error, setError] = useState(null)
  const [numChunks, setNumChunks] = useState(0)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase()
      if (['mp3', 'wav', 'm4a'].includes(ext)) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Only audio files (.mp3, .wav, .m4a) are supported.")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)
    setStatus('processing')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('chunk_minutes', chunkMinutes)

    try {
      const res = await axios.post('/api/split-audio', formData)
      setJobId(res.data.job_id)
      setResultFile(res.data.result_file)
      setNumChunks(res.data.num_chunks)
      setStatus('completed')
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed")
      setStatus('failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (resultFile) {
      window.open(`/api/download/${resultFile}`, '_blank')
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
                  accept=".mp3,.wav,.m4a"
                  onChange={handleFileChange} 
                />
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-4 rounded-full ${file ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                    {file ? <FileCheck size={32} /> : <AudioLines size={32} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{file ? file.name : "Select Audio File"}</h3>
                    <p className="text-sm text-gray-500">{file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "Supports .mp3, .wav, .m4a"}</p>
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
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Processing Audio...</h3>
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
