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
  // Taking a generic approach to display radar points based on skills matched vs missing
  const labels = ['Skills Matched', 'Missing Skills', 'Formatting', 'Relevance', 'Experience']
  
  // Example dummy weights if real breakdown isn't provided:
  const matchCount = skills.length
  const missingCount = missing.length
  const total = matchCount + missingCount || 1
  const matchScore = Math.round((matchCount / total) * 100)
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Candidate Profile',
        data: [matchScore, (100 - matchScore), 85, 90, 80],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  }

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12 } },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  return (
    <div className="w-full h-full max-h-[300px] flex items-center justify-center p-4">
      <Radar data={data} options={options} />
    </div>
  )
}
