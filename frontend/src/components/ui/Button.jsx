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
    primary: "bg-white text-black hover:bg-brand-blue hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(125,211,252,0.4)]",
    outline: "bg-transparent border border-white/20 text-white hover:border-brand-blue hover:text-brand-blue",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
    accent: "bg-brand-blue text-black hover:bg-white shadow-[0_0_20px_rgba(125,211,252,0.3)]"
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
