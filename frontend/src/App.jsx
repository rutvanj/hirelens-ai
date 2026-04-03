import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // Connection state
  const [backendData, setBackendData] = useState(null)
  
  // Upload states
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState({ 
    loading: false, 
    message: '', 
    error: '' 
  })

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
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({ ...uploadStatus, error: 'Please select a file first!' })
      return
    }

    setUploadStatus({ loading: true, message: 'Uploading...', error: '' })

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
        message: response.data.message,
        error: ''
      })
    } catch (err) {
      console.error('Upload error:', err)
      setUploadStatus({
        loading: false,
        message: '',
        error: err.response?.data?.message || 'Failed to upload file. Check console for details.'
      })
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
            <p style={{ color: 'green' }}>● Connected to API v{backendData.version}</p>
          ) : (
            <p style={{ color: 'red' }}>● Disconnected</p>
          )}
        </div>

        {/* Resume Upload Section */}
        <div className="card upload-section">
          <h2>Upload Resume</h2>
          <p>Support: .pdf, .png, .jpg</p>
          
          <div className="input-group">
            <input 
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf,.png,.jpg,.jpeg"
              id="resume-upload"
            />
            <button 
              onClick={handleUpload} 
              disabled={uploadStatus.loading || !selectedFile}
              className="upload-button"
            >
              {uploadStatus.loading ? 'Uploading...' : 'Analyze Resume'}
            </button>
          </div>

          {/* Feedback Messages */}
          {uploadStatus.message && (
            <div className="message success-message">
              ✅ {uploadStatus.message}
            </div>
          )}
          {uploadStatus.error && (
            <div className="message error-message">
              ❌ {uploadStatus.error}
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default App
