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
  Moon,
  ShieldCheck,
  Thermometer,
  SunMedium
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
      icon: <Languages size={24} className="text-amber-300" />,
      color: "from-amber-500/20 to-transparent",
      accent: "text-amber-300",
      borderAccent: "border-amber-500/30",
      btnBg: "bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border-amber-400/30",
      steps: [
        {
          title: "Select Document Files",
          desc: "Supports multiple Word (.docx), PDF (.pdf), or PowerPoint (.pptx, .pptm) files in Vietnamese.",
          icon: <UploadCloud size={20} className="text-amber-300" />
        },
        {
          title: "Select Target Language",
          desc: "Choose English (default) or translate to Vietnamese depending on your source materials.",
          icon: <Cpu size={20} className="text-amber-300" />
        },
        {
          title: "Download or Preview",
          desc: "Watch real-time console status logs. Download your translated files or preview Word documents right in the browser.",
          icon: <DownloadCloud size={20} className="text-amber-300" />
        }
      ],
      tips: [
        "PDF documents are parsed, converted into standard DOCX layouts, and translated natively.",
        "Translation preserves document tables, bullet points, headers, and text formatting."
      ]
    },
    audio: {
      title: "Audio Partitioning Guide",
      icon: <AudioLines size={24} className="text-amber-400" />,
      color: "from-amber-500/20 to-transparent",
      accent: "text-amber-400",
      borderAccent: "border-amber-500/30",
      btnBg: "bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border-amber-400/30",
      steps: [
        {
          title: "Upload Audio Recording",
          desc: "Choose any large lecture recording or video file (.mp3, .wav, .m4a, or .mp4 format).",
          icon: <UploadCloud size={20} className="text-amber-400" />
        },
        {
          title: "Configure Chunk Duration",
          desc: "Set the desired segment duration in minutes (e.g., 45 minutes is standard to split large lectures).",
          icon: <Cpu size={20} className="text-amber-400" />
        },
        {
          title: "Extract ZIP of Slices",
          desc: "Instantly splits using FFmpeg without audio quality loss, packing the parts into a single ZIP archive.",
          icon: <DownloadCloud size={20} className="text-amber-400" />
        }
      ],
      tips: [
        "FFmpeg extracts audio streams at high speed (usually under 2 seconds) by pre-seeking streams.",
        "Non-MP3 audio or video tracks are automatically recoded to standard MP3 segments."
      ]
    },
    converter: {
      title: "Format Converter Guide",
      icon: <ArrowRightLeft size={24} className="text-amber-200" />,
      color: "from-amber-300/20 to-transparent",
      accent: "text-amber-200",
      borderAccent: "border-amber-300/30",
      btnBg: "bg-amber-300/15 hover:bg-amber-300/25 text-amber-100 border-amber-300/30",
      steps: [
        {
          title: "Batch Upload Files",
          desc: "Drag and drop one or more files in Markdown (.md), PDF (.pdf), legacy (.doc), or Word (.docx) formats.",
          icon: <UploadCloud size={20} className="text-amber-200" />
        },
        {
          title: "Choose Target Format",
          desc: "Select the desired format you want to compile into: .pdf, .docx, .doc, or .md.",
          icon: <Cpu size={20} className="text-amber-200" />
        },
        {
          title: "Convert and Inspect",
          desc: "Run recursive multi-step conversions (e.g., .md -> .docx -> .pdf). Preview generated Markdown output inside a dark console.",
          icon: <DownloadCloud size={20} className="text-amber-200" />
        }
      ],
      tips: [
        "Converts PDF to DOCX using pdf2docx, and converts DOCX to Markdown using layout-preserving Mammoth AST.",
        "Converts Markdown to beautiful Word documents by parsing structures like bullet points, tables, and lists."
      ]
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center pt-2 pb-12 text-left overflow-visible">
      {/* Luminance Atmospheric Backdrop Overlay */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#0e1424]/40 via-[#070a12]/80 to-[#070a12] rounded-3xl overflow-hidden pointer-events-none -z-10 border border-amber-500/10 shadow-2xl">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-br from-[#7b9acc]/10 via-[#d4af37]/10 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-5xl px-4 pt-8 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a0e1a]/90 border border-amber-500/30 text-xs font-mono font-semibold text-amber-300 tracking-widest uppercase shadow-md select-none"
        >
          <Moon size={12} className="text-amber-400 fill-amber-400/20" />
          <span>TEACHER UTILITIES — EDUCATOR WORKBENCH</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-6 leading-[1.08] text-white">
            Simplify Teaching. <br />
            <span className="gradient-bazaar-text font-serif italic">
              Ease every daily task.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed font-normal mb-8">
            Teacher Utilities is your high-speed workbench designed to effortlessly streamline document translation, audio partitioning, and format compilation.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-14">
            <Link to="/translation" className="btn-bazaar-gold text-base font-semibold px-8 py-3.5">
              Explore Utilities <ArrowRight size={18} />
            </Link>
            <a href="#manual-section" className="btn-bazaar-ghost text-sm font-medium px-6 py-3.5">
              Learn how it works
            </a>
          </div>

          {/* 3 Attribute Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-amber-500/20 max-w-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-semibold text-sm">
                <ShieldCheck size={16} className="text-amber-400" />
                <span>Format Integrity</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Preserves document tables & styles.
              </p>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-amber-500/20 pt-4 sm:pt-0 sm:pl-6">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-semibold text-sm">
                <Thermometer size={16} className="text-amber-400" />
                <span>Audio Slicing</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Fast FFmpeg duration splitting.
              </p>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-amber-500/20 pt-4 sm:pt-0 sm:pl-6">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-semibold text-sm">
                <SunMedium size={16} className="text-amber-400" />
                <span>Instant Previews</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Live console logs and doc preview.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Utilities Interactive Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16 px-4"
      >
        {/* Document Translation Card */}
        <Link to="/translation" className="group h-full">
          <motion.div 
            variants={item} 
            whileHover={{ y: -5 }}
            className="bazaar-card p-8 h-full flex flex-col items-start gap-6 hover:border-amber-400/50 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-400/30 text-amber-300 group-hover:scale-105 transition-transform">
              <Languages size={32} />
            </div>
            <div className="flex flex-col gap-2 flex-grow relative z-10">
              <h2 className="text-xl font-serif font-bold flex items-center justify-between text-white">
                Document Translation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 text-amber-400" />
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Translate Word, PDF, or PowerPoint files between Vietnamese & English while natively preserving document structures and tables.
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Audio Splitter Card */}
        <Link to="/transcription" className="group h-full">
          <motion.div 
            variants={item} 
            whileHover={{ y: -5 }}
            className="bazaar-card p-8 h-full flex flex-col items-start gap-6 hover:border-amber-400/50 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-400/30 text-amber-400 group-hover:scale-105 transition-transform">
              <AudioLines size={32} />
            </div>
            <div className="flex flex-col gap-2 flex-grow relative z-10">
              <h2 className="text-xl font-serif font-bold flex items-center justify-between text-white">
                Audio Splitter
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 text-amber-400" />
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Partition large audio recordings into duration-based segments at lightning speed. Includes 1-click prompt export for NotebookLM.
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Format Changer Card */}
        <Link to="/format-changer" className="group h-full">
          <motion.div 
            variants={item} 
            whileHover={{ y: -5 }}
            className="bazaar-card p-8 h-full flex flex-col items-start gap-6 hover:border-amber-400/50 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-400/30 text-amber-200 group-hover:scale-105 transition-transform">
              <ArrowRightLeft size={32} />
            </div>
            <div className="flex flex-col gap-2 flex-grow relative z-10">
              <h2 className="text-xl font-serif font-bold flex items-center justify-between text-white">
                Format Changer
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 text-amber-300" />
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Seamlessly convert teaching materials between Markdown, PDF, doc, and docx. Built-in live dark console text preview.
              </p>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Manual tab panel container */}
      <motion.div 
        id="manual-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-5xl bazaar-card overflow-hidden shadow-2xl relative border-amber-500/30 mx-4"
      >
        {/* Top Header section */}
        <div className="p-6 md:p-8 border-b border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0e1a]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#e5c678] to-[#c8a34a] rounded-xl text-[#070a12] shadow-md">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold tracking-tight text-white">Utility Instruction Manual</h3>
              <p className="text-xs text-gray-400 mt-0.5">Click the tabs to explore usage guides and pro tips.</p>
            </div>
          </div>

          {/* Inline Tab buttons */}
          <div className="flex bg-[#070912] rounded-xl p-1.5 border border-amber-500/25 self-start md:self-auto">
            {Object.keys(manualContent).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setActiveManual(tabKey)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeManual === tabKey
                    ? "bg-amber-500/20 text-amber-300 shadow-md border border-amber-400/40"
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
        <div className="p-6 md:p-8 bg-[#111625]">
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
                  <h4 className="text-xl font-serif font-bold text-white">{manualContent[activeManual].title}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {manualContent[activeManual].steps.map((step, idx) => (
                    <div key={idx} className="p-4 bg-[#0a0e1a] rounded-xl border border-amber-500/20 flex flex-col gap-3">
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
                        <p className="text-xs text-gray-300 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col: Pro tips panel */}
              <div className="p-6 rounded-2xl bg-[#0a0e1a] border border-amber-500/20 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
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
                  className={`mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold border transition-all ${manualContent[activeManual].btnBg}`}
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
