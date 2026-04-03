import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import RadarChart from '../components/RadarChart'

export default function ResultsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const rawData = localStorage.getItem('hirelens_results')
    if (!rawData) {
      navigate('/analyze') // Send back if no data
      return
    }
    
    try {
      setData(JSON.parse(rawData))
    } catch (e) {
      navigate('/analyze')
    }
  }, [navigate])

  if (!data) return null

  // Ensure default structure
  const resumeScore = data.resume_score || 0
  const matchScore = data.match_score || 0
  const skills = data.skills || []
  const missing = data.missing || []
  const linkedin = data.linkedin_profile || null
  const linkedinSkills = data.linkedin_skills || []
  const suggestions = data.linkedin_suggestions || []

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex justify-center pb-20 relative overflow-x-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl w-full z-10 mt-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analysis Results</h1>
            <p className="text-gray-400">Detailed AI evaluation of the candidate</p>
          </div>
          <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-white/5 py-2 px-4 rounded-lg">
             <Home size={18} /> Home
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column (Scores) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Overall Score */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <h2 className="text-lg text-gray-300 font-medium mb-4">Overall Resume Score</h2>
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * resumeScore) / 100} className="text-indigo-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                   <span className="text-4xl font-bold">{resumeScore}</span>
                   <span className="text-gray-400 text-sm block">/ 100</span>
                </div>
              </div>
            </motion.div>

            {/* Match Score */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <h2 className="text-lg text-gray-300 font-medium mb-4">Job Match Score</h2>
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * matchScore) / 100} className="text-purple-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                   <span className="text-4xl font-bold">{matchScore}</span>
                   <span className="text-gray-400 text-sm block">%</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Middle Column (Skills and Charts) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Chart Area */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-3xl p-8 h-[350px]">
              <h2 className="text-lg text-gray-300 font-medium mb-2">Profile Radar</h2>
              <RadarChart skills={skills} missing={missing} />
            </motion.div>

            {/* Skills Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-3xl p-6">
                <h2 className="text-lg text-gray-300 font-medium mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-green-400" size={20} /> Matched Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm">
                      {skill}
                    </span>
                  )) : <p className="text-sm text-gray-500">No matching skills found.</p>}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-3xl p-6">
                <h2 className="text-lg text-gray-300 font-medium mb-4 flex items-center gap-2">
                  <XCircle className="text-red-400" size={20} /> Missing Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {missing.length > 0 ? missing.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm">
                      {skill}
                    </span>
                  )) : <p className="text-sm text-gray-500">No missing skills detected!</p>}
                </div>
              </motion.div>

            </div>

          </div>

          {/* Bottom LinkedIn Row */}
          {linkedin || suggestions.length > 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3 glass-panel rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-blue-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                 </div>
                 <h2 className="text-2xl font-bold">LinkedIn Analysis</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="font-semibold text-gray-300 mb-2">Profile Alignment</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {linkedin ? "Full profile data successfully connected and analyzed." : "Only abstract suggestions generated."}
                    </p>
                    
                    {linkedinSkills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs uppercase text-gray-500 font-bold mb-2 tracking-wider">LinkedIn Skills Found</h4>
                        <div className="flex flex-wrap gap-2">
                           {linkedinSkills.map((s, i) => <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{s}</span>)}
                        </div>
                      </div>
                    )}
                 </div>
                 
                 <div>
                    <h3 className="font-semibold text-gray-300 mb-3">Improvement Suggestions</h3>
                    <ul className="space-y-3">
                       {suggestions.map((sug, i) => (
                         <li key={i} className="flex gap-3 text-sm text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                           <div className="mt-0.5 text-indigo-400">✦</div>
                           {sug}
                         </li>
                       ))}
                       {suggestions.length === 0 && <p className="text-sm text-gray-500">No specific suggestions at this time.</p>}
                    </ul>
                 </div>
              </div>
            </motion.div>
          ) : null}

        </div>

      </div>
    </div>
  )
}
