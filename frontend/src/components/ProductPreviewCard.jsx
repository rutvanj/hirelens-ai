import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export const ProductPreviewCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-white border border-brand-border rounded-[2.5rem] p-8 shadow-[0_30px_80px_-15px_rgba(36,52,71,0.06)] max-w-md w-full relative overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl -mr-16 -mt-16" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h4 className="text-xl font-bold text-brand-dark tracking-tight">Software Engineer Report</h4>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mt-1">Candidate Evaluation</p>
          </div>
          <div className="text-right">
             <div className="text-3xl font-bold text-brand-blue tracking-tighter">82%</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mt-0.5">Match Score</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Matched Skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={14} className="text-brand-blue" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">Matched Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-brand-success text-brand-blue rounded-lg text-[10px] font-bold uppercase tracking-widest border border-brand-blue/10">React</span>
              <span className="px-3 py-1.5 bg-brand-success text-brand-blue rounded-lg text-[10px] font-bold uppercase tracking-widest border border-brand-blue/10">TypeScript</span>
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={14} className="text-brand-muted/40" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">Missing Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-brand-danger text-brand-muted rounded-lg text-[10px] font-bold uppercase tracking-widest border border-brand-border">AWS</span>
              <span className="px-3 py-1.5 bg-brand-danger text-brand-muted rounded-lg text-[10px] font-bold uppercase tracking-widest border border-brand-border">GraphQL</span>
            </div>
          </div>

          {/* AI Summary Box */}
          <div className="bg-brand-warm border border-brand-border rounded-2xl p-4 mt-4">
             <div className="flex items-start gap-3">
                <AlertCircle size={14} className="text-brand-blue shrink-0 mt-0.5" />
                <p className="text-xs text-brand-muted font-medium leading-relaxed italic">
                  "Candidate shows strong frontend alignment but lacks specific cloud infrastructure experience mentioned in the role."
                </p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
