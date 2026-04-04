import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  ChevronLeft,
  FileCheck,
  CheckCircle2,
  Code,
  Globe
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input, Textarea } from '../components/ui/Input'

export default function AnalyzePage() {
  const navigate = useNavigate()
  
  const [jobDesc, setJobDesc] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
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
      setError('A resume file is required to start the analysis.')
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
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000'
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`The evaluation service returned an error (${response.status})`)
      }

      const data = await response.json()
      localStorage.setItem('hirelens_results', JSON.stringify(data))
      localStorage.setItem('hirelens_last_github', githubUrl)
      navigate('/results')
      
    } catch (err) {
      setError('Analysis could not be completed: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF7FB] selection:bg-[#F8DCE8] selection:text-[#243447]">
      
      {/* Top Banner / Back link */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B7A8C] hover:text-[#243447] transition-colors">
          <ChevronLeft size={16} /> Back to home
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        
        {/* Header */}
        <header className="mb-14">
          <h1 className="text-4xl font-bold tracking-tighter text-[#6E8FA0] mb-4">Start a new analysis</h1>
          <p className="text-[#6B7A8C] font-medium text-lg max-w-2xl">
            Upload a resume and add role details to generate a clear, grounded candidate report.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT: FORM AREA */}
          <div className="lg:col-span-2 space-y-8">
            <Card hover={false} className="p-10 border-[#E7DDE5]">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-8 p-4 rounded-xl bg-[#F3DDE2] border border-[#E7DDE5] text-[#243447] text-xs font-bold flex items-center gap-3 overflow-hidden"
                  >
                    <AlertCircle size={16} className="text-[#6B7A8C]" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* 1. Resume Upload */}
                <div className="space-y-4">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B7A8C] ml-1 flex items-center gap-2">
                    <FileText size={14} /> Resume (PDF or Image)
                  </label>
                  
                  <label className={`
                    relative group flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all duration-300
                    ${file ? 'border-[#5F9EA0] bg-[#DCEFE8]/20' : 'border-[#E7DDE5] bg-[#FAF6F2]/50 hover:border-[#5F9EA0]/50 hover:bg-white'}
                  `}>
                    <div className="flex flex-col items-center text-center px-6">
                      {file ? (
                        <div className="animate-in fade-in zoom-in duration-300">
                          <div className="w-16 h-16 rounded-2xl bg-[#DCEFE8] flex items-center justify-center mb-4 mx-auto border border-[#5F9EA0]/20">
                             <FileCheck size={32} className="text-[#5F9EA0]" />
                          </div>
                          <p className="text-sm font-bold text-[#243447] mb-1">{file.name}</p>
                          <p className="text-[10px] text-[#5F9EA0] font-bold uppercase tracking-widest">Document Selected</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-2xl bg-white border border-[#E7DDE5] flex items-center justify-center mb-5 mx-auto group-hover:bg-[#5F9EA0] group-hover:text-white transition-all">
                             <Upload size={28} className="text-[#6B7A8C] group-hover:text-white transition-colors" />
                          </div>
                          <p className="text-sm font-bold text-[#243447] mb-1">Click or drag to upload resume</p>
                          <p className="text-[10px] text-[#6B7A8C] uppercase tracking-widest font-bold opacity-60">PDF, PNG, or JPG formats</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
                  </label>
                </div>

                {/* 2. LinkedIn & GitHub Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input 
                    label="LinkedIn Profile (Optional)" 
                    placeholder="linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    icon={<Globe size={14} />}
                  />
                  <Input 
                    label="GitHub Repository / Profile (Optional)" 
                    placeholder="github.com/username/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    icon={<Code size={14} />}
                  />
                </div>

                <div className="flex flex-col gap-2">
                   <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7A8C] ml-1 flex items-center gap-2">
                      <ShieldCheck size={14} /> Verification
                   </span>
                   <div className="bg-[#FAF6F2] rounded-2xl border border-[#E7DDE5] py-4 px-6">
                      <p className="text-[10px] text-[#6B7A8C] font-bold uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-[#5F9EA0]" /> Live verification enabled
                      </p>
                   </div>
                </div>

                {/* 3. Job Description */}
                <Textarea 
                  label="Job Description"
                  placeholder="Paste the role requirements here to compare against the resume..."
                  rows={8}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />

                {/* Submit Action */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-16 text-base"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? (githubUrl ? 'Analyzing resume & codebase...' : 'Analyzing resume...') : 'Generate candidate report'}
                  </Button>
                  <p className="mt-4 text-[10px] text-[#6B7A8C] font-bold text-center uppercase tracking-widest flex items-center justify-center gap-2">
                    <Info size={12} /> Processing usually takes 10–15 seconds
                  </p>
                </div>
              </form>
            </Card>
          </div>

          {/* RIGHT: CONTEXT PANEL */}
          <aside className="space-y-8">
            <div className="p-8 rounded-[2rem] bg-[#FAF6F2] border border-[#E7DDE5]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#243447] mb-6 flex items-center gap-2">
                <Info size={14} className="text-[#5F9EA0]" /> Tips for submisison
              </h3>
              <ul className="space-y-6">
                {[
                  { title: "Use text-based PDFs", text: "Resume analysis is most accurate with standard text-based PDF documents." },
                  { title: "Add a clear JD", text: "The more specific the job description, the more grounded the match score will be." },
                  { title: "LinkedIn integration", text: "Adding a LinkedIn URL allows the report to include confirmed professional history." }
                ].map((tip, i) => (
                  <li key={i} className="space-y-1.5">
                    <p className="text-xs font-bold text-[#243447] tracking-tight">{tip.title}</p>
                    <p className="text-[12px] leading-relaxed text-[#6B7A8C] font-medium">{tip.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-[2rem] border border-[#E7DDE5] space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7A8C]">Privacy & Data</h3>
              <p className="text-[11px] leading-relaxed text-[#6B7A8C] font-medium italic">
                Resumes are processed securely and not used for training models. Data is encrypted and cleared after analysis sessions.
              </p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}
