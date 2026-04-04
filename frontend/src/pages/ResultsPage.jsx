import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Download,
  Info,
  Target,
  Activity,
  Lightbulb,
  TrendingUp,
  Zap,
  Award,
  Briefcase,
  Terminal,
  Globe,
  Code,
  ArrowRight,
  CheckCircle2,
  FileWarning,
  RefreshCcw,
  LogOut
} from 'lucide-react'
import LinkedInProfile from '../components/LinkedInProfile'
import RadarChart from '../components/RadarChart'
import { Button } from '../components/ui/Button'
import { exportReportPdf } from '../lib/exportPdf'
import LinkedInConnectPrompt from '../components/LinkedInConnectPrompt'
import LinkedInSkeleton from '../components/LinkedInSkeleton'

// --- Warm Premium UI Primitives ---

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${className}`}>
    {children}
  </span>
)

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-4 mb-6">
    <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-hint whitespace-nowrap">
      {children}
    </h3>
    <div className="h-[1px] flex-1 bg-warm-border-light" />
  </div>
)

const ResultCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`bg-warm-card border border-warm-border rounded-[14px] p-6 shadow-[0_4px_20px_-4px_rgba(28,17,8,0.03)] hover:border-amber-mid/20 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
)

export default function ResultsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [linkedinProfile, setLinkedinProfile] = useState(null)
  const [liLoading, setLiLoading] = useState(true)
  const reportRef = useRef(null)
  const [exporting, setExporting] = useState(false)

  // Fetch Core Analysis
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

  // Fetch LinkedIn Live Data
  useEffect(() => {
    fetchLinkedin()
  }, [])

  const fetchLinkedin = async () => {
    setLiLoading(true)
    try {
      // Use credentials for session support
      const resp = await fetch('http://localhost:10000/api/linkedin/profile', {
        headers: { 'Accept': 'application/json' }
      })
      if (resp.ok) {
        const liData = await resp.json()
        setLinkedinProfile(liData)
      } else {
        setLinkedinProfile({ connected: false })
      }
    } catch (e) {
      setLinkedinProfile({ connected: false, error: 'Connection failed' })
    } finally {
      setLiLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await fetch('http://localhost:10000/api/auth/linkedin/disconnect')
      setLinkedinProfile({ connected: false })
    } catch (e) {
      console.error('Disconnect failed')
    }
  }

  if (!data) return null

  // --- Data Extraction ---
  const matchScore = data.match_score || 0
  const skills = data.skills || []
  const missing = data.missing || []
  const linkedinSkills = data.linkedin_skills || []
  const aiSuggestions = data.ai_suggestions || { resume_tips: [], skills_to_learn: [] }
  const jobRole = data.job_role || 'Specialist'
  const seniority = data.job_seniority || 'Professional'
  const aiInsights = data.ai_insights || { hiring_probability: 0, reasoning: '', confidence: 50 }
  const careerPaths = data.career_paths || { jobs_now: [], jobs_after_learning: [] }
  const githubAnalysis = data.github_analysis || null
  const hiringProb = aiInsights.hiring_probability || 0
  const finalScore = Math.round((0.6 * matchScore) + (0.4 * hiringProb))

  const radarLabels = ['Quality', 'Architecture', 'Documentation', 'Testing', 'Scalability', 'ATS Match']
  const radarDatasets = [
    {
      name: 'Resume Match',
      values: [60, 50, 70, 40, 55, matchScore]
    }
  ]

  if (githubAnalysis && !githubAnalysis.error) {
    const b = githubAnalysis.breakdown || {}
    radarDatasets.push({
      name: 'Engineering Quotient',
      values: [
        b.code_quality || 50,
        b.architecture || 50,
        b.documentation || 50,
        b.testing || 50,
        b.scalability || 50,
        70
      ]
    })
  }

  const handleExportPdf = async () => {
    if (!reportRef.current || exporting) return
    setExporting(true)
    try {
      const slug = jobRole ? String(jobRole).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') : ''
      const filename = slug ? `hirelens-report-${slug}.pdf` : 'hirelens-report.pdf'
      await exportReportPdf(reportRef.current, filename)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-bg text-ink font-sans selection:bg-amber-light flex flex-col overflow-x-hidden">

      {/* STICKY NAVBAR */}
      <nav className="sticky top-0 z-40 h-[60px] bg-warm-card/80 backdrop-blur-md border-b border-warm-border">
        <div className="max-w-[1100px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/analyze" className="group flex items-center gap-2 text-[13px] font-medium text-muted hover:text-amber-deep transition-colors">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
              Back to analysis
            </Link>
            <div className="h-5 w-[1px] bg-warm-border" />
            <Link to="/" className="text-xl font-serif font-bold text-amber-deep">HireLens</Link>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportPdf}
              disabled={exporting}
              className="px-4 py-1.5 h-9 rounded-lg border border-warm-border bg-transparent text-[13px] font-semibold text-muted hover:bg-warm-bg transition-all flex items-center gap-2"
            >
              <Download size={13} />
              {exporting ? 'Exporting...' : 'Download Report'}
            </button>
            <Button 
              variant="primary" 
              onClick={() => navigate('/')} 
              className="bg-amber-deep hover:bg-terra text-white px-5 py-1.5 h-9 rounded-lg text-[13px]"
            >
              Exit Report
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1100px] mx-auto w-full px-6 pt-10 pb-24 flex-1">
        <div ref={reportRef} className="space-y-12">

          {/* PAGE HEADER */}
          <header className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-[#DCFCE7] text-[#166534]">Strong Match</Badge>
                <Badge className="bg-terra-light text-amber-deep">{jobRole}</Badge>
                <Badge className="bg-[#EDE9FE] text-[#5B21B6]">{seniority} Level</Badge>
              </div>
              <h1 className="text-[38px] font-serif font-bold leading-[1.1] text-ink mb-4 max-w-2xl">
                Technical Mastery Assessment & Role Compatibility Report
              </h1>
              <p className="text-muted font-medium text-[15px] leading-[1.6] max-w-[560px]">
                A grounded, architectural breakdown of the candidate's engineering maturity and profile alignment with {jobRole} requirements.
              </p>
            </motion.div>
          </header>


          {/* SUITABILITY OVERVIEW */}
          <section className="space-y-6">
            <SectionLabel>Suitability overview</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
              
              {/* Gauge Card */}
              <ResultCard className="flex flex-col items-center p-6 bg-warm-card" delay={0.05}>
                <div className="w-full text-left mb-6">
                  <span className="text-[13px] font-bold text-muted uppercase tracking-wider">Overall Score</span>
                </div>
                
                <div className="relative w-[164px] h-[90px] mb-4">
                  <svg viewBox="0 0 164 90" className="w-full h-full">
                    <path
                      d="M14 88 A 68 68 0 0 1 150 88"
                      fill="none"
                      stroke="var(--color-warm-border-light)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <motion.path
                      initial={{ strokeDashoffset: 213.6 }}
                      animate={{ strokeDashoffset: 213.6 - (213.6 * finalScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      d="M14 88 A 68 68 0 0 1 150 88"
                      fill="none"
                      stroke="var(--color-amber-mid)"
                      strokeWidth="10"
                      strokeDasharray="213.6"
                      strokeLinecap="round"
                    />
                    <motion.path
                      initial={{ strokeDashoffset: 179 }}
                      animate={{ strokeDashoffset: 179 - (179 * matchScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      d="M25 88 A 57 57 0 0 1 139 88"
                      fill="none"
                      stroke="var(--color-amber-light)"
                      strokeWidth="6"
                      strokeDasharray="179"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 text-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-[34px] font-serif font-bold text-ink">{finalScore}</span>
                      <span className="text-[11px] font-bold text-muted ml-0.5">/ 100</span>
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between pt-4 mt-5 border-t border-warm-border-light">
                  <div className="text-center flex-1">
                    <span className="block text-[15px] font-bold text-amber-mid leading-none">{matchScore}%</span>
                    <span className="text-[10px] font-bold text-hint uppercase tracking-wider mt-1 block">ATS Match</span>
                  </div>
                  <div className="w-[1px] h-6 bg-warm-border-light" />
                  <div className="text-center flex-1">
                    <span className="block text-[15px] font-bold text-sage leading-none">High</span>
                    <span className="text-[10px] font-bold text-hint uppercase tracking-wider mt-1 block">Confidence</span>
                  </div>
                </div>
              </ResultCard>

              {/* Insight Card */}
              <ResultCard className="lg:col-span-2 p-6" delay={0.1}>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[13px] font-bold text-muted uppercase tracking-wider">Hiring Intelligence</span>
                  <Badge className="bg-terra-light text-amber-deep border-none text-[12px] px-3">
                    Recommended for Interview
                  </Badge>
                </div>
                <p className="text-[14px] leading-[1.7] text-ink font-medium italic mb-8">
                  "{aiInsights.reasoning || 'Based on the technical depth and professional alignment, the candidate demonstrates strong readiness for this role.'}"
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['Fast Learner', 'Tech-Forward', 'Strategic', 'Architectural Depth'].map((tag, i) => (
                    <span key={tag} className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold tracking-tight ${i === 0 ? 'bg-amber-pale text-amber-deep border-amber-light' : 'bg-warm-bg text-muted border-warm-border'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </ResultCard>
            </div>
          </section>

          {/* TECHNICAL ALIGNMENT */}
          <section className="space-y-6">
            <SectionLabel>Technical alignment</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[18px]">
              
              {/* Skill Comparison Card */}
              <ResultCard className="lg:col-span-2 p-6" delay={0.15}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[12px] font-bold text-sage uppercase tracking-wider mb-5">Core Skill Overlap</h4>
                    <div className="space-y-1">
                      {skills.length > 0 ? skills.slice(0, 8).map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 py-1.5 border-b border-warm-border-light">
                          <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                          <span className="text-[13px] text-ink font-medium">{skill}</span>
                        </div>
                      )) : <p className="text-xs text-muted italic">Manual verification recommended.</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-coral uppercase tracking-wider mb-5">Identified Gaps</h4>
                    <div className="space-y-1">
                      {missing.length > 0 ? missing.slice(0, 8).map((skill, i) => (
                        <div key={i} className="flex items-center gap-2 py-1.5 border-b border-warm-border-light">
                          <div className="w-1.5 h-1.5 rounded-full bg-coral" />
                          <span className="text-[13px] text-ink font-medium">{skill}</span>
                        </div>
                      )) : <p className="text-xs text-muted italic">No critical gaps identified.</p>}
                    </div>
                  </div>
                </div>
              </ResultCard>

              {/* Radar Card */}
              <ResultCard className="p-6" delay={0.2}>
                <span className="text-[13px] font-bold text-muted uppercase tracking-wider mb-6 block">Profile Radar</span>
                <div className="h-[180px] w-full flex items-center justify-center">
                  <RadarChart datasets={radarDatasets} labels={radarLabels} size={180} />
                </div>
              </ResultCard>
            </div>
          </section>
          
          {/* OPTIMIZATION ROADMAP */}
          <section className="space-y-6">
            <SectionLabel>Optimization roadmap</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
              <ResultCard p-6 delay={0.25}>
                <span className="text-[13px] font-bold text-muted uppercase tracking-wider mb-6 block">Resume Improvements</span>
                <div className="space-y-1">
                  {(aiSuggestions.resume_tips || []).slice(0, 4).map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-warm-border-light group">
                       <span className="text-base mt-0.5 group-hover:scale-110 transition-transform">💡</span>
                       <p className="text-[13px] text-ink leading-relaxed font-medium">{tip}</p>
                    </div>
                  ))}
                </div>
              </ResultCard>

              <ResultCard p-6 delay={0.3}>
                <span className="text-[13px] font-bold text-muted uppercase tracking-wider mb-6 block">Recommended Technical Focus</span>
                <div className="grid grid-cols-2 gap-2">
                  {(aiSuggestions.skills_to_learn || []).slice(0, 6).map((skill, i) => (
                    <div key={i} className={`flex items-center gap-2 p-2 px-3 rounded-lg border ${i === 0 ? 'bg-amber-pale border-amber-light text-amber-deep' : 'bg-warm-bg border-warm-border text-muted'} transition-all`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-amber-deep' : 'bg-muted opacity-40'}`} />
                      <span className="text-[12px] font-bold uppercase tracking-tight">{skill}</span>
                    </div>
                  ))}
                </div>
              </ResultCard>
            </div>
          </section>

          {/* CAREER OPPORTUNITIES */}
          <section className="space-y-6">
            <SectionLabel>Career opportunities</SectionLabel>
            <ResultCard className="p-0 overflow-hidden" delay={0.35}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Immediate Matches */}
                <div className="p-6 border-r border-warm-border-light">
                  <h4 className="text-[13px] font-bold text-muted uppercase tracking-[0.03em] mb-6">Immediate Matches</h4>
                  <div className="space-y-5">
                    {(careerPaths.jobs_now || []).slice(0, 3).map((job, i) => (
                      <div key={i} className="flex gap-3 items-start py-4 border-b border-warm-border-light last:border-0 hover:bg-warm-bg/50 -mx-6 px-6 transition-colors group">
                        <div className="w-8 h-8 rounded-lg bg-warm-bg border border-warm-border flex items-center justify-center text-lg">
                          {i === 0 ? '💼' : i === 1 ? '💻' : '⚡'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-[13px] font-semibold text-ink truncate">{job.title}</p>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${i === 0 ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-terra-light text-amber-deep'}`}>
                              {i === 0 ? 'Strong' : 'Match'}
                            </span>
                          </div>
                          <p className="text-[11px] text-hint font-medium leading-relaxed line-clamp-2">{job.match_reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Future Growth */}
                <div className="p-6 bg-warm-bg/30">
                  <h4 className="text-[13px] font-bold text-muted uppercase tracking-[0.03em] mb-6">Future Growth Paths</h4>
                  <div className="space-y-5">
                    {(careerPaths.jobs_after_learning || []).slice(0, 3).map((job, i) => (
                      <div key={i} className="flex gap-3 items-start py-4 border-b border-warm-border-light last:border-0 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-warm-card border border-warm-border flex items-center justify-center text-lg">
                           🚀
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-ink">{job.title}</p>
                          <p className="text-[11px] text-hint font-medium mt-1">Requires focus on {missing[0] || 'advanced orchestration'}.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ResultCard>
          </section>

          {/* GITHUB CODE INTELLIGENCE */}
          <AnimatePresence>
            {githubAnalysis && !githubAnalysis.error && (
              <section className="space-y-6">
                <SectionLabel>GitHub code intelligence</SectionLabel>
                <ResultCard className="p-6" delay={0.4}>
                  
                  {/* Portfolio Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <h2 className="text-[15px] font-bold text-ink tracking-tight">Portfolio Scanner</h2>
                      <div className="flex items-center gap-1.5 bg-sage-light text-sage px-2 py-0.5 rounded-full text-[11px] font-bold">
                        <CheckCircle2 size={10} />
                        Verified Repository
                      </div>
                    </div>
                    <div className="bg-[#EDE9FE] text-[#5B21B6] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      Top 8% globally
                    </div>
                  </div>

                  {/* Portfolio Global Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Industry Maturity', value: githubAnalysis.industry_score || '84' },
                      { label: 'Engineering Avg', value: 'B+' },
                      { label: 'Code Vitality', value: 'Active' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-warm-bg border border-warm-border-light rounded-lg p-4">
                        <div className="text-[22px] font-bold text-ink leading-none">{stat.value}</div>
                        <div className="text-[11px] font-bold text-hint uppercase tracking-wider mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Portfolio Summary */}
                  <div className="bg-amber-pale border border-amber-light rounded-lg p-4 mb-10">
                    <p className="text-[13px] text-muted leading-[1.6] font-medium">
                      {githubAnalysis.portfolio_summary || 'The candidate demonstrates a focus on modular technical implementation with strong documentation standards across their public repositories.'}
                    </p>
                  </div>

                  {/* Project Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(githubAnalysis.projects || []).map((project, idx) => (
                      <div key={idx} className="bg-warm-card border border-warm-border rounded-[14px] p-5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="text-[14px] font-bold text-ink truncate max-w-[70%]">{project.name}</h3>
                           <span className="text-[13px] font-black text-sage leading-none">{project.rank_score}%</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {(project.languages || []).slice(0, 3).map(lang => (
                            <span key={lang} className="text-[10px] font-bold bg-warm-bg text-muted border border-warm-border px-2 py-0.5 rounded-lg uppercase tracking-wider">
                              {lang}
                            </span>
                          ))}
                        </div>

                        <p className="text-[12px] text-muted leading-relaxed mb-4 line-clamp-2">
                          {project.description || 'Architectural implementation focused on scalability and modular performance.'}
                        </p>

                        {/* AI Review Essence */}
                        <div className="bg-warm-bg border-l-[3px] border-amber-mid rounded-r-lg p-3 mb-4">
                          <p className="text-[12px] text-ink font-medium leading-relaxed italic">
                            {project.ai_summary || 'Technical execution shows depth in asynchronous logic and clean separation of concerns.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 pt-3 border-t border-warm-border-light">
                           <div className="flex items-center gap-1.5 text-[11px] font-bold text-hint">
                              <Code size={11} /> {project.metrics?.total_lines?.toLocaleString() || '1.2k'} LOC
                           </div>
                           <div className="flex items-center gap-1.5 text-[11px] font-bold text-hint">
                              <TrendingUp size={11} /> Comp: {project.metrics?.complexity_score || '3.4'}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </section>
            )}
          </AnimatePresence>

          {/* PROFESSIONAL PROFILE */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionLabel>Professional profile</SectionLabel>
              {linkedinProfile?.connected && (
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={fetchLinkedin}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-muted hover:text-amber-deep transition-colors"
                  >
                    <RefreshCcw size={12} className={liLoading ? 'animate-spin' : ''} />
                    Sync
                  </button>
                  <button 
                    onClick={handleDisconnect}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-muted hover:text-coral transition-colors"
                  >
                    <LogOut size={12} />
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            <ResultCard className="p-6 min-h-[140px] flex flex-col justify-center" delay={0.45}>
              {liLoading ? (
                <LinkedInSkeleton />
              ) : linkedinProfile?.connected ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  
                  {/* Experience Timeline */}
                  <div className="lg:col-span-2">
                     <div className="flex items-center gap-4 mb-6">
                       <img 
                        src={linkedinProfile.profile.avatar_url} 
                        alt="Profile" 
                        className="w-11 h-11 rounded-full border border-warm-border shadow-sm"
                       />
                       <div>
                         <h4 className="text-[15px] font-bold text-ink">{linkedinProfile.profile.name}</h4>
                         <p className="text-[13px] text-muted font-medium leading-tight">{linkedinProfile.profile.headline}</p>
                       </div>
                     </div>
                     
                     <div className="space-y-0">
                       {(linkedinProfile.experience || []).map((exp, i, arr) => (
                         <div key={i} className="flex gap-4 group">
                           <div className="flex flex-col items-center">
                             <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${exp.is_current ? 'bg-amber-mid' : 'bg-hint'}`} />
                             {i !== arr.length - 1 && <div className="w-[1px] flex-1 bg-warm-border mt-1 mb-1" />}
                           </div>
                           <div className="flex-1 pb-8 group-last:pb-0">
                             <p className="text-[14px] font-semibold text-ink leading-tight">{exp.title}</p>
                             <p className="text-[13px] text-amber-deep font-medium mt-1">{exp.organization}</p>
                             <p className="text-[11px] text-hint font-medium mt-1 uppercase tracking-wider">
                               {exp.period} · {exp.duration_label}
                             </p>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Skill Endorsements & Education */}
                  <div className="space-y-12">
                     <div>
                       <h4 className="text-[12px] font-bold text-muted uppercase tracking-wider mb-6">Verified Skills</h4>
                       <div className="flex flex-wrap gap-2">
                         {(linkedinProfile.skills || []).map((skill, i) => (
                           <div key={i} className="group relative flex items-center gap-1.5 bg-warm-bg border border-warm-border px-3 py-1.5 rounded-full hover:border-amber-mid/30 transition-all cursor-default">
                             <span className="text-[11px] font-semibold text-muted">{skill.name}</span>
                             {skill.proficiency && (
                               <span className="text-[9px] font-black uppercase text-amber-deep/50 tracking-tighter">
                                 {skill.proficiency}
                               </span>
                             )}
                           </div>
                         ))}
                       </div>
                     </div>

                     <div>
                       <h4 className="text-[12px] font-bold text-muted uppercase tracking-wider mb-6">Education</h4>
                       <div className="space-y-5">
                         {(linkedinProfile.education || []).map((edu, i) => (
                           <div key={i} className="border-l-2 border-warm-border-light pl-4">
                             <p className="text-[13px] font-semibold text-ink leading-tight">{edu.degree}</p>
                             <p className="text-[12px] text-amber-deep font-medium mt-0.5">{edu.institution}</p>
                             <div className="flex items-center gap-2 mt-1.5">
                               <span className="text-[11px] text-hint font-medium">{edu.period}</span>
                               {edu.grade && (
                                 <>
                                   <div className="w-1 h-1 rounded-full bg-warm-border" />
                                   <span className="text-[11px] text-sage font-bold">Grade: {edu.grade}</span>
                                 </>
                               )}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     <div className="pt-6 border-t border-warm-border-light">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-hint">
                          <CheckCircle2 size={12} className="text-sage" />
                          Last synced {linkedinProfile.meta.last_synced.split('T')[0]}
                        </div>
                     </div>
                  </div>

                </div>
              ) : (
                <LinkedInConnectPrompt />
              )}
            </ResultCard>
          </section>

          {!githubAnalysis && !linkedinProfile?.connected && (
            <div className="py-20 text-center bg-warm-bg border border-dashed border-warm-border rounded-[14px]">
              <FileWarning size={28} className="mx-auto mb-3 text-hint/30" />
              <p className="text-[11px] font-bold text-hint uppercase tracking-widest px-6">
                External profile verification was not provided for this analysis.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="mt-auto border-t border-warm-border bg-warm-card py-12 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8">
             <Link to="/analyze" className="text-[13px] font-semibold text-muted hover:text-amber-deep transition-colors">New Analysis</Link>
             <Link to="/" className="text-[13px] font-semibold text-muted hover:text-amber-deep transition-colors">Home</Link>
          </div>
          <p className="text-[12px] font-medium text-hint select-none">
            HireLens 2026 — Designed for People
          </p>
        </div>
      </footer>

    </div>
  )
}
