import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, CheckCircle2, XCircle, Lightbulb, BookOpen, Briefcase, TrendingUp, Zap, Cpu, ShieldCheck } from 'lucide-react'
import RadarChart from '../components/RadarChart'
import LinkedInProfile from '../components/LinkedInProfile'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export default function ResultsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const rawData = localStorage.getItem('hirelens_results')
    if (!rawData) {
      navigate('/analyze')
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

  const matchScore = data.match_score || 0
  const skills = data.skills || []
  const missing = data.missing || []
  const linkedinRawData = data.linkedin_raw_data || null
  const linkedinSkills = data.linkedin_skills || []
  const suggestions = data.linkedin_suggestions || []
  const aiSuggestions = data.ai_suggestions || { resume_tips: [], skills_to_learn: [] }
  const jobRole = data.job_role || ''
  const jobSeniority = data.job_seniority || ''
  const aiInsights = data.ai_insights || { hiring_probability: 0, reasoning: '', confidence: 50 }
  const careerPaths = data.career_paths || { jobs_now: [], jobs_after_learning: [] }
  const hiringProb = aiInsights.hiring_probability || 0
  const confidence = aiInsights.confidence ?? 50
  const finalScore = data.final_score ?? Math.round((0.7 * matchScore) + (0.3 * hiringProb))
  
  const finalStroke = 'text-brand-blue'
  const finalColor = 'text-brand-blue'

  return (
    <div className="min-h-screen bg-brand-dark p-6 flex justify-center pb-20 relative overflow-x-hidden">
      
      {/* Background illumination */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-6xl w-full z-10 mt-10">
        
        {/* Main Header & Hero Score */}
        <div className="space-y-8 mb-12">
          
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-white/5 bg-white/5 text-[9px] font-bold uppercase tracking-[0.3em] text-brand-blue mb-4">
                <ShieldCheck size={12} /> Analysis Complete
              </div>
              <h1 className="text-5xl font-bold tracking-tighter text-white">Performance Report</h1>
              <p className="text-brand-light-gray mt-2 font-medium">Deep-lens evaluation of candidate fit and job intelligence.</p>
              
              {jobRole && (
                <div className="flex flex-wrap items-center gap-2 mt-6">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-4 py-2 rounded-xl">
                    <Briefcase size={12} /> {jobRole}
                  </span>
                  {jobSeniority && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 text-white/60 border border-white/10 px-4 py-2 rounded-xl">
                      {jobSeniority}
                    </span>
                  )}
                </div>
              )}
            </div>
            <Link to="/">
              <Button variant="outline" className="h-12 px-6">
                <Home size={18} /> Exit Report
              </Button>
            </Link>
          </div>

          {/* HERO: ATS Score — Full Width */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass-panel rounded-[2.5rem] p-6 md:p-12 text-center flex flex-col md:flex-row items-center justify-between border border-brand-blue/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="text-left mb-8 md:mb-0 md:max-w-lg z-10">
              <h2 className="text-sm font-bold tracking-[0.3em] text-brand-blue uppercase mb-2">ATS Score</h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">AI-evaluated Applicant Tracking Score</p>
              <p className="text-white text-2xl leading-tight font-bold mb-6">
                Our hybrid algorithm evaluated a <span className="text-brand-blue">{finalScore}%</span> suitability rating based on technical alignment and hiring intelligence.
              </p>
              <div className="flex items-center gap-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-2"><Cpu size={14} /> 70% Job Match</span>
                 <span className="w-1 h-1 bg-white/10 rounded-full" />
                 <span className="flex items-center gap-2"><ShieldCheck size={14} /> 30% Hiring AI</span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <svg className="w-64 h-64 transform -rotate-90">
                  <circle cx="128" cy="128" r="115" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="128" cy="128" r="115" stroke="currentColor" strokeWidth="14" fill="transparent"
                    strokeDasharray="722"
                    initial={{ strokeDashoffset: 722 }}
                    animate={{ strokeDashoffset: 722 - (722 * finalScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`${finalStroke} drop-shadow-[0_0_15px_rgba(125,211,252,0.4)]`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className={`text-7xl font-bold tracking-tighter ${finalColor}`}>{finalScore}</span>
                  <span className="text-white/20 text-lg block font-bold uppercase tracking-widest">/ 100</span>
                </div>
              </div>
              <span className="mt-4 text-[10px] font-bold text-brand-blue uppercase tracking-[0.4em]">Suitability</span>
            </div>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column (Scores) */}
          <div className="lg:col-span-1 space-y-8">

            {/* Match Score */}
            <Card className="text-center" delay={0.1}>
              <h2 className="text-[10px] font-bold text-brand-light-gray uppercase tracking-[0.3em] mb-8">Technical Alignment</h2>
              <div className="relative inline-block mb-6">
                <svg className="w-44 h-44 transform -rotate-90">
                  <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="10" fill="transparent" 
                    strokeDasharray="490" 
                    initial={{ strokeDashoffset: 490 }}
                    animate={{ strokeDashoffset: 490 - (490 * matchScore) / 100 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                   <span className="text-5xl font-bold tracking-tighter text-white">{matchScore}</span>
                   <span className="text-white/30 text-[10px] block font-bold uppercase tracking-widest mt-1">% Match</span>
                </div>
              </div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Job Description Text Matching</p>
            </Card>

            {/* Hiring Probability */}
            <Card className="text-center border-brand-blue/10" delay={0.2}>
              <h2 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em] mb-8 flex items-center gap-2 justify-center">
                <TrendingUp size={14} /> Hiring Intelligence
              </h2>
              <div className="relative inline-block mb-8">
                <div className="text-6xl font-bold tracking-tighter text-brand-blue mb-2">{hiringProb}%</div>
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Success Probability</div>
              </div>
              
              {aiInsights.reasoning && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left mb-6">
                   <p className="text-xs text-brand-light-gray leading-relaxed font-medium italic">"{aiInsights.reasoning}"</p>
                </div>
              )}
              
              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-white/30">
                   <span>AI Confidence</span>
                   <span>{confidence}%</span>
                </div>
                <div className="bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${confidence}%` }}
                     transition={{ duration: 1, delay: 0.5 }}
                     className="h-full bg-brand-blue" 
                   />
                </div>
              </div>
            </Card>

          </div>

          {/* Middle/Right Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Area */}
            <Card delay={0.3} className="h-[400px]">
              <h2 className="text-[10px] font-bold text-brand-light-gray uppercase tracking-[0.3em] mb-6">Semantic Profile Radar</h2>
              <div className="h-[300px] w-full">
                 <RadarChart skills={skills} missing={missing} />
              </div>
            </Card>

            {/* Skills Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card delay={0.4} className="border-white/5">
                <h2 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <CheckCircle2 size={14} /> Intelligence Match
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {skill}
                    </span>
                  )) : <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Zero matches found</p>}
                </div>
              </Card>

              <Card delay={0.5} className="border-white/5">
                <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <XCircle size={14} /> Gap Analysis
                </h2>
                <div className="flex flex-wrap gap-2">
                  {missing.length > 0 ? missing.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white/5 text-white/60 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {skill}
                    </span>
                  )) : <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">No skill gaps detected</p>}
                </div>
              </Card>
            </div>
          </div>

          {/* Suggestions Layer */}
          {(aiSuggestions.resume_tips?.length > 0 || aiSuggestions.skills_to_learn?.length > 0) && (
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card delay={0.6}>
                  <h2 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <Lightbulb size={14} /> Strategic Resume Tips
                  </h2>
                  <div className="space-y-4">
                     {aiSuggestions.resume_tips.map((tip, i) => (
                       <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-6 h-6 rounded-lg bg-brand-blue/10 flex items-center justify-center shrink-0 border border-brand-blue/20 text-brand-blue font-bold text-[10px]">!</div>
                          <p className="text-sm text-brand-light-gray font-medium leading-relaxed">{tip}</p>
                       </div>
                     ))}
                  </div>
               </Card>
               <Card delay={0.7}>
                  <h2 className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <BookOpen size={14} /> Upskilling Roadmap
                  </h2>
                  <div className="space-y-4">
                     {aiSuggestions.skills_to_learn.map((skill, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <span className="text-sm text-white font-bold tracking-tight">{skill}</span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-brand-blue">Recommended</span>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
          )}

          {/* Career Path Intelligence */}
          {(careerPaths.jobs_now?.length > 0 || careerPaths.jobs_after_learning?.length > 0) && (
            <div className="lg:col-span-3 py-12 border-t border-white/10 mt-12">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 text-brand-blue">
                     <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tighter text-white">Career Intelligence</h2>
                    <p className="text-brand-light-gray text-xs font-medium uppercase tracking-[0.2em] mt-1">High-probability role alignment</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {careerPaths.jobs_now?.length > 0 && (
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em] mb-6">Immediate Opportunities</h3>
                       {careerPaths.jobs_now.map((job, i) => (
                         <div key={i} className="glass-panel p-6 rounded-3xl border-transparent hover:border-brand-blue/30 transition-all group">
                            <div className="text-lg font-bold text-white mb-2 group-hover:text-brand-blue transition-colors tracking-tight">{job.title}</div>
                            <p className="text-xs text-brand-light-gray font-medium leading-relaxed">{job.match_reason}</p>
                         </div>
                       ))}
                    </div>
                  )}

                  {careerPaths.jobs_after_learning?.length > 0 && (
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-6">Future Growth Paths</h3>
                       {careerPaths.jobs_after_learning.map((job, i) => (
                         <div key={i} className="glass-panel p-6 rounded-3xl border-transparent hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-2">
                               <div className="text-lg font-bold text-white tracking-tight">{job.title}</div>
                               <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                 job.potential === 'High' ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20' : 'bg-white/5 text-white/40 border-white/10'
                               }`}>{job.potential}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-4">
                               {job.skills_needed?.map((s, idx) => (
                                 <span key={idx} className="text-[8px] font-bold uppercase tracking-widest bg-white/5 text-white/40 px-2 py-1 rounded-lg">{s}</span>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Deep LinkedIn Profile Integration */}
          {(linkedinRawData || data.linkedin_error) && (
            <div className="lg:col-span-3 mt-12 w-full border-t border-white/10 pt-12">
               <div className="flex items-center gap-4 mb-10 justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                     <ShieldCheck size={24} />
                  </div>
                  <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tighter text-white">LinkedIn Verification</h2>
                    <p className="text-brand-light-gray text-xs font-medium uppercase tracking-[0.2em] mt-1 italic">Scan provided by Bright Data Intelligent Scraping</p>
                  </div>
               </div>
               <LinkedInProfile data={linkedinRawData} error={data.linkedin_error} loading={false} injectedSkills={linkedinSkills.length > 0 ? linkedinSkills : skills} />
            </div>
          )}

        </div>

        <footer className="mt-20 text-center text-[10px] font-bold uppercase tracking-[0.5em] text-white/10 border-t border-white/5 pt-12">
            HireLens AI Intelligence Network &bull; Hackathon Production 2026
        </footer>

      </div>
    </div>
  )
}
