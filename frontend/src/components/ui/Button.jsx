import { motion } from 'framer-motion'

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  loading = false 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-[#4F8789] shadow-[0_4px_12px_rgba(95,158,160,0.15)]",
    secondary: "bg-brand-pink text-brand-dark hover:bg-[#f3c8da] shadow-sm",
    outline: "bg-transparent border border-brand-border text-brand-dark hover:border-brand-blue hover:text-brand-blue",
    ghost: "bg-transparent text-brand-muted hover:text-brand-dark hover:bg-brand-pink/20",
    accent: "bg-brand-blue text-white hover:bg-brand-dark shadow-[0_4px_12px_rgba(95,158,160,0.2)]"
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  )
}
