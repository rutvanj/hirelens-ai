import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanSearch, Briefcase, Linkedin, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center relative z-10 glass-panel rounded-3xl p-12 lg:p-20"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-indigo-500/30"
        >
          <ScanSearch size={40} className="text-white" />
        </motion.div>
        
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
          HireLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The ultimate intelligent recruiting assistant. Analyze resumes, match job descriptions, and extract LinkedIn insights in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            to="/analyze" 
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-indigo-500 active:scale-95 shadow-[0_0_40px_rgba(79,70,229,0.4)]"
          >
            <span className="flex items-center gap-2">
              Start Analyzing <Zap size={18} className="group-hover:animate-pulse" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-white/10 pt-12">
          <Feature 
            icon={<Briefcase className="text-indigo-400" />} 
            title="Smart Matching" 
            desc="AI-driven score matching between resumes and job descriptions."
          />
          <Feature 
            icon={<ScanSearch className="text-purple-400" />} 
            title="Deep Analysis" 
            desc="Extracts skills, suggests improvements and points out missing keywords."
          />
          <Feature 
            icon={<Linkedin className="text-blue-400" />} 
            title="LinkedIn Enrichment" 
            desc="Automatically fetches extended profile details via Bright Data."
          />
        </div>
      </motion.div>
    </div>
  )
}

function Feature({ icon, title, desc }) {
  return (
    <div className="glass-panel p-6 rounded-2xl hover:bg-white/[0.08] transition-colors">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
