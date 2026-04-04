import { motion } from 'framer-motion'
import React from 'react'

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  loading = false 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-tight disabled:opacity-50 disabled:cursor-not-allowed select-none"
  
  const variants = {
    primary: "bg-[#5F9EA0] hover:bg-[#4F8789] text-white shadow-sm hover:shadow-md",
    secondary: "bg-[#F8DCE8] hover:bg-[#f3c8da] text-[#243447]",
    outline: "border border-[#E7DDE5] hover:border-[#5F9EA0] text-[#243447] hover:bg-white",
    ghost: "text-[#6B7A8C] hover:text-[#243447] hover:bg-[#F8DCE8]/40",
    accent: "bg-[#5F9EA0] text-white hover:bg-[#4F8789] shadow-sm" // mapping old accent to primary
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  )
}
