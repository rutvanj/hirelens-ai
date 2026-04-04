import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

export default function RadarChart({ skills = [], missing = [] }) {
  const labels = ['Intelligence Match', 'Neural Precision', 'Formatting', 'Relevance', 'Experience']
  
  const matchCount = skills.length
  const missingCount = missing.length
  const total = matchCount + missingCount || 1
  const matchScore = Math.round((matchCount / total) * 100)
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Intelligence Report',
        data: [matchScore, (100 - matchScore), 85, 95, 80],
        backgroundColor: 'rgba(95, 158, 160, 0.15)',
        borderColor: '#5F9EA0',
        borderWidth: 2,
        pointBackgroundColor: '#5F9EA0',
        pointBorderColor: '#FFF7FB',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#5F9EA0',
      },
    ],
  }

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(36, 52, 71, 0.05)' },
        grid: { color: 'rgba(36, 52, 71, 0.05)' },
        pointLabels: { 
          color: 'rgba(36, 52, 71, 0.6)', 
          font: { 
            size: 9, 
            weight: 'bold',
            family: "'Inter', sans-serif"
          } 
        },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#243447',
        titleColor: '#5F9EA0',
        bodyColor: '#fff',
        borderColor: 'rgba(36, 52, 71, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 10, weight: 'bold', family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" }
      }
    },
    maintainAspectRatio: false
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <Radar data={data} options={options} />
    </div>
  )
}
