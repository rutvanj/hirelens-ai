import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, ShieldCheck } from 'lucide-react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { useNavigate } from 'react-router-dom'

export const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        {/* Overlay */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white border border-brand-border rounded-[2.5rem] p-8 md:p-12 shadow-[0_40px_80px_-15px_rgba(36,52,71,0.15)] max-w-lg w-full relative z-20 overflow-hidden"
        >
          {/* Close Button */}
          <button 
             onClick={onClose}
             className="absolute top-8 right-8 text-brand-muted hover:text-brand-dark transition-colors"
          >
             <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center mb-10">
             <div className="w-16 h-16 rounded-2xl bg-brand-pink/30 flex items-center justify-center mb-6 border border-brand-pink">
                <ShieldCheck size={32} className="text-brand-blue" />
             </div>
             <h2 className="text-3xl font-bold text-brand-dark tracking-tight">Welcome to HireLens</h2>
             <p className="text-brand-muted mt-2 font-medium">Log in to your account to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Input 
              label="Email address"
              type="email"
              placeholder="name@company.com"
              icon={<Mail size={16} />}
              required
            />
            <Input 
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock size={16} />}
              required
            />

            <div className="flex flex-col gap-4 mt-8">
              <Button variant="primary" className="h-14 text-base w-full">Log in</Button>
              <Button variant="secondary" className="h-14 text-base w-full">Use demo credentials</Button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-brand-border text-center">
             <button 
                onClick={() => {
                   onClose()
                   navigate('/analyze')
                }}
                className="text-brand-blue font-bold text-sm uppercase tracking-widest hover:text-brand-dark transition-colors"
             >
                Continue without login
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
