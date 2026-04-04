import React from 'react'

export default function RadarChart() {
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center p-4 text-center relative">
      {/* Clean, branded radar visual */}
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#E7DDE5" strokeWidth="0.5" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#E7DDE5" strokeWidth="0.5" strokeDasharray="1 3" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#E7DDE5" strokeWidth="0.5" strokeDasharray="1 5" />

        <path
          d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
          fill="rgba(95, 158, 160, 0.04)"
          stroke="#E7DDE5"
          strokeWidth="0.5"
        />

        {/* Data shape */}
        <path
          d="M50 20 L75 40 L65 65 L45 80 L25 55 L35 35 Z"
          fill="rgba(95, 158, 160, 0.12)"
          stroke="#5F9EA0"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {[0, 60, 120, 180, 240, 300].map(deg => (
          <line
            key={deg}
            x1="50" y1="50"
            x2={50 + 40 * Math.cos(deg * Math.PI / 180)}
            y2={50 + 40 * Math.sin(deg * Math.PI / 180)}
            stroke="#E7DDE5"
            strokeWidth="0.3"
          />
        ))}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[rgba(95,158,160,0.5)]">
          Skill Density
        </span>
      </div>
    </div>
  )
}
