import React from 'react'
import { Globe } from 'lucide-react'
import { Button } from './ui/Button'

export default function LinkedInConnectPrompt() {
  const handleConnect = () => {
    // Redirect to the backend OAuth initiation route
    window.location.href = 'http://localhost:10000/api/auth/linkedin'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[220px] border-2 border-dashed border-warm-border rounded-[14px] bg-warm-bg/30 px-6 text-center gap-5">
      <div className="w-12 h-12 rounded-xl bg-white border border-warm-border flex items-center justify-center shadow-sm">
        <Globe size={28} className="text-[#0A66C2]" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-[15px] font-bold text-ink">Connect LinkedIn Profile</h4>
        <p className="text-[13px] text-muted font-medium max-w-[240px]">
          Populate your professional profile with verified experience and endorsements.
        </p>
      </div>
      <Button 
        onClick={handleConnect}
        className="bg-amber-deep hover:bg-terra text-white px-6 py-2 rounded-lg text-[13px] font-bold shadow-sm transition-all"
      >
        Connect via OAuth 2.0
      </Button>
    </div>
  )
}
