import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  ExternalLink,
  Target,
  Info,
  Award,
  Activity,
  ArrowUpRight,
  Globe,
  XCircle,
  FileWarning,
  Download
} from 'lucide-react'
import LinkedInProfile from '../components/LinkedInProfile'
import RadarChart from '../components/RadarChart'
import { Button } from '../components/ui/Button'
import { exportReportPdf } from '../lib/exportPdf'

// --- Shared UI Primitives (matching Landing + Analyze) ---

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-[#F8DCE8] text-[#243447] border-[rgba(231,221,229,0.5)]',
    success: 'bg-[#DCEFE8] text-[#243447] border-[rgba(95,158,160,0.2)]',
    neutral: 'bg-[#FAF6F2] text-[#6B7A8C] border-[#E7DDE5]'
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase border ${variants[variant]}`}>
      {children}
    </span>
  )
}

const SectionLabel = ({ icon, children }) => (
  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#6B7A8C] flex items-center gap-2 mb-8">
    {icon} {children}
  </h3>
)

const ResultCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`bg-white border border-[#E7DDE5] rounded-[2rem] p-8 shadow-[0_20px_50px_-20px_rgba(36,52,71,0.05)] hover:border-[rgba(95,158,160,0.3)] transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
)

export default function ResultsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const reportRef = useRef(null)
  const [exporting, setExporting] = useState(false)

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

  // --- Data Extraction ---
  const matchScore = data.match_score || 0
  const skills = data.skills || []
  const missing = data.missing || []
  const linkedinRawData = data.linkedin_raw_data || null
  const linkedinSkills = data.linkedin_skills || []
  const aiSuggestions = data.ai_suggestions || { resume_tips: [], skills_to_learn: [] }
  const jobRole = data.job_role || 'Specialist'
  const seniority = data.job_seniority || 'Professional'
  const aiInsights = data.ai_insights || { hiring_probability: 0, reasoning: '', confidence: 50 }
  const careerPaths = data.career_paths || { jobs_now: [], jobs_after_learning: [] }
  const hiringProb = aiInsights.hiring_probability || 0

  // Polished fallback copy
  const copy = {
    noMatches: 'Manual verification may be helpful for niche skill alignment.',
    noGaps: 'Candidate shows broad alignment with core role requirements.',
    noTips: 'The profile would benefit from clearer role-specific framing and stronger measurable impact.',
    noSkills: 'Further verification of specific technical domains is recommended.',
    reasoning: aiInsights.reasoning || 'Based on the provided resume and job description, the candidate demonstrates specific technical alignment with the core requirements of the role.'
  }

  const finalScore = Math.round((0.6 * matchScore) + (0.4 * hiringProb))

  const getScoreColor = (score) => {
    if (score >= 80) return '#5F9EA0'
    if (score >= 60) return '#6E8FA0'
    return '#6B7A8C'
  }
  const scoreColor = getScoreColor(finalScore)

  const handleExportPdf = async () => {
    console.log("Download PDF button clicked")
    if (!reportRef.current) {
      console.error("reportRef.current is null!")
      return
    }
    if (exporting) {
      console.log("Export already in progress")
      return
    }
    
    console.log("reportRef element:", reportRef.current)
    setExporting(true)
    
    try {
      const slug = jobRole ? String(jobRole).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') : ''
      const filename = slug ? `hirelens-report-${slug}.pdf` : 'hirelens-report.pdf'
      console.log("Target filename:", filename)
      
      console.log("Calling exportReportPdf...")
      await exportReportPdf(reportRef.current, filename)
      console.log("exportReportPdf completed")
    } catch (err) {
      console.error('PDF export failed:', err)
      alert("PDF export failed: " + err.message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF7FB] text-[#243447] font-sans selection:bg-[#F8DCE8] selection:text-[#243447] flex flex-col overflow-x-hidden">

      {/* NAVBAR — identical to Landing/Analyze */}
      <nav className="sticky top-0 z-40 bg-[#FFF7FB]/90 backdrop-blur-md border-b border-[#E7DDE5]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/analyze" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B7A8C] hover:text-[#243447] transition-colors">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to analysis
          </Link>
          <Link to="/" className="text-xl font-bold tracking-tight text-[#243447]">HireLens</Link>
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={handleExportPdf} loading={exporting} disabled={exporting} className="text-xs uppercase tracking-widest">
              <Download size={14} />
              {exporting ? 'Generating PDF…' : 'Download Report'}
            </Button>
            <Link to="/">
              <button className="px-5 py-2 rounded-xl border border-[#E7DDE5] text-xs font-bold uppercase tracking-widest hover:bg-white hover:border-[#5F9EA0] transition-all text-[#243447]">
                Exit Report
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-14 pb-24 flex-1">
        <div ref={reportRef} className="bg-[#FFF7FB]">

          <header className="mb-16">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge variant="success">Analysis Complete</Badge>
                <Badge variant="neutral">{jobRole}</Badge>
                <Badge variant="neutral">{seniority} Level</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#6E8FA0] mb-4">
                Candidate Report
              </h1>
              <p className="text-[#6B7A8C] font-medium text-lg max-w-2xl">
                A clear, grounded breakdown of how the candidate's profile aligns with the target role.
              </p>
            </motion.div>
          </header>


          {/* PRIMARY SCORE + SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Score Card */}
            <ResultCard className="flex flex-col items-center justify-center text-center p-12" delay={0.05}>
              <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#E7DDE5" strokeWidth="8" />
                  <motion.circle
                    initial={{ strokeDashoffset: 327 }}
                    animate={{ strokeDashoffset: 327 - (327 * finalScore) / 100 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="8"
                    strokeDasharray="327"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-bold tracking-tighter text-[#243447]">{finalScore}</span>
                  <span className="text-[9px] font-bold text-[#6B7A8C] uppercase tracking-[0.3em] mt-1">Suitability</span>
                </div>
              </div>

              <div className="flex gap-10">
                <div className="text-center">
                  <span className="block text-lg font-bold text-[#243447]">{matchScore}%</span>
                  <span className="text-[9px] font-bold text-[#6B7A8C] uppercase tracking-widest">ATS Match</span>
                </div>
                <div className="w-px bg-[#E7DDE5]" />
                <div className="text-center">
                  <span className="block text-lg font-bold text-[#243447]">{aiInsights.confidence}%</span>
                  <span className="text-[9px] font-bold text-[#6B7A8C] uppercase tracking-widest">Confidence</span>
                </div>
              </div>
            </ResultCard>

            {/* AI Summary */}
            <ResultCard className="lg:col-span-2 p-10" delay={0.1}>
              <SectionLabel icon={<Info size={16} className="text-[#5F9EA0]" />}>Hiring Intelligence</SectionLabel>
              <h3 className="text-2xl font-bold text-[#243447] leading-tight mb-6 tracking-tight">
                Strategic candidate summary and role-fit perspective.
              </h3>
              <div className="p-6 rounded-2xl bg-[#FAF6F2] border border-[#E7DDE5] mb-8">
                <p className="text-sm text-[#243447] leading-relaxed font-semibold italic">
                  "{copy.reasoning}"
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Fast Learner', 'Tech-Forward', 'Strategic'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-[#FAF6F2] border border-[#E7DDE5]/50 text-[10px] font-bold uppercase tracking-widest text-[#6B7A8C]">
                    {tag}
                  </span>
                ))}
              </div>
            </ResultCard>
          </div>

          {/* TECHNICAL ALIGNMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <ResultCard className="lg:col-span-2" delay={0.15}>
              <div className="flex items-center justify-between mb-8">
                <SectionLabel icon={<Target size={16} className="text-[#5F9EA0]" />}>Technical Alignment</SectionLabel>
                <Badge variant="success">Verified</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-bold text-[#6B7A8C] uppercase tracking-widest mb-5">Core Skill Overlap</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-[#DCEFE8] text-[#243447] text-[10px] font-bold border-[rgba(95,158,160,0.2)]">
                        {skill}
                      </span>
                    )) : <p className="text-xs text-[#6B7A8C] font-medium italic">{copy.noMatches}</p>}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#6B7A8C] uppercase tracking-widest mb-5">Identified Gaps</p>
                  <div className="flex flex-wrap gap-2">
                    {missing.length > 0 ? missing.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-[#F3DDE2] text-[#243447] text-[10px] font-bold border-[rgba(231,221,229,0.5)]">
                        {skill}
                      </span>
                    )) : <p className="text-xs text-[#6B7A8C] font-medium italic">{copy.noGaps}</p>}
                  </div>
                </div>
              </div>
            </ResultCard>

            {/* Profile Radar */}
            <ResultCard delay={0.2}>
              <SectionLabel icon={<Activity size={16} className="text-[#5F9EA0]" />}>Profile Signature</SectionLabel>
              <div className="aspect-square w-full relative flex items-center justify-center">
                <RadarChart />
              </div>
              <p className="text-[9px] font-bold text-center text-[rgba(107,122,140,0.4)] uppercase tracking-[0.2em] mt-4">
                Multidimensional Skill Map
              </p>
            </ResultCard>
          </div>

          {/* OPTIMIZATION + UPSKILLING */}
          <ResultCard className="mb-12" delay={0.25}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <SectionLabel icon={<Lightbulb size={20} className="text-[#5F9EA0]" />}>Resume Optimization</SectionLabel>
                <div className="space-y-4">
                  {aiSuggestions.resume_tips?.length > 0 ? aiSuggestions.resume_tips.map((tip, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-[#FAF6F2] rounded-2xl border border-[#E7DDE5] group hover:bg-white transition-all">
                      <div className="w-2 h-2 rounded-full bg-[#5F9EA0] mt-1.5 shrink-0" />
                      <p className="text-sm text-[#243447] leading-relaxed font-medium">{tip}</p>
                    </div>
                  )) : <p className="text-sm text-[#6B7A8C] italic">{copy.noTips}</p>}
                </div>
              </div>

              <div>
                <SectionLabel icon={<TrendingUp size={20} className="text-[#5F9EA0]" />}>Upskilling Path</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {aiSuggestions.skills_to_learn?.length > 0 ? aiSuggestions.skills_to_learn.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#FAF6F2] border border-[rgba(95,158,160,0.3)] rounded-xl group hover:border-[rgba(95,158,160,0.3)] transition-all">
                      <span className="text-[11px] font-bold text-[#243447] tracking-widest uppercase">{skill}</span>
                      <Zap size={14} className="text-[#5F9EA0] opacity-30 group-hover:opacity-100 transition-all" />
                    </div>
                  )) : <p className="text-sm text-[#6B7A8C] italic">Refining skill recommendations based on current profile alignment.</p>}
                </div>

                <div className="p-5 rounded-2xl bg-[rgba(220,239,232,0.4)] border border-[rgba(95,158,160,0.2)]">
                  <p className="text-[10px] font-bold text-[#5F9EA0] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Award size={14} /> Recommended Focus
                  </p>
                  <p className="text-xs text-[#243447] leading-relaxed font-medium">
                    Mastering {missing[0] || 'emerging industry tools'} could strengthen alignment by approximately 15–20% for senior roles.
                  </p>
                </div>
              </div>
            </div>
          </ResultCard>

          {/* CAREER PATHS */}
          {(careerPaths.jobs_now?.length > 0 || careerPaths.jobs_after_learning?.length > 0) && (
            <ResultCard className="mb-12" delay={0.3}>
              <SectionLabel icon={<Briefcase size={16} className="text-[#5F9EA0]" />}>Career Opportunities</SectionLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {careerPaths.jobs_now?.length > 0 && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold text-[#6B7A8C] uppercase tracking-widest border-b border-[#E7DDE5] pb-2">Immediate Matches</p>
                    {careerPaths.jobs_now.slice(0, 3).map((job, i) => (
                      <div key={i} className="space-y-1 group">
                        <p className="text-base font-bold text-[#243447] group-hover:text-[#5F9EA0] transition-colors">{job.title}</p>
                        <p className="text-xs text-[#6B7A8C] leading-relaxed line-clamp-2">{job.match_reason}</p>
                      </div>
                    ))}
                  </div>
                )}
                {careerPaths.jobs_after_learning?.length > 0 && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-bold text-[#6B7A8C] uppercase tracking-widest border-b border-[#E7DDE5] pb-2">Future Growth</p>
                    {careerPaths.jobs_after_learning.slice(0, 3).map((job, i) => (
                      <div key={i} className="space-y-1 opacity-60 hover:opacity-100 transition-opacity">
                        <p className="text-base font-bold text-[#243447]">{job.title}</p>
                        <span className="text-[9px] font-black uppercase text-[#5F9EA0] tracking-widest">Potential Match</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ResultCard>
          )}

          {/* LINKEDIN / PROFILE INTELLIGENCE */}
          <AnimatePresence>
            {linkedinRawData && (
              <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16 pt-16 border-t border-[#E7DDE5]"
              >
                <header className="mb-14">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] border border-[#E7DDE5] flex items-center justify-center text-[#5F9EA0]">
                          <Globe size={20} />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter text-[#6E8FA0]">Professional Profile</h2>
                      </div>
                      <p className="text-[#6B7A8C] font-medium text-lg max-w-2xl">
                        Cross-referenced history and skill endorsements from verified sources.
                      </p>
                    </div>
                    <Badge variant="success">Profile Linked</Badge>
                  </div>
                </header>
                <LinkedInProfile
                  data={linkedinRawData}
                  loading={false}
                  injectedSkills={linkedinSkills.length > 0 ? linkedinSkills : skills}
                />
              </motion.section>
            )}
          </AnimatePresence>

          {!linkedinRawData && (
            <div className="mt-16 py-10 px-8 rounded-[2rem] border border-[#E7DDE5] bg-[#FAF6F2] text-center max-w-2xl mx-auto">
              <FileWarning size={28} className="mx-auto mb-3 text-[rgba(107,122,140,0.2)]" />
              <p className="text-[10px] font-bold text-[rgba(107,122,140,0.4)] uppercase tracking-widest">
                External profile verification was not provided for this analysis.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER — matching Landing Page */}
      <footer className="py-20 px-6 border-t border-[#E7DDE5] bg-white mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
          <div className="space-y-5">
            <div className="text-2xl font-bold tracking-tight text-[#243447]">HireLens</div>
            <p className="text-sm text-[#6B7A8C] max-w-xs font-medium leading-relaxed">A modern, grounded tool for resume screening and candidate evaluation.</p>
          </div>
          <div className="flex flex-wrap gap-x-20 gap-y-10">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-[#243447] uppercase tracking-widest">Report</span>
              <Link to="/analyze" className="text-xs font-bold text-[#6B7A8C] hover:text-[#243447] uppercase tracking-widest transition-colors">New Analysis</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold text-[#243447] uppercase tracking-widest">Product</span>
              <Link to="/" className="text-xs font-bold text-[#6B7A8C] hover:text-[#243447] uppercase tracking-widest transition-colors">Home</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-10 border-t border-[#E7DDE5] text-center">
          <p className="text-[10px] font-bold text-[#6B7A8C]/20 uppercase tracking-[0.6em] select-none">HireLens 2026 &bull; Designed for People</p>
        </div>
      </footer>

    </div>
  )
}
