import { motion } from 'framer-motion'
import React from 'react'

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white border border-[#E7DDE5] rounded-[2rem] p-8 
        ${hover ? 'hover:border-[#5F9EA0]/30 transition-all duration-300' : ''} 
        shadow-[0_20px_50px_-20px_rgba(36,52,71,0.05)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
