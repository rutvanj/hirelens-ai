import { motion } from 'framer-motion'

export const Card = ({ children, className = '', hover = true, delay = 0 }) => {
  const baseStyles = "glass-panel rounded-[2rem] p-8 relative overflow-hidden"
  const hoverStyles = hover ? "glass-panel-hover" : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`${baseStyles} ${hoverStyles} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
