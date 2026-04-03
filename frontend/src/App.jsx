import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // API URL from Flask backend
    const API_URL = 'http://127.0.0.1:10000/'

    axios.get(API_URL)
      .then(response => {
        setData(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching data:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Resume Analyzer</h1>
        <div className="card">
          <h2>Backend Connection Status:</h2>
          {loading && <p>Connecting to Flask API...</p>}
          {error && (
            <div className="error-box">
              <p style={{ color: 'red' }}>❌ Error: {error}</p>
              <p>Make sure the Flask server is running on port 10000 and CORS is enabled.</p>
            </div>
          )}
          {data && (
            <div className="success-box">
              <p style={{ color: 'green' }}>✅ Successfully connected!</p>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default App
