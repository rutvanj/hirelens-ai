import { motion } from 'framer-motion'
import { 
  MapPin, 
  Building2, 
  Calendar, 
  ThumbsUp, 
  MessageSquare, 
  ExternalLink, 
  AlertCircle, 
  FileWarning, 
  CheckCircle2
} from 'lucide-react'

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[#FAF6F2] rounded-2xl ${className}`}></div>
)

export default function LinkedInProfile({ data, loading, error, injectedSkills = [] }) {

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8 mt-12">
        <div className="bg-white border border-[#E7DDE5] p-10 rounded-[2.5rem] flex gap-8 items-center">
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

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto mt-12">
        <div className="bg-white border border-[#E7DDE5] p-12 flex flex-col items-center justify-center text-center rounded-[2.5rem] min-h-[400px]">
          <AlertCircle size={48} className="text-[#6B7A8C] mb-6 opacity-20" />
          <h2 className="text-2xl font-bold text-[#243447] mb-2 tracking-tight">Profile unavailable</h2>
          <p className="text-[#6B7A8C] font-semibold text-xs uppercase tracking-widest">{error}</p>
        </div>
      </motion.div>
    )
  }

  if (!data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto mt-12">
        <div className="bg-white border border-[#E7DDE5] p-12 flex flex-col items-center justify-center text-center rounded-[2.5rem] min-h-[400px]">
          <FileWarning size={48} className="text-[#6B7A8C] mb-6 opacity-20" />
          <h2 className="text-2xl font-bold text-[#243447] mb-2 tracking-tight">No profile found</h2>
          <p className="text-[#6B7A8C] font-semibold text-[10px] uppercase tracking-widest">No detailed history available for this candidate.</p>
        </div>
      </motion.div>
    )
  }

  const profilePic = data.profile_pic_url || data.avatar || null
  const name = data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Candidate'
  const headline = data.headline || ''
  const about = data.about || data.summary || ''
  const location = data.location || data.city || ''
  const experiences = data.experience || []
  const education = data.education || []
  const posts = data.activity || data.activities || data.posts || []
  const currentCompany = data.current_company_name || (experiences[0] ? experiences[0].company : 'N/A')
  const profileId = data.public_identifier || data.id || ''

  let mappedSkills = Array.isArray(injectedSkills) && injectedSkills.length > 0 ? injectedSkills : []
  if (data.skills) {
     let raw = Array.isArray(data.skills) ? data.skills.map(s => typeof s === 'string' ? s : (s.name || s)) : typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()) : []
     if (raw.length > 0) mappedSkills = [...new Set([...mappedSkills, ...raw])]
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 mt-12 mb-12">
      
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-12 border border-[#E7DDE5] shadow-[0_20px_50px_-20px_rgba(36,52,71,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[rgba(220,235,237,0.2)] rounded-full blur-[80px] -z-10 -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-[#FAF6F2] border border-[#E7DDE5] overflow-hidden shadow-sm flex items-center justify-center relative group">
            {profilePic ? (
              <img src={profilePic} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl font-bold text-[rgba(107,122,140,0.2)]">{name.charAt(0)}</span>
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left z-10 w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
             <div className="space-y-4">
               <h1 className="text-4xl font-bold text-[#243447] tracking-tighter">{name}</h1>
               <p className="text-xl text-[#5F9EA0] font-bold tracking-tight">{headline}</p>
               <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#6B7A8C] pt-2">
                 {location && (
                   <div className="flex items-center gap-2">
                     <MapPin size={14} className="text-[#5F9EA0]" /> {location}
                   </div>
                 )}
                 {currentCompany && currentCompany !== 'N/A' && (
                   <div className="flex items-center gap-2">
                     <Building2 size={14} className="text-[#5F9EA0]" /> {currentCompany}
                   </div>
                 )}
               </div>
             </div>
             
             {profileId && (
               <a href={`https://linkedin.com/in/${profileId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FAF6F2] text-[#243447] hover:bg-[#DCEBED] transition-all rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-[#E7DDE5] shrink-0">
                 View LinkedIn <ExternalLink size={14} />
               </a>
             )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          
          {about && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2rem] p-10 border border-[#E7DDE5]">
              <h2 className="text-[11px] font-bold text-[#6B7A8C] uppercase tracking-widest mb-6 border-b border-[#E7DDE5] pb-2">Profile Summary</h2>
              <p className="text-[#243447] leading-relaxed font-semibold italic text-base">
                "{about}"
              </p>
            </motion.div>
          )}

          {/* Experience */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2rem] p-10 border border-[#E7DDE5]">
            <h2 className="text-[11px] font-bold text-[#6B7A8C] uppercase tracking-widest mb-12 flex items-center gap-2">
               <CheckCircle2 size={16} className="text-[#5F9EA0]" /> Professional History
            </h2>
            <div className="space-y-14">
              {experiences.length > 0 ? experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-10 border-l-2 border-[#FAF6F2] group">
                  <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-white border-2 border-[#5F9EA0] shadow-sm group-hover:scale-110 transition-transform" />
                  <div className="text-[10px] font-bold text-[#5F9EA0] uppercase tracking-widest mb-2">
                     {exp.start_date || (exp.starts_at && exp.starts_at.year) || ''} &mdash; {exp.end_date || (exp.ends_at && exp.ends_at.year) || 'Present'}
                  </div>
                   <h3 className="font-bold text-[#243447] text-xl tracking-tight mb-1">{exp.title}</h3>
                  <div className="text-md text-[#6B7A8C] font-bold mb-5">{exp.company}</div>
                  {(exp.description || exp.description_html) && (
                    <p className="text-[13px] text-[#6B7A8C] font-medium leading-relaxed max-w-2xl">
                      {exp.description || 'Verified position details.'}
                    </p>
                  )}
                </div>
              )) : (
                <p className="text-[rgba(107,122,140,0.4)] text-center font-bold uppercase tracking-widest py-8 text-xs">No specific history verified.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-10">
          
          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#FAF6F2] rounded-[2rem] p-10 border border-[#E7DDE5]">
            <h2 className="text-[11px] font-bold text-[#243447] uppercase tracking-widest mb-8">Confirmed Skills</h2>
            <div className="flex flex-wrap gap-2.5">
               {mappedSkills.length > 0 ? (
                 mappedSkills.map((skill, idx) => (
                   <span key={idx} className="px-3.5 py-2 bg-white border border-[#E7DDE5] text-[#243447] rounded-xl text-[10px] font-bold uppercase tracking-widest">
                     {skill}
                   </span>
                 ))
               ) : (
                 <p className="text-[#6B7A8C]/40 text-[10px] font-bold uppercase tracking-widest">No skill tags found.</p>
               )}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-[2rem] p-10 border border-[#E7DDE5]">
            <h2 className="text-[11px] font-bold text-[#6B7A8C] uppercase tracking-widest mb-8">Academic Record</h2>
            <div className="space-y-10">
              {education.length > 0 ? education.map((edu, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-bold text-[#243447] tracking-tight">{edu.title || edu.school || edu.institution || 'Institution'}</h3>
                  <div className="text-[11px] text-[#5F9EA0] font-bold uppercase tracking-widest">
                     {edu.description || edu.degree_name || edu.degree || 'Degree'}
                  </div>
                   <div className="flex items-center gap-2 mt-3 text-[10px] font-bold text-[rgba(107,122,140,0.4)] uppercase tracking-widest">
                    <Calendar size={12} /> {(edu.start_year || (edu.starts_at && edu.starts_at.year) || '')} - {(edu.end_year || (edu.ends_at && edu.ends_at.year) || 'Present')}
                  </div>
                </div>
              )) : (
                <p className="text-[rgba(107,122,140,0.4)] text-[10px] font-bold uppercase tracking-widest">No verified records.</p>
              )}
            </div>
          </motion.div>

          {/* Activities */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[2rem] p-10 border border-[#E7DDE5]">
            <h2 className="text-[11px] font-bold text-[#6B7A8C] uppercase tracking-widest mb-8">Shared Activity</h2>
            <div className="space-y-6">
               {posts.length > 0 ? posts.slice(0, 3).map((post, idx) => (
                <div key={idx} className="bg-[rgba(250,246,242,0.5)] rounded-2xl p-6 border border-[#E7DDE5] hover:bg-white transition-all group">
                  <p className="text-[12px] text-[#243447] font-semibold leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">"{post.post_body || post.post_content || post.text || post.title || post.interaction}"</p>
                  <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[rgba(107,122,140,0.5)]">
                     <span className="flex items-center gap-2 group-hover:text-[#5F9EA0] transition-colors"><ThumbsUp size={14} /> {post.likes || 0}</span>
                     <span className="flex items-center gap-2 group-hover:text-[#5F9EA0] transition-colors"><MessageSquare size={14} /> {post.comments || 0}</span>
                  </div>
                </div>
              )) : (
                <p className="text-[rgba(107,122,140,0.4)] text-[10px] font-bold uppercase tracking-widest text-center py-6">Zero social signals.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
