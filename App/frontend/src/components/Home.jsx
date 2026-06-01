import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Languages, 
  AudioLines, 
  ArrowRight, 
  ArrowRightLeft, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  UploadCloud, 
  Cpu, 
  DownloadCloud,
  FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Home() {
  const [activeManual, setActiveManual] = useState('translation')

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  }

  const manualContent = {
    translation: {
      title: "Document Translation Guide",
      icon: <Languages size={24} className="text-brand-400" />,
      color: "from-brand-500/20 to-transparent",
      accent: "text-brand-400",
      steps: [
        {
          title: "Select Document Files",
          desc: "Supports multiple Word (.docx), PDF (.pdf), or PowerPoint (.pptx, .pptm) files in Vietnamese.",
          icon: <UploadCloud size={20} className="text-brand-400" />
        },
        {
          title: "Select Target Language",
          desc: "Choose English (default) or translate to Vietnamese depending on your source materials.",
          icon: <Cpu size={20} className="text-brand-400" />
        },
        {
          title: "Download or Preview",
          desc: "Watch real-time console status logs. Download your translated files or preview Word documents right in the browser.",
          icon: <DownloadCloud size={20} className="text-brand-400" />
        }
      ],
      tips: [
        "PDF documents are parsed, converted into standard DOCX layouts, and translated natively.",
        "Translation preserves document tables, bullet points, headers, and text formatting."
      ]
    },
    audio: {
      title: "Audio Splitter Guide",
      icon: <AudioLines size={24} className="text-purple-400" />,
      color: "from-purple-500/20 to-transparent",
      accent: "text-purple-400",
      steps: [
        {
          title: "Upload Audio Recording",
          desc: "Choose any large lecture recording or video file (.mp3, .wav, .m4a, or .mp4 format).",
          icon: <UploadCloud size={20} className="text-purple-400" />
        },
        {
          title: "Configure Chunk Duration",
          desc: "Set the desired segment duration in minutes (e.g., 45 minutes is standard to split large lectures).",
          icon: <Cpu size={20} className="text-purple-400" />
        },
        {
          title: "Extract ZIP of Slices",
          desc: "Instantly splits using FFmpeg without audio quality loss, packing the parts into a single ZIP archive.",
          icon: <DownloadCloud size={20} className="text-purple-400" />
        }
      ],
      tips: [
        "FFmpeg extracts audio streams at high speed (usually under 2 seconds) by pre-seeking streams.",
        "Non-MP3 audio or video tracks are automatically recoded to standard MP3 segments."
      ]
    },
    converter: {
      title: "Format Changer Guide",
      icon: <ArrowRightLeft size={24} className="text-indigo-400" />,
      color: "from-indigo-500/20 to-transparent",
      accent: "text-indigo-400",
      steps: [
        {
          title: "Batch Upload Files",
          desc: "Drag and drop one or more files in Markdown (.md), PDF (.pdf), legacy (.doc), or Word (.docx) formats.",
          icon: <UploadCloud size={20} className="text-indigo-400" />
        },
        {
          title: "Choose Target Format",
          desc: "Select the desired format you want to compile into: .pdf, .docx, .doc, or .md.",
          icon: <Cpu size={20} className="text-indigo-400" />
        },
        {
          title: "Convert and Inspect",
          desc: "Run recursive multi-step conversions (e.g., .md -> .docx -> .pdf). Preview generated Markdown output inside a dark console.",
          icon: <DownloadCloud size={20} className="text-indigo-400" />
        }
      ],
      tips: [
        "Converts PDF to DOCX using pdf2docx, and converts DOCX to Markdown using layout-preserving Mammoth AST.",
        "Converts Markdown to beautiful Word documents by parsing structures like bullet points, tables, and lists."
      ]
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center pt-4 pb-12 text-center overflow-visible">
      {/* Fancy Glowing Decorative Background Blobs */}
      <div className="absolute -top-12 left-1/4 w-80 h-80 bg-brand-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Animated Badge pill */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-brand-300 tracking-wider shadow-lg shadow-black/10 hover:border-brand-500/30 transition-all select-none cursor-default"
      >
        <Sparkles size={12} className="animate-spin text-brand-400" style={{ animationDuration: '3s' }} />
        <span>TEACHER UTILITIES V2.0</span>
      </motion.div>

      {/* Hero Title */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          Supercharge Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-purple-400 to-indigo-400">
            Teaching Workflow
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Unlock a premium suite of highly optimized tools for document translation, audio splitting, and 
          multi-format compilation. Simple interfaces, blazing speeds, and gorgeous design.
        </p>
      </motion.div>

      {/* Utilities Interactive Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16"
      >
        {/* Document Translation Card */}
        <Link to="/translation" className="group h-full">
          <motion.div 
            variants={item} 
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-card p-8 h-full flex flex-col items-center gap-6 hover:bg-white/10 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border-white/5 hover:border-brand-500/40 relative overflow-hidden group"
          >
            {/* Hover card border glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 via-brand-500/0 to-brand-500/5 group-hover:to-brand-500/10 transition-all duration-300 pointer-events-none" />
            
            <div className="bg-brand-500/10 p-5 rounded-3xl group-hover:scale-110 group-hover:bg-brand-500/20 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all duration-300">
              <Languages size={40} className="text-brand-400" />
            </div>
            <div className="text-left flex flex-col gap-2 flex-grow relative z-10">
              <h2 className="text-xl font-bold flex items-center justify-between">
                Document Translation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 text-brand-400" />
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Translate large Word, PDF, or PowerPoint documents between Vietnamese and English. Perfect formatting is natively preserved.
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Audio Splitter Card */}
        <Link to="/transcription" className="group h-full">
          <motion.div 
            variants={item} 
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-card p-8 h-full flex flex-col items-center gap-6 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border-white/5 hover:border-purple-500/40 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none" />

            <div className="bg-purple-500/10 p-5 rounded-3xl group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
              <AudioLines size={40} className="text-purple-400" />
            </div>
            <div className="text-left flex flex-col gap-2 flex-grow relative z-10">
              <h2 className="text-xl font-bold flex items-center justify-between text-purple-100">
                Audio Splitter
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 text-purple-400" />
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Slice lecture, meeting, or class audio recordings into exact chunks at lightning speed. Optimized for transcription tools.
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Format Changer Card */}
        <Link to="/format-changer" className="group h-full">
          <motion.div 
            variants={item} 
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-card p-8 h-full flex flex-col items-center gap-6 hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border-white/5 hover:border-indigo-500/40 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-all duration-300 pointer-events-none" />

            <div className="bg-indigo-500/10 p-5 rounded-3xl group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300">
              <ArrowRightLeft size={40} className="text-indigo-400" />
            </div>
            <div className="text-left flex flex-col gap-2 flex-grow relative z-10">
              <h2 className="text-xl font-bold flex items-center justify-between text-indigo-100">
                Format Changer
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 text-indigo-400" />
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Convert your course resources seamlessly between Markdown, PDF, doc, and docx. Built-in instant console previews.
              </p>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Manual tab panel container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-5xl glass-card overflow-hidden text-left shadow-2xl relative border-white/10"
      >
        {/* Top Header section */}
        <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">Utility Instruction Manual</h3>
              <p className="text-xs text-gray-500 mt-0.5">Click the tabs below to explore detailed usage guides and quick tips.</p>
            </div>
          </div>

          {/* Inline Tab buttons */}
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 self-start md:self-auto">
            {Object.keys(manualContent).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setActiveManual(tabKey)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeManual === tabKey
                    ? "bg-white/10 text-white shadow-md shadow-black/10 border border-white/5"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tabKey === 'translation' && <Languages size={14} />}
                {tabKey === 'audio' && <AudioLines size={14} />}
                {tabKey === 'converter' && <ArrowRightLeft size={14} />}
                <span className="capitalize">{tabKey}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content wrapper */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeManual}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left col: Title and steps */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  {manualContent[activeManual].icon}
                  <h4 className="text-xl font-bold text-white">{manualContent[activeManual].title}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {manualContent[activeManual].steps.map((step, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold ${manualContent[activeManual].accent}`}>
                          0{idx + 1}
                        </span>
                        <div className="p-1 rounded bg-white/5">
                          {step.icon}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-sm font-semibold text-white">{step.title}</h5>
                        <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col: Pro tips panel */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/5 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className={manualContent[activeManual].accent} />
                    Expert Pro Tips
                  </h4>
                  <div className="space-y-3">
                    {manualContent[activeManual].tips.map((tip, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <CheckCircle2 size={14} className={`${manualContent[activeManual].accent} mt-0.5 flex-shrink-0`} />
                        <p className="text-xs text-gray-300 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link 
                  to={activeManual === 'translation' ? '/translation' : activeManual === 'audio' ? '/transcription' : '/format-changer'}
                  className={`mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    activeManual === 'translation' 
                      ? 'bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border-brand-500/20 hover:border-brand-500/40' 
                      : activeManual === 'audio'
                        ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20 hover:border-purple-500/40'
                        : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/20 hover:border-indigo-500/40'
                  }`}
                >
                  Open This Utility
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

    </div>
  )
}

export default Home
