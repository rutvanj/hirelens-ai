import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ScanSearch, Briefcase, Link as LinkIcon, Zap, Target, Cpu, 
  Upload, MousePointer2, AlertCircle, CheckCircle2, TrendingUp, XCircle, Lightbulb, ChevronRight, Menu, X
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { LoginModal } from '../components/LoginModal'
import { ProductPreviewCard } from '../components/ProductPreviewCard'

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg font-['Inter',sans-serif] text-brand-dark overflow-x-hidden">
      
      {/* 1. Navbar Section */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
          scrolled ? 'bg-brand-bg/80 backdrop-blur-md h-20 border-brand-border shadow-sm' : 'h-24'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white shadow-lg">
               <Cpu size={18} />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-brand-dark">HireLens</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'How it Works'].map((link) => (
              <button 
                key={link}
                onClick={() => scrollToSection(link.toLowerCase().replace(/\s+/g, '-'))}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted hover:text-brand-blue transition-colors"
              >
                {link}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
             <Button variant="ghost" className="h-11 px-6 px-12" onClick={() => setIsLoginOpen(true)}>Log in</Button>
             <Button variant="primary" className="h-11 px-8 px-12" onClick={() => setIsLoginOpen(true)}>Try it free</Button>
          </div>

          <button className="md:hidden text-brand-dark" onClick={() => setIsMenuOpen(!isMenuOpen)}>
             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 bg-white p-6 border-b border-brand-border md:hidden"
          >
             <div className="flex flex-col gap-6">
                {['Features', 'How it Works'].map((link) => (
                  <button 
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase().replace(/\s+/g, '-'))}
                    className="text-sm font-bold uppercase tracking-widest text-brand-dark text-left"
                  >
                    {link}
                  </button>
                ))}
                <div className="flex flex-col gap-4 pt-4 border-t border-brand-border">
                   <Button variant="outline" onClick={() => setIsLoginOpen(true)}>Log in</Button>
                   <Button variant="primary" onClick={() => setIsLoginOpen(true)}>Try it free</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-32">
        {/* 2. Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-pink border border-brand-border text-[9px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-8">
                Resume screening, simplified
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-brand-heading leading-[0.95] mb-8">
                 Review resumes faster, <br /> with clearer hiring insights
              </h1>
              <p className="text-lg md:text-xl text-brand-muted leading-relaxed font-medium mb-10 max-w-xl">
                 Upload a resume and compare it to a job description. Get a clear, grounded breakdown of candidate strengths and skill gaps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                 <Button variant="primary" className="h-14 px-10 text-base" onClick={() => setIsLoginOpen(true)}>Try the demo</Button>
                 <Button variant="outline" className="h-14 px-10 text-base" onClick={() => setIsLoginOpen(true)}>View sample report</Button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted/40">Demo access available through the login popup.</p>
            </motion.div>

            <div className="flex justify-center lg:justify-end">
               <ProductPreviewCard />
            </div>
          </div>
        </section>

        {/* 3. Trust Strip Section */}
        <section className="bg-white border-y border-brand-border py-12 mb-32">
          <div className="max-w-7xl mx-auto px-6">
             <div className="flex flex-wrap justify-between items-center gap-8 md:gap-12">
                {[
                  { icon: Upload, text: "Upload resumes" },
                  { icon: MousePointer2, text: "Compare with job roles" },
                  { icon: AlertCircle, text: "Spot missing skills" },
                  { icon: CheckCircle2, text: "Get actionable suggestions" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-xl bg-brand-warm flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:scale-110">
                        <item.icon size={20} />
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark">{item.text}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 4. How it Works Section */}
        <section id="how-it-works" className="bg-brand-warm py-32 mb-32 border-y border-brand-border">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-20">
                <h2 className="text-4xl font-bold tracking-tighter text-brand-heading mb-4">How it works</h2>
                <p className="text-brand-muted font-medium">A simple, grounded workflow for candidate review</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: "01", title: "Upload a resume", text: "Add a PDF or image resume to begin the evaluation." },
                  { step: "02", title: "Add role details", text: "Paste the job description to compare the candidate profile." },
                  { step: "03", title: "Review the report", text: "See match score, missing skills, and improvement areas." }
                ].map((card, i) => (
                  <Card key={i} delay={i * 0.1} hover={true} className="bg-white p-10 border-brand-border flex flex-col items-start shadow-sm">
                     <div className="text-4xl font-black text-brand-pink/50 transition-colors group-hover:text-brand-blue mb-6">{card.step}</div>
                     <h3 className="text-xl font-bold text-brand-dark mb-4">{card.title}</h3>
                     <p className="text-brand-muted leading-relaxed font-medium">{card.text}</p>
                  </Card>
                ))}
             </div>
          </div>
        </section>

        {/* 5. Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32 mb-32">
           <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
              <div className="lg:max-w-xl">
                 <h2 className="text-4xl font-bold tracking-tighter text-brand-heading mb-6">What's inside the report</h2>
                 <p className="text-lg text-brand-muted font-medium">A clear breakdown of how the resume matches the role.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: TrendingUp, title: "Match score", text: "See how closely the profile aligns with the role requirements." },
                { icon: XCircle, title: "Skill gaps", text: "Spot missing tools, technologies, and role-specific requirements." },
                { icon: CheckCircle2, title: "Resume strengths", text: "Highlight areas where the candidate already fits well." },
                { icon: Lightbulb, title: "Improvement suggestions", text: "Get practical suggestions to improve the resume before applying." }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-[2rem] border border-brand-border bg-white hover:border-brand-blue transition-all duration-300">
                   <div className="w-14 h-14 rounded-2xl bg-brand-warm flex items-center justify-center text-brand-blue mb-8 group-hover:bg-brand-blue group-hover:text-white transition-all transform group-hover:rotate-6">
                      <feature.icon size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                   <p className="text-brand-muted leading-relaxed font-medium">{feature.text}</p>
                </div>
              ))}
           </div>
        </section>

        {/* 6. CTA Section */}
        <section className="bg-brand-warm border-y border-brand-border py-40">
           <div className="max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-brand-dark mb-8">Ready to try it?</h2>
              <p className="text-xl text-brand-muted font-medium mb-12">See how HireLens helps review resumes against real job requirements.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button variant="primary" className="h-14 px-12 text-base" onClick={() => setIsLoginOpen(true)}>Start analysis</Button>
                 <Button variant="outline" className="h-14 px-12 text-base" onClick={() => setIsLoginOpen(true)}>Log in</Button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted group-hover:text-brand-dark mt-8 transition-colors">Demo access is available through the login popup.</p>
           </div>
        </section>

      </main>

      {/* 7. Footer Section */}
      <footer className="bg-white border-t border-brand-border pt-32 pb-20">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
               <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white">
                        <Cpu size={18} />
                     </div>
                     <span className="text-2xl font-bold tracking-tighter text-brand-dark">HireLens</span>
                  </div>
                  <p className="text-brand-muted font-medium max-w-sm">A modern, grounded tool for resume screening and candidate evaluation.</p>
               </div>
               
               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-8">Product</h4>
                  <ul className="space-y-4">
                     {['Features', 'Workflow'].map(link => (
                        <li key={link}><button onClick={() => scrollToSection(link.toLowerCase().replace(/\s+/g, '-'))} className="text-sm font-medium text-brand-muted hover:text-brand-blue transition-colors">{link}</button></li>
                     ))}
                  </ul>
               </div>

               <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark mb-8">Account</h4>
                  <ul className="space-y-4">
                     <li><button onClick={() => setIsLoginOpen(true)} className="text-sm font-medium text-brand-muted hover:text-brand-blue transition-colors">Log in</button></li>
                  </ul>
               </div>
            </div>

            <div className="text-center pt-12 border-t border-brand-border">
               <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-muted group-hover:text-brand-dark transition-colors">HireLens 2026 &bull; Designed for People</p>
            </div>
         </div>
      </footer>

      {/* 8. Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </div>
  )
}
