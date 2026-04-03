import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Briefcase, Link as LinkIcon, ArrowRight, Loader2, ShieldCheck, Cpu } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'

export default function AnalyzePage() {
  const navigate = useNavigate()
  
  const [jobDesc, setJobDesc] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [file, setFile] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000'
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
    <div className="min-h-screen bg-brand-dark p-6 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background illumination */}
      <div className="absolute top-1/4 left-1/4 w-[800px] h-[500px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="w-full max-w-3xl z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[9px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4">
            <ShieldCheck size={12} /> Secure Intelligence Processing
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Profile Intelligence Scan</h1>
          <p className="text-brand-light-gray font-medium">Initialize candidate evaluation via resume, LinkedIn, and job requirements.</p>
        </motion.div>

        <Card className="border-white/10" hover={false}>
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Area */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue ml-1 flex items-center gap-2">
                <FileText size={12} /> Primary Source Document (PDF/IMG)
              </label>
              
              <div className="relative group">
                <label 
                  className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                    file 
                      ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_20px_rgba(125,211,252,0.1)]' 
                      : 'border-white/10 bg-brand-gray hover:border-brand-blue/40 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <motion.div 
                        initial={{ scale: 0.8 }} 
                        animate={{ scale: 1 }} 
                        className="text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4 mx-auto border border-brand-blue/20">
                           <ShieldCheck size={32} className="text-brand-blue" />
                        </div>
                        <p className="text-sm font-bold text-white mb-1">{file.name}</p>
                        <p className="text-[10px] text-brand-blue font-bold uppercase tracking-widest">Ready for extraction</p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 mx-auto border border-white/10 group-hover:border-brand-blue/30 transition-all">
                           <Upload className="w-7 h-7 text-gray-500 group-hover:text-brand-blue transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-white mb-1">Upload Resume</p>
                        <p className="text-[10px] text-brand-light-gray uppercase tracking-widest font-semibold">Drop file or click to browse</p>
                      </div>
                    )}
                  </div>
                  <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="LinkedIn Verification" 
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                name="linkedin"
              />
              <div className="flex flex-col gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-blue ml-1 flex items-center gap-2">
                    <ShieldCheck size={12} /> OSINT Protocol
                 </span>
                 <div className="bg-white/5 rounded-xl border border-white/10 h-full flex items-center px-4">
                    <p className="text-[10px] text-brand-light-gray font-medium">Bright Data Real-time Scan Enabled</p>
                 </div>
              </div>
            </div>

            <Textarea 
              label="Target Job Intelligence (JD)"
              placeholder="Paste job description to calibrate AI matching algorithms..."
              rows={5}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />

            <Button 
              type="submit" 
              variant="accent" 
              className="w-full h-16 text-base"
              loading={loading}
            >
              {loading ? (
                <>Neural Scan In Progress...</>
              ) : (
                 <>Execute Analysis <ArrowRight size={20} /></>
              )}
            </Button>
          </form>
        </Card>
        
        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
             <Cpu size={14} /> Llama 3 Core
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
             <ShieldCheck size={14} /> PII Encrypted
          </div>
        </div>
      </div>
    </div>
  )
}
