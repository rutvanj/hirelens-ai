import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, FileText, FileCheck, ShieldCheck, CheckCircle2, 
  Info, AlertCircle, ArrowLeft, Cpu, HelpCircle, Lock, Code2
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [jobDesc, setJobDesc] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('A valid resume file is required for deep-lens analysis.')
      return
    }
    
    setError('')
    setLoading(true)
    
    const formData = new FormData()
    formData.append('resume_file', file)
    formData.append('job_desc', jobDesc)
    formData.append('linkedin_url', linkedinUrl)
    formData.append('github_url', githubUrl)

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:10000'
      console.log(`🧠 Initiating intelligence scan at: ${backendUrl}/analyze`)
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Intelligence engine returned ${response.status}`)
      }

      const data = await response.json()
      localStorage.setItem('hirelens_results', JSON.stringify(data))
      navigate('/results')
      
    } catch (err) {
      setError('Neural scan failed: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-['Inter',sans-serif]">
      
      {/* 1. Navbar Section */}
      <nav className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted hover:text-brand-dark transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white">
               <Cpu size={18} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-brand-dark">HireLens</span>
          </Link>

          <div className="w-24 hidden md:block" /> {/* Spacer */}
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter text-brand-heading mb-3">Start a new analysis</h1>
          <p className="text-lg text-brand-muted font-medium">Upload a resume and add role details to generate a clear, grounded candidate report.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Form Panel (2fr) */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-brand-border p-10 shadow-[0_20px_50px_-20px_rgba(36,52,71,0.05)] rounded-[2rem]" hover={false}>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-8 p-5 rounded-2xl bg-brand-danger/30 border border-brand-border text-brand-dark text-xs font-bold uppercase tracking-wider flex items-center gap-3"
                  >
                    <AlertCircle size={18} className="text-brand-muted" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* File Dropzone */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted flex items-center gap-2">
                    <FileText size={14} /> Resume (PDF or Image)
                  </label>
                  
                  <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[224px] ${
                      file 
                        ? 'border-brand-blue bg-brand-success/10' 
                        : dragActive
                          ? 'border-brand-blue bg-brand-blue/5'
                          : 'border-brand-border bg-brand-warm/30 hover:border-brand-blue/40'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg" 
                      onChange={handleFileChange} 
                    />

                    {file ? (
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-success flex items-center justify-center mb-6 shadow-sm border border-brand-blue/10">
                           <FileCheck size={32} className="text-brand-blue" />
                        </div>
                        <h4 className="text-lg font-bold text-brand-dark mb-1 truncate max-w-xs">{file.name}</h4>
                        <p className="text-[10px] text-brand-blue font-bold uppercase tracking-widest bg-brand-blue/10 px-3 py-1 rounded-full">Document Selected</p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-brand-border shadow-sm flex items-center justify-center mb-6 hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all cursor-pointer">
                           <Upload size={30} />
                        </div>
                        <h4 className="text-md font-bold text-brand-dark mb-1">Click or drag to upload resume</h4>
                        <p className="text-xs text-brand-muted font-medium">PDF, PNG, or JPG formats</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Links & Badge Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input 
                    label="LinkedIn Profile (Optional)" 
                    placeholder="linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="!gap-2"
                  />
                  <Input 
                    label="GitHub Profile/Repo (Optional)" 
                    placeholder="github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="!gap-2"
                  />
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted flex items-center gap-2">
                        <ShieldCheck size={14} /> Verification
                     </span>
                     <div className="bg-brand-warm border border-brand-border rounded-2xl h-full flex items-center px-4 py-3 gap-3">
                        <CheckCircle2 size={16} className="text-brand-blue shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark">Live Intelligence enabled</span>
                     </div>
                  </div>
                </div>

                {/* Job Description Textarea */}
                <Textarea 
                  label="Job Description"
                  placeholder="Paste the role requirements here to compare against the resume..."
                  rows={8}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="!gap-4"
                />

                {/* Submit Area */}
                <div className="space-y-6 pt-4 text-center">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full h-16 text-base"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Analyzing resume...' : 'Generate candidate report'}
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted/60">
                    <Info size={12} /> Processing usually takes 10–15 seconds
                  </div>
                </div>
              </form>
            </Card>
          </div>

          {/* Side Panel (1fr) */}
          <aside className="space-y-8">
             {/* Tips Card */}
             <div className="bg-brand-warm border border-brand-border rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                   <Info size={20} className="text-brand-blue" />
                   <h3 className="text-md font-bold text-brand-dark uppercase tracking-widest text-xs">Tips for submission</h3>
                </div>
                <div className="space-y-8">
                   {[
                     { title: "Use text-based PDFs", text: "Resume analysis is most accurate with standard text-based PDF documents." },
                     { title: "Add a clear JD", text: "The more specific the job description, the more grounded the match score will be." },
                     { title: "LinkedIn integration", text: "Adding a LinkedIn URL allows the report to include confirmed professional history." }
                   ].map((tip, i) => (
                     <div key={i} className="space-y-2">
                        <h4 className="text-sm font-bold text-brand-dark tracking-tight">{tip.title}</h4>
                        <p className="text-sm text-brand-muted leading-relaxed font-medium">{tip.text}</p>
                     </div>
                   ))}
                </div>
             </div>

             {/* Privacy Card */}
             <div className="bg-white border border-brand-border rounded-[2rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                   <Lock size={18} className="text-brand-muted" />
                   <h3 className="text-sm font-bold text-brand-dark">Privacy & Data</h3>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed font-medium">
                  Resumes are processed securely and not used for training models. Data is encrypted and cleared after analysis sessions.
                </p>
             </div>
          </aside>

        </div>
      </main>

    </div>
  )
}
