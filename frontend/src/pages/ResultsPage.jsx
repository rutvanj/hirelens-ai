import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, CheckCircle2, XCircle, Lightbulb, BookOpen, Briefcase, TrendingUp, Zap } from 'lucide-react'
import RadarChart from '../components/RadarChart'
import LinkedInProfile from '../components/LinkedInProfile'

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
  console.log('--- HireLens Performance Report ---', data)
  console.log('ATS Score:', data.final_score)

  // Ensure default structure
  const matchScore = data.match_score || 0
  const skills = data.skills || []
  const missing = data.missing || []
  const linkedin = data.linkedin_profile || null
  const linkedinRawData = data.linkedin_raw_data || null
  const linkedinSkills = data.linkedin_skills || []
  const suggestions = data.linkedin_suggestions || []
  const aiSuggestions = data.ai_suggestions || { resume_tips: [], skills_to_learn: [] }
  const jobRole = data.job_role || ''
  const jobSeniority = data.job_seniority || ''
  const niceToHave = data.nice_to_have || []
  const aiInsights = data.ai_insights || { hiring_probability: 0, reasoning: '', confidence: 50 }
  const careerPaths = data.career_paths || { jobs_now: [], jobs_after_learning: [] }
  const hiringProb = aiInsights.hiring_probability || 0
  const confidence = aiInsights.confidence ?? 50
  const finalScore = data.final_score ?? Math.round((0.7 * matchScore) + (0.3 * hiringProb))
  const hiringColor = hiringProb >= 75 ? 'text-green-400' : hiringProb >= 50 ? 'text-yellow-400' : 'text-red-400'
  const hiringStroke = hiringProb >= 75 ? 'text-green-500' : hiringProb >= 50 ? 'text-yellow-500' : 'text-red-500'
  const finalColor = finalScore >= 75 ? 'text-green-400' : finalScore >= 50 ? 'text-yellow-400' : 'text-red-400'
  const finalStroke = finalScore >= 75 ? 'text-green-500' : finalScore >= 50 ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex justify-center pb-20 relative overflow-x-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl w-full z-10 mt-10">
        
        {/* Main Header & Hero Score */}
        <div className="space-y-8 mb-12">
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Analysis Results</h1>
              <p className="text-gray-400 mt-1">Detailed AI evaluation of candidate fit and hiring potential</p>
              {jobRole && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-full">
                    <Briefcase size={12} /> {jobRole}
                  </span>
                  {jobSeniority && (
                    <span className="text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-full capitalize">
                      {jobSeniority}
                    </span>
                  )}
                </div>
              )}
            </div>
            <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-white/5 py-2.5 px-5 rounded-xl border border-white/5">
               <Home size={18} /> Home
            </Link>
          </div>

          {/* HERO: ATS Score — Full Width */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="glass-panel rounded-[2rem] p-10 text-center flex flex-col md:flex-row items-center justify-between border border-indigo-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-transparent to-purple-600/10 pointer-events-none" />
            
            <div className="text-left mb-8 md:mb-0 md:max-w-md z-10">
              <h2 className="text-sm font-bold tracking-[0.2em] text-indigo-400 uppercase mb-1 drop-shadow-sm">ATS Score</h2>
              <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">AI-evaluated Applicant Tracking Score</p>
              <p className="text-gray-300 text-lg leading-relaxed font-medium">
                Our hybrid algorithm evaluates both technical skill alignment and overall hiring probability to give you a definitive suitability rating.
              </p>
              <div className="mt-6 flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span>Based on 70% job match and 30% hiring intelligence</span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <span className="text-xs font-bold text-indigo-400 mb-2 tracking-[0.3em] uppercase">ATS</span>
              <div className="relative">
                <svg className="w-56 h-56 transform -rotate-90">
                  <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
                  <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray="628"
                    strokeDashoffset={628 - (628 * finalScore) / 100}
                    className={`${finalStroke} transition-all duration-1000 ease-out`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className={`text-6xl font-bold ${finalColor}`}>{finalScore}</span>
                  <span className="text-gray-400 text-base block mt-1 font-medium">/ 100</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column (Scores) */}
          <div className="lg:col-span-1 space-y-6">

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

            {/* Hiring Probability */}
            {hiringProb > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                <h2 className="text-lg text-gray-300 font-medium mb-4 flex items-center gap-2 justify-center">
                  <TrendingUp size={18} className="text-indigo-400" /> Hiring Probability
                </h2>
                <div className="relative mb-4">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                    <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent"
                      strokeDasharray="390"
                      strokeDashoffset={390 - (390 * hiringProb) / 100}
                      className={`${hiringStroke} transition-all duration-1000 ease-out`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className={`text-3xl font-bold ${hiringColor}`}>{hiringProb}%</span>
                  </div>
                </div>
                {aiInsights.reasoning && (
                  <p className="text-xs text-gray-400 leading-relaxed text-center">{aiInsights.reasoning}</p>
                )}
                {/* Confidence Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${confidence}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">Confidence {confidence}%</span>
                </div>
              </motion.div>
            )}

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

          {/* AI Suggestions */}
          {(aiSuggestions.resume_tips?.length > 0 || aiSuggestions.skills_to_learn?.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiSuggestions.resume_tips?.length > 0 && (
                <div className="glass-panel rounded-3xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="text-yellow-400" size={20} /> Resume Tips
                  </h2>
                  <ul className="space-y-3">
                    {aiSuggestions.resume_tips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-yellow-400 mt-0.5 shrink-0">✦</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {aiSuggestions.skills_to_learn?.length > 0 && (
                <div className="glass-panel rounded-3xl p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="text-blue-400" size={20} /> Skills to Learn
                  </h2>
                  <ul className="space-y-3">
                    {aiSuggestions.skills_to_learn.map((skill, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-blue-400 mt-0.5 shrink-0">→</span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Career Paths */}
          {(careerPaths.jobs_now?.length > 0 || careerPaths.jobs_after_learning?.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-3 border-t border-white/10 pt-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="text-indigo-400" size={24} /> Career Intelligence
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Jobs Now */}
                {careerPaths.jobs_now?.length > 0 && (
                  <div className="glass-panel rounded-3xl p-6">
                    <h3 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} /> Jobs You Can Apply Now
                    </h3>
                    <div className="space-y-3">
                      {careerPaths.jobs_now.map((job, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-green-500/20 transition-colors">
                          <div className="font-semibold text-white text-sm">{job.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{job.match_reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jobs After Learning */}
                {careerPaths.jobs_after_learning?.length > 0 && (
                  <div className="glass-panel rounded-3xl p-6">
                    <h3 className="font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                      <TrendingUp size={18} /> Jobs After Upskilling
                    </h3>
                    <div className="space-y-3">
                      {careerPaths.jobs_after_learning.map((job, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white text-sm">{job.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              job.potential === 'High' ? 'bg-green-500/20 text-green-400' :
                              job.potential === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>{job.potential}</span>
                          </div>
                          {job.skills_needed?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.skills_needed.map((s, j) => (
                                <span key={j} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* Comprehensive LinkedIn Profile Component */}
          {(linkedinRawData || data.linkedin_error) ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-3 mt-12 w-full border-t border-white/10 pt-12">
               <div className="text-center mb-8">
                 <h2 className="text-3xl font-bold">Deep LinkedIn Insights</h2>
                 <p className="text-gray-400">Powered by Bright Data</p>
               </div>
               <LinkedInProfile data={linkedinRawData} error={data.linkedin_error} loading={false} injectedSkills={linkedinSkills.length > 0 ? linkedinSkills : skills} />
            </motion.div>
          ) : (
            // Only show suggestions if there's no full raw profile but we have suggestions somehow
            suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-3 glass-panel rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Suggestions</h2>
                <ul className="space-y-3">
                   {suggestions.map((sug, i) => (
                     <li key={i} className="flex gap-3 text-sm text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                       <div className="mt-0.5 text-indigo-400">✦</div>
                       {sug}
                     </li>
                   ))}
                </ul>
              </motion.div>
            )
          )}

        </div>

      </div>
    </div>
  )
}
