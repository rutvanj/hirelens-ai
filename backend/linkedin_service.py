import os
import requests
import time
from flask import session


class LinkedInService:
    def __init__(self):
        self.client_id = os.getenv("LINKEDIN_CLIENT_ID")
        self.client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
        self.redirect_uri = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:10000/api/auth/linkedin/callback")
        self.api_base = "https://api.linkedin.com/v2"
        self.cache = {} # Simple in-memory cache: {user_id: {data: ..., expires: ...}}

    def get_auth_url(self, state):
        scopes = "openid%20profile%20email" # Basic info for v2
        return f"https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={self.client_id}&redirect_uri={self.redirect_uri}&state={state}&scope={scopes}"

    def exchange_code_for_token(self, code):
        url = "https://www.linkedin.com/oauth/v2/accessToken"
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
        }
        response = requests.post(url, data=data)
        if response.status_code == 200:
            return response.json() # contains access_token, expires_in
        return {"error": f"LinkedIn Token Error: {response.status_code}", "details": response.text}

    def get_basic_profile(self, token):
        # Using OpenID Connect UserInfo endpoint
        url = "https://api.linkedin.com/v2/userinfo"
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            return resp.json()
        return {"error": "Failed to fetch basic profile"}

    def get_aggregated_profile(self, user_id, token):
        # Check cache
        if user_id in self.cache:
            entry = self.cache[user_id]
            if entry["expires"] > time.time():
                return entry["data"]

        # Fetch live data
        profile = self.get_basic_profile(token)
        if "error" in profile:
            return profile

        # Aggregated structure (mocking Positions/Education for now as they often require special permissions/V1 APIs)
        # In actual v2, 'me' projection is used.
        # r_liteprofile typically gives name/photo.
        
        aggregated = {
            "connected": True,
            "profile": {
                "name": profile.get("name", "LinkedIn User"),
                "avatar_url": profile.get("picture", ""),
                "headline": "Professional from LinkedIn",
                "location": profile.get("locale", {}).get("country", "Global"),
                "linkedin_url": "#"
            },
            "experience": [
                {
                    "title": "Senior Engineer",
                    "organization": "Verified Organization",
                    "period": "2021 — Present",
                    "duration_label": "2 yrs 8 mos",
                    "is_current": True
                }
            ],
            "education": [
                {
                    "degree": "B.S. Computer Science",
                    "institution": "Verified University",
                    "field": "CS",
                    "period": "2016 — 2020",
                    "grade": "A"
                }
            ],
            "skills": [
                { "name": "Python", "proficiency": "Expert" },
                { "name": "React", "proficiency": "Intermediate" }
            ],
            "meta": {
                "last_synced": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "is_stale": False
            }
        }

        # Save to cache (1 hour)
        self.cache[user_id] = {
            "data": aggregated,
            "expires": time.time() + 3600
        }
        return aggregated

    def invalidate_cache(self, user_id):
        if user_id in self.cache:
            del self.cache[user_id]
