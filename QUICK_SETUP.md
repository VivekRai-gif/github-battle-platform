# GitHub Battle Platform - Quick Setup Guide

## 🔥 Firebase Status: ✅ CONFIGURED
Your Firebase configuration is complete and ready to use!

## 🔑 GitHub API Setup - ACTION NEEDED

### Step 1: Get GitHub Personal Access Token
1. Visit: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Token settings:
   - **Name**: GitHub Battle Platform  
   - **Expiration**: 90 days (or your preference)
   - **Scopes**: Select these permissions:
     - ✅ `public_repo` (access public repositories)
     - ✅ `read:user` (read public user profile)

### Step 2: Configure Your Token
1. Copy the generated token (you'll only see it once!)
2. Open: `backend/.env`
3. Replace this line:
   ```
   GITHUB_TOKEN=your_github_personal_access_token_here
   ```
   With:
   ```
   GITHUB_TOKEN=ghp_your_actual_token_here
   ```

### Step 3: Restart Backend Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
cd backend
npm start
```

## 🧪 Test Your Setup
After adding the GitHub token, run:
```bash
cd backend
node test-connections.js
```

## 🚀 Application URLs
- **Frontend**: http://localhost:3002
- **Backend**: http://localhost:3001
- **API Health**: http://localhost:3001/api/health

## ✨ Your App Features
Once GitHub token is added, your platform will support:

1. **User Profile Comparison**
   - Real GitHub user validation
   - Repository analysis and scoring
   - Contribution statistics

2. **Firebase-Powered Features**
   - Leaderboard storage
   - Comparison history
   - Battle results persistence

3. **Advanced Scoring System** 
   - 10+ metrics including stars, forks, commits
   - Language diversity analysis
   - Activity and consistency scoring

## 🎯 Next Steps
1. Add GitHub token to `.env`
2. Restart backend server  
3. Test with real GitHub usernames
4. Enjoy your GitHub Battle Platform! 🏆