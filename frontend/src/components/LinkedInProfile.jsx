import { motion } from 'framer-motion'
import { MapPin, Briefcase, Building2, GraduationCap, Calendar, ThumbsUp, MessageSquare, ExternalLink, AlertCircle, FileWarning, ShieldCheck, Cpu } from 'lucide-react'

// Skeleton Loader Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-brand-warm rounded-2xl ${className}`}></div>
)

export default function LinkedInProfile({ data, loading, error, injectedSkills = [] }) {
  // Loading State
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8 mt-8">
        <div className="glass-panel p-10 rounded-[2.5rem] flex gap-8 items-center border-brand-border">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
             <Skeleton className="h-[250px] w-full rounded-[2rem]" />
             <Skeleton className="h-[400px] w-full rounded-[2rem]" />
          </div>
          <div className="space-y-8">
             <Skeleton className="h-[250px] w-full rounded-[2rem]" />
             <Skeleton className="h-[250px] w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto mt-8">
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center rounded-[2.5rem] border-brand-danger bg-brand-danger/30 min-h-[400px] shadow-md">
          <AlertCircle size={64} className="text-brand-dark/20 mb-6" />
          <h2 className="text-2xl font-bold text-brand-dark mb-2 uppercase tracking-tighter">OSINT Scan Interrupted</h2>
          <p className="text-brand-muted font-bold text-xs uppercase tracking-widest">{error}</p>
        </div>
      </motion.div>
    )
  }

  // Empty State
  if (!data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto mt-8">
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center rounded-[2.5rem] border-brand-border min-h-[400px] shadow-sm">
          <FileWarning size={64} className="text-brand-muted/20 mb-6" />
          <h2 className="text-2xl font-bold text-brand-dark mb-2 uppercase tracking-tighter">Profile Not Found</h2>
          <p className="text-brand-muted font-bold text-xs uppercase tracking-widest">No Intelligence Data Available for this Identifier</p>
        </div>
      </motion.div>
    )
  }

  const profilePic = data.profile_pic_url || data.avatar || null
  const name = data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unidentified Candidate'
  const headline = data.headline || ''
  const about = data.about || data.summary || ''
  const location = data.location || data.city || ''
  const experiences = data.experience || []
  const education = data.education || []
  const posts = data.activity || data.activities || data.posts || []
  const currentCompany = data.current_company_name || (experiences[0] ? experiences[0].company : 'N/A')
  const currentTitle = data.current_company_position || (experiences[0] ? experiences[0].title : 'N/A')
  const profileId = data.public_identifier || data.id || ''

  let mappedSkills = Array.isArray(injectedSkills) && injectedSkills.length > 0 ? injectedSkills : []
  if (data.skills) {
     let raw = Array.isArray(data.skills) ? data.skills.map(s => typeof s === 'string' ? s : (s.name || s)) : typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()) : []
     if (raw.length > 0) mappedSkills = [...new Set([...mappedSkills, ...raw])]
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 mt-8">
      
      {/* 1. Profile Header Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden border-brand-blue/10 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-brand-warm border-4 border-brand-border overflow-hidden shadow-xl flex items-center justify-center relative group">
            {profilePic ? (
              <img src={profilePic} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl font-bold text-brand-muted/20">{name.charAt(0)}</span>
            )}
            <div className="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left z-10 w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
             <div>
               <h1 className="text-4xl font-bold text-brand-dark mb-2 tracking-tighter">{name}</h1>
               <p className="text-lg text-brand-blue font-bold tracking-tight mb-6">{headline}</p>
             </div>
             {profileId && (
               <a href={`https://linkedin.com/in/${profileId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-dark text-white hover:bg-brand-blue transition-all rounded-xl text-[10px] font-bold uppercase tracking-widest shrink-0 shadow-md">
                 LinkedIn Profile <ExternalLink size={14} />
               </a>
             )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted">
             {currentTitle && currentTitle !== 'N/A' && (
               <div className="flex items-center gap-3 justify-center md:justify-start">
                 <Briefcase size={14} className="text-brand-blue" /> {currentTitle}
               </div>
             )}
             {currentCompany && currentCompany !== 'N/A' && (
               <div className="flex items-center gap-3 justify-center md:justify-start">
                 <Building2 size={14} className="text-brand-blue" /> {currentCompany}
               </div>
             )}
             {location && (
               <div className="flex items-center gap-3 justify-center md:justify-start shadow-sm">
                 <MapPin size={14} className="text-brand-muted" /> {location}
               </div>
             )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. About Section */}
          {about && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-[2rem] p-10 border-brand-border shadow-sm">
              <h2 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em] mb-6">Profile Intelligence</h2>
              <p className="text-brand-muted leading-relaxed font-medium text-sm md:text-base italic">
                "{about}"
              </p>
            </motion.div>
          )}

          {/* 3. Experience Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-[2rem] p-10 border-brand-border shadow-sm">
            <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
               <ShieldCheck size={14} /> Verification History
            </h2>
            <div className="space-y-12">
              {experiences.length > 0 ? experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-8 border-l border-brand-border group">
                  <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 rounded-full bg-brand-blue/30 border border-brand-blue group-hover:bg-brand-blue transition-colors" />
                  <div className="text-[9px] font-bold text-brand-blue uppercase tracking-widest mb-2">
                     {exp.start_date || (exp.starts_at && exp.starts_at.year) || ''} &mdash; {exp.end_date || (exp.ends_at && exp.ends_at.year) || 'Present'}
                  </div>
                  <h3 className="font-bold text-brand-dark text-xl tracking-tight mb-1">{exp.title}</h3>
                  <div className="text-md text-brand-muted font-bold mb-4 uppercase tracking-tighter">{exp.company}</div>
                  {(exp.description || exp.description_html) && (
                    <p className="text-sm text-brand-muted font-medium leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                      {exp.description || 'Verified position details.'}
                    </p>
                  )}
                </div>
              )) : (
                <p className="text-brand-muted/40 text-center font-bold uppercase tracking-widest py-6 text-xs">No experience verified.</p>
              )}
            </div>
          </motion.div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          
          {/* 4. Skills Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-[2rem] p-10 border-brand-border shadow-sm">
            <h2 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
               <Cpu size={14} /> Neural Stack
            </h2>
            <div className="flex flex-wrap gap-2">
               {mappedSkills.length > 0 ? (
                 mappedSkills.map((skill, idx) => (
                   <span key={idx} className="px-3 py-1.5 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-lg text-[9px] font-bold uppercase tracking-widest">
                     {skill}
                   </span>
                 ))
               ) : (
                 <p className="text-brand-muted/40 text-[10px] font-bold uppercase tracking-widest">No skill detections.</p>
               )}
            </div>
          </motion.div>

          {/* 5. Education Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-[2rem] p-10 border-brand-border shadow-sm">
            <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <GraduationCap size={14} /> Academic Record
            </h2>
            <div className="space-y-8">
              {education.length > 0 ? education.map((edu, idx) => (
                <div key={idx} className="relative group pl-4 border-l border-brand-border">
                  <h3 className="font-bold text-brand-dark tracking-tight mb-1">{edu.title || edu.school || edu.institution || 'Unknown Institution'}</h3>
                  <div className="text-xs text-brand-blue font-bold uppercase tracking-widest mt-1">
                     {edu.description || edu.degree_name || edu.degree || 'Degree Not Specified'}
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-[9px] font-bold text-brand-muted/40 uppercase tracking-widest">
                    <Calendar size={12} /> {(edu.start_year || (edu.starts_at && edu.starts_at.year) || '')} - {(edu.end_year || (edu.ends_at && edu.ends_at.year) || 'Present')}
                  </div>
                </div>
              )) : (
                <p className="text-brand-muted/40 text-[10px] font-bold uppercase tracking-widest">No records available.</p>
              )}
            </div>
          </motion.div>

          {/* 6. Posts / Activities Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel rounded-[2rem] p-10 border-brand-border shadow-sm">
            <h2 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
               <MessageSquare size={14} /> Social Signals
            </h2>
            <div className="space-y-6">
              {posts.length > 0 ? posts.slice(0, 3).map((post, idx) => (
                <div key={idx} className="bg-brand-warm rounded-2xl p-5 border border-brand-border hover:border-brand-blue/30 transition-all group shadow-inner">
                  <p className="text-xs text-brand-muted font-medium leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">{post.post_body || post.post_content || post.text || post.title || post.interaction}</p>
                  <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-widest text-brand-muted/40">
                     <span className="flex items-center gap-2 group-hover:text-brand-blue transition-colors"><ThumbsUp size={12} /> {post.likes || 0}</span>
                     <span className="flex items-center gap-2 group-hover:text-brand-blue transition-colors"><MessageSquare size={12} /> {post.comments || 0}</span>
                  </div>
                </div>
              )) : (
                <p className="text-brand-muted/40 text-[10px] font-bold uppercase tracking-widest text-center py-4">Zero social activity.</p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
      
    </div>
  )
}
