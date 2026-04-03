import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // Connection state
  const [backendData, setBackendData] = useState(null)
  
  // Job Description state
  const [jobDescription, setJobDescription] = useState('')
  
  // Upload & Extraction states
  const [selectedFile, setSelectedFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [uploadStatus, setUploadStatus] = useState({ 
    loading: false, 
    message: '', 
    error: '' 
  })

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState('')

  useEffect(() => {
    // Initial health check
    const API_URL = 'http://127.0.0.1:10000/'
    axios.get(API_URL)
      .then(response => {
        setBackendData(response.data)
      })
      .catch(err => {
        console.error('Error fetching data:', err)
      })
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus({ loading: false, message: '', error: '' })
      setExtractedText('')
      setAnalysisResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ ...uploadStatus, error: '⚠️ Please select a file first!' })
      return
    }

    setUploadStatus({ loading: true, message: '⚙️ Extracting text...', error: '' })

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post('http://127.0.0.1:10000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setUploadStatus({
        loading: false,
        message: '✅ Resume extracted successfully!',
        error: ''
      })
      setExtractedText(response.data.extracted_text)
    } catch (err) {
      console.error('Upload error:', err)
      setUploadStatus({
        loading: false,
        message: '',
        error: `❌ ${err.response?.data?.message || 'Upload failed'}`
      })
    }
  }

  const handleAnalyze = async () => {
    if (!extractedText) {
      setAnalysisError('⚠️ Please upload and extract a resume first.')
      return
    }
    if (!jobDescription.trim()) {
      setAnalysisError('⚠️ Job description is empty.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisError('')
    
    // Smooth transition: small delay to show overlay
    setTimeout(async () => {
      try {
        const response = await axios.post('http://127.0.0.1:10000/api/analyze', {
          resume_text: extractedText,
          job_description: jobDescription
        })
        setAnalysisResult(response.data.results)
      } catch (err) {
        console.error('Analysis error:', err)
        setAnalysisError(`❌ ${err.response?.data?.message || 'Analysis failed'}`)
      } finally {
        setIsAnalyzing(false)
      }
    }, 1200)
  }

  // Color helper for scores
  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80' // Green
    if (score >= 40) return '#fbbf24' // Yellow
    return '#f87171' // Red
  }

  return (
    <div className="App">
      {/* Full Screen Loading Overlay */}
      {isAnalyzing && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Analyzing Match...</p>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Our AI is comparing your skills to the job requirements.</p>
        </div>
      )}

      <header className="App-header">
        <h1>HireLens AI Analyzer</h1>
        
        {/* Backend Connectivity Status */}
        <div className="card connection-status" style={{ 
          background: backendData ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
          border: `1px solid ${backendData ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)'}`
        }}>
          {backendData ? (
            <span style={{ color: '#4ade80' }}>● Connected to API v1.0.1</span>
          ) : (
            <span style={{ color: '#f87171' }}>● Disconnected</span>
          )}
        </div>

        <div className="main-container">
          {/* Left Column: Inputs */}
          <div className="input-column">
            {/* Step 1: Job Description */}
            <div className="card">
              <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📄 Step 1: Job Description</h2>
              <textarea 
                placeholder="Paste the target job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
              />
            </div>

            {/* Step 2: Upload Resume */}
            <div className="card">
              <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📤 Step 2: Resume (PDF/Image)</h2>
              <div className="input-group">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf,.png,.jpg,.jpeg"
                  id="resume-file-input"
                  style={{ marginBottom: '15px' }}
                />
                <button 
                  onClick={handleUpload} 
                  disabled={uploadStatus.loading || !selectedFile}
                  style={{ width: '100%' }}
                >
                  {uploadStatus.loading ? '⚙️ Processing...' : 'Process Resume'}
                </button>
              </div>
              {uploadStatus.message && <p className="success-txt" style={{ marginTop: '10px' }}>{uploadStatus.message}</p>}
              {uploadStatus.error && <p className="error-txt" style={{ marginTop: '10px' }}>{uploadStatus.error}</p>}
            </div>

            {/* Step 3: Analyze */}
            <button 
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!extractedText || !jobDescription.trim() || isAnalyzing}
            >
              🔍 Run ATS Analysis
            </button>
            {analysisError && <p className="error-txt" style={{ marginTop: '15px', fontWeight: 600 }}>{analysisError}</p>}
          </div>

          {/* Right Column: Results */}
          <div className="result-column">
            {analysisResult ? (
              <div className="card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>📊 Analysis Intelligence</h2>
                
                <div className="score-boxes">
                  <div className="score-box">
                    <span className="score-val" style={{ color: getScoreColor(analysisResult.match_score) }}>
                      {analysisResult.match_score}%
                    </span>
                    <span className="score-label">Job Match</span>
                  </div>
                  <div className="score-box">
                    <span className="score-val">
                      {analysisResult.resume_score}
                    </span>
                    <span className="score-label">ATS Quality</span>
                  </div>
                </div>

                <div className="skill-section">
                  <h3 style={{ fontSize: '1rem', color: '#94a3b8' }}>Matched Keywords</h3>
                  <div className="chips">
                    {analysisResult.matched_skills.map(s => <span key={s} className="chip match">{s}</span>)}
                    {analysisResult.matched_skills.length === 0 && <span style={{ color: '#475569' }}>None found</span>}
                  </div>
                </div>

                <div className="skill-section">
                  <h3 style={{ fontSize: '1rem', color: '#94a3b8' }}>Skill Gaps</h3>
                  <div className="chips">
                    {analysisResult.missing_skills.map(s => <span key={s} className="chip missing">{s}</span>)}
                    {analysisResult.missing_skills.length === 0 && <span style={{ color: '#475569' }}>Perfect match!</span>}
                  </div>
                </div>

                <div className="recommendations" style={{ marginTop: '30px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '15px' }}>💡 Smart Recommendations</h3>
                  <ul>
                    {analysisResult.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', textAlign: 'center' }}>
                <div>
                  <p style={{ fontSize: '3rem', margin: 0 }}>📊</p>
                  <p style={{ fontWeight: 600 }}>Your report will appear here.</p>
                  <p style={{ fontSize: '0.9rem' }}>Upload your resume and paste a job description <br/> to generate your ATS scores.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
