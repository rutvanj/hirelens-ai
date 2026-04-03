import { motion } from 'framer-motion'
import { MapPin, Briefcase, Building2, GraduationCap, Calendar, ThumbsUp, MessageSquare, ExternalLink, AlertCircle, FileWarning } from 'lucide-react'

// Skeleton Loader Component
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`}></div>
)

export default function LinkedInProfile({ data, loading, error }) {
  // Loading State
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 mt-6">
        <div className="glass-panel p-8 rounded-3xl flex gap-6 items-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
             <Skeleton className="h-[200px] w-full max-w-full rounded-3xl" />
             <Skeleton className="h-[300px] w-full max-w-full rounded-3xl" />
          </div>
          <div className="space-y-6">
             <Skeleton className="h-[200px] w-full max-w-full rounded-3xl" />
             <Skeleton className="h-[200px] w-full max-w-full rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto mt-6">
        <div className="glass-panel p-8 flex flex-col items-center justify-center text-center rounded-3xl border border-red-500/20 bg-red-500/5 min-h-[300px]">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-200 mb-2">Error Loading Profile</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </motion.div>
    )
  }

  // Empty State
  if (!data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto mt-6">
        <div className="glass-panel p-8 flex flex-col items-center justify-center text-center rounded-3xl min-h-[300px]">
          <FileWarning size={48} className="text-gray-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-300 mb-2">Profile Not Available</h2>
          <p className="text-gray-500">No LinkedIn data was returned or a profile wasn't provided.</p>
        </div>
      </motion.div>
    )
  }

  // Data mapping from Bright Data JSON (fallback to standard names)
  const profilePic = data.profile_pic_url || data.avatar || null
  const name = data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown User'
  const headline = data.headline || ''
  const about = data.about || data.summary || ''
  const location = data.location || data.city || ''
  
  // Experience and Education (Arrays)
  const experiences = data.experience || []
  const education = data.education || []
  const posts = data.activities || data.posts || []
  
  // Basic attributes
  const currentCompany = data.current_company_name || (experiences[0] ? experiences[0].company : 'N/A')
  const currentTitle = data.current_company_position || (experiences[0] ? experiences[0].title : 'N/A')
  const profileId = data.public_identifier || data.id || ''

  // Skills
  let mappedSkills = []
  if (data.skills && Array.isArray(data.skills)) {
     mappedSkills = data.skills.map(s => typeof s === 'string' ? s : (s.name || s))
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 mt-8">
      
      {/* 1. Profile Header Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* Abstract background flourish */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-800 border-4 border-gray-700 overflow-hidden shadow-2xl flex items-center justify-center">
            {profilePic ? (
              <img src={profilePic} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl font-bold text-gray-500">{name.charAt(0)}</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left z-10 w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
             <div>
               <h1 className="text-3xl font-bold text-white mb-2">{name}</h1>
               <p className="text-lg text-indigo-300 font-medium mb-4">{headline}</p>
             </div>
             {profileId && (
               <a href={`https://linkedin.com/in/${profileId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-xl text-sm font-medium text-white shadow-sm self-center md:self-start shrink-0">
                 View on LinkedIn <ExternalLink size={16} />
               </a>
             )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 mt-4 text-sm text-gray-300">
             {currentTitle && currentTitle !== 'N/A' && (
               <div className="flex items-center gap-2 justify-center md:justify-start">
                 <Briefcase size={16} className="text-indigo-400 opacity-70" /> {currentTitle}
               </div>
             )}
             {currentCompany && currentCompany !== 'N/A' && (
               <div className="flex items-center gap-2 justify-center md:justify-start">
                 <Building2 size={16} className="text-indigo-400 opacity-70" /> {currentCompany}
               </div>
             )}
             {location && (
               <div className="flex items-center gap-2 justify-center md:justify-start">
                 <MapPin size={16} className="text-gray-400 opacity-70" /> {location}
               </div>
             )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 2. About Section */}
          {about && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {about}
              </p>
            </motion.div>
          )}

          {/* 3. Experience Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Experience</h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/0 before:via-indigo-500/20 before:to-indigo-500/0">
              {experiences.length > 0 ? experiences.map((exp, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Badge */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-gray-900 bg-gray-800 text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                    <Briefcase size={16} />
                  </div>
                  
                  {/* Content Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-2xl border border-white/5">
                    <div className="text-xs text-indigo-300 font-bold mb-1">{exp.starts_at ? `${exp.starts_at.year || ''} - ${exp.ends_at ? exp.ends_at.year : 'Present'}` : (exp.duration || '')}</div>
                    <h3 className="font-bold text-white text-lg">{exp.title}</h3>
                    <div className="text-md text-gray-300 font-medium mb-3">{exp.company}</div>
                    {exp.description && (
                      <p className="text-sm text-gray-400 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center w-full relative z-10 py-6">No experience listed.</p>
              )}
            </div>
          </motion.div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          
          {/* 4. Skills Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Skills</h2>
            <div className="flex flex-wrap gap-2">
               {mappedSkills.length > 0 ? (
                 mappedSkills.map((skill, idx) => (
                   <span key={idx} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-500/20 transition-colors cursor-default">
                     {skill}
                   </span>
                 ))
               ) : (
                 <p className="text-gray-500 text-sm">No specific skills found.</p>
               )}
            </div>
          </motion.div>

          {/* 5. Education Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-3xl p-8 bg-gradient-to-br from-white/5 to-transparent">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <GraduationCap className="text-purple-400" /> Education
            </h2>
            <div className="space-y-6">
              {education.length > 0 ? education.map((edu, idx) => (
                <div key={idx} className="relative before:absolute before:left-[-1.5rem] before:top-2 before:w-2 before:h-2 before:bg-purple-500 before:rounded-full before:opacity-50">
                  <h3 className="font-bold text-white">{edu.school || edu.institution || 'Unknown Institution'}</h3>
                  <div className="text-sm text-gray-300 mt-1">
                     {(edu.degree_name || edu.degree) && <span className="font-medium text-purple-300">{edu.degree_name || edu.degree}</span>}
                     {(edu.field_of_study) && <span> in {edu.field_of_study}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <Calendar size={12} /> {(edu.starts_at ? edu.starts_at.year : '')} - {(edu.ends_at ? edu.ends_at.year : 'Present')}
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No education listed.</p>
              )}
            </div>
          </motion.div>

          {/* 6. Posts / Activities Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Recent Posts</h2>
            <div className="space-y-4">
              {posts.length > 0 ? posts.slice(0, 3).map((post, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition">
                  <p className="text-sm text-gray-300 mb-3 line-clamp-3">{post.post_body || post.post_content || post.text || post.title}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                     <span className="flex items-center gap-1"><ThumbsUp size={12} className="text-indigo-400" /> {post.likes || 0}</span>
                     <span className="flex items-center gap-1"><MessageSquare size={12} className="text-purple-400" /> {post.comments || 0}</span>
                     {(post.time || post.timestamp) && <span className="ml-auto flex items-center gap-1"><Calendar size={12} /> {post.time || post.timestamp}</span>}
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm text-center py-4">No recent activities available.</p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
      
    </div>
  )
}
