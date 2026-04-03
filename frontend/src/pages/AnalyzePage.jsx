import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, FileText, Briefcase, Link, ArrowRight, Loader2 } from 'lucide-react'

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
      setError('Please upload a resume (PDF/Image)')
      return
    }
    
    setError('')
    setLoading(true)
    
    const formData = new FormData()
    formData.append('resume_file', file)
    formData.append('job_desc', jobDesc)
    formData.append('linkedin_url', linkedinUrl)

    try {
      // Backend should be locally running on 10000 or production URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:10000'
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      
      // Store in localStorage and move to results
      localStorage.setItem('hirelens_results', JSON.stringify(data))
      navigate('/results')
      
    } catch (err) {
      setError('Analysis failed: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-panel rounded-3xl p-8 lg:p-12 z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Analyze Profile</h1>
          <p className="text-gray-400">Upload candidate details for instant AI evaluation</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Upload size={16} className="text-indigo-400" /> Resume (PDF or Img) *
            </label>
            <div className="relative group">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-700 hover:border-indigo-400/50 hover:bg-white/5'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <>
                      <FileText className="w-8 h-8 text-indigo-400 mb-2" />
                      <p className="text-sm font-medium text-indigo-300">{file.name}</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-500 mb-2 group-hover:text-indigo-400 transition-colors" />
                      <p className="text-sm text-gray-400">Click to upload or drag & drop</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-400" /> Job Description
            </label>
            <textarea 
              rows={4}
              placeholder="Paste job description here to check text matching..."
              className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans resize-none"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Link size={16} className="text-blue-400" /> LinkedIn Profile URL
            </label>
            <input 
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${loading ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]'}`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                Generate Report <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
