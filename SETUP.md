# GitHub Battle Platform Setup Guide

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: `github-battle-platform` (or your choice)
4. Enable/disable Google Analytics as preferred
5. Create project

### 2. Setup Firestore Database
1. Navigate to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Done"

### 3. Generate Service Account Credentials
1. Go to Project Settings (⚙️ gear icon)
2. Click on "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file (keep it secure!)

### 4. Configure Environment Variables
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in the Firebase values from your downloaded JSON:

```bash
# Firebase Configuration (from your service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FULL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

**Important Notes:**
- Keep the `\n` characters in the private key
- Wrap the entire private key in double quotes
- Never commit the actual `.env` file to version control

## 🐙 GitHub API Setup

### 1. Create GitHub Personal Access Token
1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "GitHub Battle Platform"
4. Set expiration (90 days recommended for development)
5. Select these scopes:
   - `public_repo` (to read public repositories)
   - `read:user` (to read public user profile data)
   - `user:email` (to read user email addresses)

### 2. Add GitHub Token to Environment
Add to your `backend/.env`:

```bash
GITHUB_TOKEN=ghp_your_token_here
```

### 3. Test GitHub API Connection
Once configured, test with:
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

## 🚀 Starting the Application

### Backend (Port 3001)
```bash
cd backend
npm install
npm start
```

### Frontend (Port 3002)
```bash
cd frontend
npm install
npm start
```

### Verify Everything Works
1. Backend health check: http://localhost:3001/api/health
2. Frontend app: http://localhost:3002
3. Test user comparison with your GitHub username

## 📊 Firebase Collections Structure

The app automatically creates these Firestore collections:

### `comparisons`
```json
{
  "comparisonId": "unique-id",
  "user1": "username1",
  "user2": "username2", 
  "winner": "username1",
  "scores": {
    "user1": 85.5,
    "user2": 72.3
  },
  "timestamp": "2024-10-04T...",
  "metadata": { ... }
}
```

### `leaderboard`
```json
{
  "username": "octocat",
  "totalScore": 1250,
  "totalComparisons": 15,
  "wins": 12,
  "rank": 1,
  "lastUpdated": "2024-10-04T..."
}
```

### `users`
```json
{
  "username": "octocat",
  "profile": { ... },
  "lastFetched": "2024-10-04T...",
  "cacheExpiry": "2024-10-04T..."
}
```

## 🔐 Security Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Rotate tokens** regularly (every 90 days)
3. **Use test mode** for Firestore during development
4. **Set up Firestore security rules** before production
5. **Monitor Firebase usage** in the console

## 🐛 Troubleshooting

### Firebase Connection Issues
- Check if all environment variables are set correctly
- Verify the private key format (should include `\n` characters)
- Ensure Firestore is enabled in your Firebase project

### GitHub API Issues
- Verify token has correct permissions
- Check rate limits (5000 requests/hour for authenticated requests)
- Ensure token hasn't expired

### Port Conflicts
- Backend default: 3001 (configurable via PORT env var)
- Frontend default: 3002 (configurable via PORT env var)
- Use `netstat -ano | findstr :PORT` to check what's using a port

## 📈 Rate Limits

- **GitHub API**: 5,000 requests/hour with token
- **Firebase**: 50,000 document reads/day (free tier)
- **App Rate Limiting**: 100 requests per 15 minutes per IP