import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ScanSearch, Briefcase, Link as LinkIcon, Zap, Target, Cpu } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-dark text-white relative overflow-hidden">
      
      {/* Subtle brand glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-blue/5 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-8 backdrop-blur-md"
          >
            <Cpu size={14} /> The Future of Intelligent Recruiting
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl lg:text-8xl font-bold mb-8 tracking-tighter text-glow"
          >
            HireLens AI
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-brand-light-gray mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            A premium, high-performance intelligence engine for modern talent teams. 
            Decode resumes, verify LinkedIn presence, and predict hiring success with precision.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/analyze">
              <Button variant="primary" className="h-16 px-10 text-base">
                Start Analyzing <Zap size={20} fill="currentColor" />
              </Button>
            </Link>
            <Button variant="outline" className="h-16 px-10 text-base">
              View Demo
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card delay={0.4}>
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 text-brand-blue">
              <Target size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Hybrid ATS Core</h3>
            <p className="text-brand-light-gray leading-relaxed">
              Proprietary 70/30 matching algorithm blending technical skill alignment with absolute hiring probability.
            </p>
          </Card>

          <Card delay={0.5}>
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 text-brand-blue">
              <LinkIcon size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">LinkedIn OSINT</h3>
            <p className="text-brand-light-gray leading-relaxed">
              Automated enrichment mapping candidate presence against industry benchmarks via Bright Data integration.
            </p>
          </Card>

          <Card delay={0.6}>
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 text-brand-blue">
              <Cpu size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Semantic Engine</h3>
            <p className="text-brand-light-gray leading-relaxed">
              Deep-lens Llama 3 intelligence that normalizes diverse skillsets for unbiased, standard evaluations.
            </p>
          </Card>
        </div>
      </div>

      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">
        HireLens Intelligence Platform &copy; 2026 — Built for Hackathon Demo
      </footer>
    </div>
  )
}
