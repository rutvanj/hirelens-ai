import React from 'react'
import { motion } from 'framer-motion'

export default function RadarChart({ 
  datasets = [], 
  labels = ['Quality', 'Architecture', 'Documentation', 'Testing', 'Scalability', 'ATS Match'],
  size = 200
}) {
  const center = size / 2
  const r = size * 0.4
  
  // Calculate hexagonal points
  const getPoint = (val, i, total) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2
    return {
      x: center + (r * (val / 100)) * Math.cos(angle),
      y: center + (r * (val / 100)) * Math.sin(angle)
    }
  }

  const getPath = (vals) => {
    const points = vals.map((v, i) => getPoint(v, i, labels.length))
    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-visible">
      <svg viewBox={`0 0 ${size} ${size - 10}`} className="w-full h-full overflow-visible">
        {/* Hexagonal Grid Rings */}
        {[33.3, 66.6, 100].map((scale, idx) => (
          <path
            key={idx}
            d={getPath(new Array(labels.length).fill(scale))}
            fill="none"
            stroke="var(--color-warm-border)"
            strokeWidth="0.5"
          />
        ))}

        {/* Axis Lines */}
        {labels.map((_, i) => {
          const pt = getPoint(100, i, labels.length)
          return (
            <line
              key={i}
              x1={center} y1={center}
              x2={pt.x} y2={pt.y}
              stroke="var(--color-warm-border)"
              strokeWidth="0.5"
            />
          )
        })}

        {/* Datasets */}
        {datasets.map((ds, idx) => {
          const d = getPath(ds.values)
          const isEng = ds.name === 'Engineering Quotient'
          
          return (
            <motion.path
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: idx * 0.3 }}
              d={d}
              fill={isEng ? 'rgba(45, 106, 79, 0.12)' : 'rgba(217, 119, 6, 0.18)'}
              stroke={isEng ? 'var(--color-sage)' : 'var(--color-amber-mid)'}
              strokeWidth={isEng ? "1.2" : "1.5"}
              strokeDasharray={isEng ? "4 2" : "none"}
              strokeLinejoin="round"
            />
          )
        })}

        {/* Labels */}
        {labels.map((label, i) => {
          const pt = getPoint(120, i, labels.length)
          return (
            <text
              key={i}
              x={pt.x} y={pt.y}
              fontSize="7"
              fontWeight="500"
              textAnchor="middle"
              className="fill-hint font-sans uppercase tracking-[0.05em]"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              {label}
            </text>
          )
        })}
      </svg>

      {/* Legend Block */}
      <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-1 rounded-full bg-amber-mid opacity-60" />
          <span className="text-[10px] font-medium text-muted uppercase tracking-wider">Resume</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-1 rounded-full bg-sage opacity-50" />
          <span className="text-[10px] font-medium text-muted uppercase tracking-wider">Eng. Q</span>
        </div>
      </div>
    </div>
  )
}
