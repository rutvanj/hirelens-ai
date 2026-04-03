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
    setSelectedFile(event.target.files[0])
    setUploadStatus({ loading: false, message: '', error: '' })
    setExtractedText('')
    setAnalysisResult(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ ...uploadStatus, error: 'Please select a file first!' })
      return
    }

    setUploadStatus({ loading: true, message: 'Uploading & Extracting...', error: '' })

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post('http://127.0.0.1:10000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setUploadStatus({
        loading: false,
        message: 'Resume extracted successfully! Now add Job Description.',
        error: ''
      })
      setExtractedText(response.data.extracted_text)
    } catch (err) {
      console.error('Upload error:', err)
      setUploadStatus({
        loading: false,
        message: '',
        error: err.response?.data?.message || 'Failed to upload. Check console.'
      })
    }
  }

  const handleAnalyze = async () => {
    if (!extractedText) {
      setAnalysisError('Please upload and extract a resume first.')
      return
    }
    if (!jobDescription) {
      setAnalysisError('Please provide a job description for matching.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisError('')
    setAnalysisResult(null)

    try {
      const response = await axios.post('http://127.0.0.1:10000/api/analyze', {
        resume_text: extractedText,
        job_description: jobDescription
      })
      
      setAnalysisResult(response.data.results)
      setIsAnalyzing(false)
    } catch (err) {
      console.error('Analysis error:', err)
      setAnalysisError(err.response?.data?.message || 'Analysis failed. Check backend.')
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Resume Analyzer</h1>
        
        {/* Backend Connectivity Status */}
        <div className="card connection-status">
          <h3>Backend Status:</h3>
          {backendData ? (
            <p style={{ color: '#4caf50' }}>● Connected to API v{backendData.version}</p>
          ) : (
            <p style={{ color: '#f44336' }}>● Disconnected</p>
          )}
        </div>

        <div className="main-container">
          {/* Left Column: Inputs */}
          <div className="input-column">
            {/* Step 1: Job Description */}
            <div className="card jd-section">
              <h2>Step 1: Job Description</h2>
              <textarea 
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
              />
            </div>

            {/* Step 2: Upload Resume */}
            <div className="card upload-section">
              <h2>Step 2: Upload Resume</h2>
              <div className="input-group">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <button 
                  onClick={handleUpload} 
                  disabled={uploadStatus.loading || !selectedFile}
                >
                  {uploadStatus.loading ? 'Processing...' : 'Upload & Extract'}
                </button>
              </div>
              {uploadStatus.message && <p className="success-txt">{uploadStatus.message}</p>}
              {uploadStatus.error && <p className="error-txt">{uploadStatus.error}</p>}
            </div>

            {/* Step 3: Analyze */}
            <button 
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!extractedText || !jobDescription || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : '🔍 Get ATS Analysis'}
            </button>
            {analysisError && <p className="error-txt">{analysisError}</p>}
          </div>

          {/* Right Column: Results */}
          <div className="result-column">
            {analysisResult ? (
              <div className="card result-card">
                <h2>ATS Analysis Results</h2>
                
                <div className="score-boxes">
                  <div className="score-box">
                    <span className="score-val">{analysisResult.match_score}%</span>
                    <span className="score-label">Match Score</span>
                  </div>
                  <div className="score-box">
                    <span className="score-val">{analysisResult.resume_score}/100</span>
                    <span className="score-label">Resume Score</span>
                  </div>
                </div>

                <div className="skill-section">
                  <h3>Matched Skills</h3>
                  <div className="chips">
                    {analysisResult.matched_skills.map(s => <span key={s} className="chip match">{s}</span>)}
                    {analysisResult.matched_skills.length === 0 && <span>None identified</span>}
                  </div>
                </div>

                <div className="skill-section">
                  <h3>Missing Skills</h3>
                  <div className="chips">
                    {analysisResult.missing_skills.map(s => <span key={s} className="chip missing">{s}</span>)}
                    {analysisResult.missing_skills.length === 0 && <span>No gaps identified!</span>}
                  </div>
                </div>

                <div className="recommendations">
                  <h3>Actionable Feedback</h3>
                  <ul>
                    {analysisResult.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="card placeholder-card">
                <p>Complete Steps 1 & 2 to view analysis.</p>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
