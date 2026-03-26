import React from 'react'
import { Link } from 'react-router-dom'
import { Languages, AudioLines, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function Home() {
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex flex-col items-center justify-center pt-12 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Powerful <span className="gradient-text">Translation</span> <br /> & Transcription
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          High-performance tools for document translation and audio splitting. 
          Built with speed and precision in mind for seamless workflows.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
      >
        <Link to="/translation" className="group">
          <motion.div variants={item} className="glass-card p-10 h-full flex flex-col items-center gap-6 hover:bg-white/10 hover:shadow-2xl hover:shadow-brand-500/10 transition-all border-white/5 hover:border-brand-500/40">
            <div className="bg-brand-500/10 p-6 rounded-3xl group-hover:scale-110 transition-transform">
              <Languages size={48} className="text-brand-400" />
            </div>
            <div className="text-left flex flex-col gap-2 flex-grow">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Document Translation
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="text-gray-400">Translate Vietnamese Word documents (.doc, .docx) to English with formatting preservation.</p>
            </div>
          </motion.div>
        </Link>

        <Link to="/transcription" className="group">
          <motion.div variants={item} className="glass-card p-10 h-full flex flex-col items-center gap-6 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/10 transition-all border-white/5 hover:border-purple-500/40">
            <div className="bg-purple-500/10 p-6 rounded-3xl group-hover:scale-110 transition-transform">
              <AudioLines size={48} className="text-purple-400" />
            </div>
            <div className="text-left flex flex-col gap-2 flex-grow">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-100">
                Audio Transcription
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="text-gray-400 text-purple-200/60">Split large audio files into smaller chunks for easier transcription and processing.</p>
            </div>
          </motion.div>
        </Link>
      </motion.div>

    </div>
  )
}

export default Home
