import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Upload,
  MousePointer2,
  ChevronRight,
  Info,
  TrendingUp,
  XCircle,
  Lightbulb
} from 'lucide-react'

// --- Helper Components ---

const Badge = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#F8DCE8] text-[#243447] text-[10px] font-bold tracking-widest uppercase mb-6 border border-[#E7DDE5]/50">
    {children}
  </span>
)

const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button' }) => {
  const baseStyles = "px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-tight"
  const variants = {
    primary: "bg-[#5F9EA0] hover:bg-[#4F8789] text-white shadow-sm hover:shadow-md",
    secondary: "bg-[#F8DCE8] hover:bg-[#f3c8da] text-[#243447]",
    outline: "border border-[#E7DDE5] hover:border-[#5F9EA0] text-[#243447] hover:bg-white",
    ghost: "text-[#6B7A8C] hover:text-[#243447] hover:bg-[#F8DCE8]/40"
  }
  
  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

const Input = ({ label, type = 'text', value, onChange, placeholder, autoFocus }) => {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type
  
  return (
    <div className="space-y-2 w-full text-left">
      {label && <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B7A8C] ml-1">{label}</label>}
      <div className="relative">
        <input
          autoFocus={autoFocus}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-5 py-3 rounded-2xl border border-[#E7DDE5] focus:border-[#5F9EA0] outline-none transition-all text-sm text-[#243447] placeholder-[#6B7A8C]/30 bg-white"
        />
        {isPassword && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7A8C] hover:text-[#243447]"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}

// --- Main Page Component ---

export default function LandingPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  const openModal = (demo = false) => {
    if (demo) {
      setLoginForm({ email: 'demo@hirelens.app', password: 'hirelens123' })
    } else {
      setLoginForm({ email: '', password: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/analyze')
  }

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="min-h-screen bg-[#FFF7FB] text-[#243447] font-sans selection:bg-[#F8DCE8] selection:text-[#243447] flex flex-col overflow-x-hidden">
      
      {/* 1) NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#FFF7FB]/90 backdrop-blur-md border-b border-[#E7DDE5]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-[#243447]">
            HireLens
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            {['Features', 'How it Works'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-bold uppercase tracking-widest text-[#6B7A8C] hover:text-[#243447] transition-colors">
                {link}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => openModal()} className="hidden sm:flex px-4">Log in</Button>
            <Button onClick={() => openModal()} className="px-5">Try it free</Button>
          </div>
        </div>
      </nav>

      {/* 2) HERO SECTION */}
      <section className="pt-20 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <Badge>Resume screening, simplified</Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-8 tracking-tighter text-[#6E8FA0]">
              Review resumes faster, with clearer hiring insights
            </h1>
            <p className="text-lg text-[#6B7A8C] leading-relaxed mb-10 max-w-lg font-medium">
              Upload a resume and compare it to a job description. Get a clear, grounded breakdown of candidate strengths and skill gaps.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Button onClick={() => openModal()} className="h-14 px-10 text-base">Try the demo</Button>
                <Button variant="outline" className="h-14 px-10 text-base" onClick={() => navigate('/results')}>View sample report</Button>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7A8C]/50 ml-1">
                Demo access available through the login popup.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            {/* Realistic Product Preview Card */}
            <div className="w-full max-w-md bg-white rounded-3xl p-10 border border-[#E7DDE5] shadow-[0_30px_80px_-15px_rgba(36,52,71,0.06)]">
              <div className="flex items-center justify-between mb-10 border-b border-[#E7DDE5]/50 pb-8">
                <div>
                  <h3 className="text-base font-bold text-[#243447]">Software Engineer Report</h3>
                  <p className="text-[10px] text-[#6B7A8C] uppercase tracking-widest font-bold mt-1.5 opacity-60">Candidate Evaluation</p>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-4xl font-bold text-[#5F9EA0] tracking-tighter">82<span className="text-sm text-[#6B7A8C]/30 font-bold tracking-normal ml-0.5">/100</span></div>
                   <div className="text-[9px] font-bold text-[#5F9EA0] uppercase tracking-widest mt-1">Match Score</div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[9px] font-bold text-[#6B7A8C] uppercase tracking-[0.2em] block mb-3">Matched Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript'].map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-lg bg-[#DCEFE8] text-[#243447] text-[10px] font-bold border border-[#E7DDE5]/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#6B7A8C] uppercase tracking-[0.2em] block mb-3">Missing Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {['AWS', 'GraphQL'].map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-lg bg-[#F3DDE2] text-[#243447] text-[10px] font-bold border border-[#E7DDE5]/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF6F2] border border-[#E7DDE5]">
                  <p className="text-[10px] text-[#6B7A8C] uppercase tracking-widest font-bold mb-2">Summary</p>
                  <p className="text-[12px] text-[#243447] leading-relaxed font-semibold italic">
                    "Candidate shows strong frontend alignment but lacks specific cloud infrastructure experience mentioned in the role."
                  </p>
                </div>
                
                <div className="text-[10px] text-[#6B7A8C]/40 font-medium text-center italic">
                  Generated from resume + role description
                </div>
              </div>
            </div>
            
            {/* Subtle decorative tone */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#DCEBED] rounded-full blur-[100px] -z-10 opacity-60" />
          </motion.div>
        </div>
      </section>

      {/* 3) TRUST / VALUE STRIP */}
      <section className="bg-white border-y border-[#E7DDE5] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-10">
          {[
            { icon: <Upload size={16} />, text: "Upload resumes" },
            { icon: <MousePointer2 size={16} />, text: "Compare with job roles" },
            { icon: <AlertCircle size={16} />, text: "Spot missing skills" },
            { icon: <CheckCircle2 size={16} />, text: "Get actionable suggestions" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] border border-[#E7DDE5]/50 flex items-center justify-center text-[#5F9EA0]">
                {item.icon}
              </div>
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#243447]">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4) HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-[#FAF6F2]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-5 tracking-tight text-[#6E8FA0]">How it works</h2>
          <p className="text-[#6B7A8C] text-lg font-medium">A simple, grounded workflow for candidate review</p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Upload a resume', text: 'Add a PDF or image resume to begin the evaluation.' },
            { title: 'Add role details', text: 'Paste the job description to compare the candidate profile.' },
            { title: 'Review the report', text: 'See match score, missing skills, and improvement areas.' }
          ].map((step, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-[#E7DDE5] shadow-sm relative group">
              <div className="text-xl font-bold text-[#F8DCE8] mb-6 opacity-80 group-hover:text-[#5F9EA0] transition-colors duration-500">
                0{i + 1}
              </div>
              <h3 className="text-xl font-bold mb-4 tracking-tight">{step.title}</h3>
              <p className="text-sm text-[#6B7A8C] leading-relaxed font-medium">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5) WHAT'S INSIDE THE REPORT */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-5 tracking-tight text-[#6E8FA0]">What's inside the report</h2>
          <p className="text-[#6B7A8C] text-lg font-medium">A clear breakdown of how the resume matches the role.</p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              title: 'Match score', 
              text: 'See how closely the profile aligns with the role requirements.',
              icon: <TrendingUp size={20} />
            },
            { 
              title: 'Skill gaps', 
              text: 'Spot missing tools, technologies, and role-specific requirements.',
              icon: <XCircle size={20} />
            },
            { 
              title: 'Resume strengths', 
              text: 'Highlight areas where the candidate already fits well.',
              icon: <CheckCircle2 size={20} />
            },
            { 
              title: 'Improvement suggestions', 
              text: 'Get practical suggestions to improve the resume before applying.',
              icon: <Lightbulb size={20} />
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl border border-[#E7DDE5] hover:border-[#5F9EA0]/30 bg-white transition-all duration-300 flex items-start gap-6 group shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6F2] border border-[#E7DDE5] flex items-center justify-center text-[#5F9EA0] shrink-0 group-hover:bg-[#5F9EA0] group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-[#6B7A8C] leading-relaxed font-medium text-sm">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6) FINAL CTA SECTION */}
      <section className="py-24 px-6 bg-[#FAF6F2] border-t border-[#E7DDE5]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight text-[#243447]">Ready to try it?</h2>
          <p className="text-[#6B7A8C] text-lg font-medium mb-10">See how HireLens helps review resumes against real job requirements.</p>
          
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => openModal(true)} className="h-14 px-10 text-base">Start analysis</Button>
              <Button variant="outline" className="h-14 px-10 text-base" onClick={() => openModal()}>Log in</Button>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7A8C]/50">
              Demo access is available through the login popup.
            </p>
          </div>
        </div>
      </section>

      {/* 7) FOOTER */}
      <footer className="py-20 px-6 border-t border-[#E7DDE5] bg-white mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
          <div className="space-y-5">
            <div className="text-2xl font-bold tracking-tight text-[#243447]">HireLens</div>
            <p className="text-sm text-[#6B7A8C] max-w-xs font-medium leading-relaxed">A modern, grounded tool for resume screening and candidate evaluation.</p>
          </div>
          
          <div className="flex flex-wrap gap-x-20 gap-y-10">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-[#243447] uppercase tracking-widest">Product</span>
              <a href="#features" className="text-xs font-bold text-[#6B7A8C] hover:text-[#243447] uppercase tracking-widest transition-colors">Features</a>
              <a href="#how-it-works" className="text-xs font-bold text-[#6B7A8C] hover:text-[#243447] uppercase tracking-widest transition-colors">Workflow</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-[#243447] uppercase tracking-widest">Account</span>
              <button onClick={() => openModal()} className="text-xs font-bold text-[#6B7A8C] hover:text-[#243447] text-left uppercase tracking-widest transition-colors">Log in</button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-10 border-t border-[#E7DDE5] text-center">
          <p className="text-[10px] font-bold text-[#6B7A8C]/20 uppercase tracking-[0.6em] select-none">HireLens 2026 &bull; Designed for People</p>
        </div>
      </footer>

      {/* 8) LOGIN POPUP MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#243447]/20 backdrop-blur-[2px]"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(36,52,71,0.15)] border border-[#E7DDE5] p-12 z-10"
            >
              <button 
                onClick={closeModal}
                className="absolute top-8 right-8 p-2 rounded-full text-[#6B7A8C]/40 hover:bg-[#FAF6F2] hover:text-[#243447] transition-all"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold mb-3 tracking-tighter text-[#243447]">Welcome back</h2>
                <p className="text-sm font-medium text-[#6B7A8C]">Sign in to continue to HireLens</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <Input 
                  autoFocus
                  label="Email address"
                  placeholder="name@company.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                />
                
                <Input 
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />

                <div className="pt-4 flex flex-col gap-4">
                  <Button type="submit" className="w-full h-14 text-base">Log in</Button>
                  <Button 
                    variant="secondary" 
                    className="w-full h-14 text-base" 
                    onClick={() => {
                      setLoginForm({ email: 'demo@hirelens.app', password: 'hirelens123' })
                    }}
                  >
                    Use demo credentials
                  </Button>
                </div>

                <div className="pt-8 border-t border-[#E7DDE5] text-center">
                   <button 
                    type="button"
                    onClick={() => navigate('/analyze')}
                    className="text-[11px] font-bold text-[#5F9EA0] hover:text-[#4F8789] transition-colors uppercase tracking-widest"
                   >
                     Continue without login
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
