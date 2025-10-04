# Deployment Guide

## Frontend Deployment (Vercel/Netlify)

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set the build directory to `frontend`
3. Add environment variables in Vercel dashboard:
   ```
   REACT_APP_API_URL = https://your-backend-url.com/api
   ```

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`
4. Add environment variables in Netlify dashboard:
   ```
   REACT_APP_API_URL = https://your-backend-url.com/api
   ```

## Backend Deployment Options

### Railway
1. Connect your GitHub repository
2. Set start command to: `cd backend && npm start`
3. Add environment variables:
   ```
   GITHUB_TOKEN=your_github_token
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

### Render
1. Connect your GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables as above

### Heroku
1. Create new Heroku app
2. Connect GitHub repository
3. Set buildpack to Node.js
4. Add environment variables in Heroku dashboard

## Environment Variables Setup

### Required Backend Variables
```
PORT=3004
GITHUB_TOKEN=your_github_personal_access_token
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
NODE_ENV=production
```

### Required Frontend Variables
```
REACT_APP_API_URL=https://your-deployed-backend-url.com/api
```

## Quick Fix for Current Deployment Error

If you're deploying to Vercel and getting the environment variable error:

1. **Option 1**: Remove environment variable requirement
   - The code now auto-detects and falls back gracefully
   - Deploy without setting REACT_APP_API_URL initially

2. **Option 2**: Set the environment variable in Vercel
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com/api`

3. **Option 3**: Deploy backend first, then frontend
   - Deploy your backend to Railway/Render/Heroku
   - Get the backend URL
   - Set REACT_APP_API_URL to that backend URL
   - Deploy frontend

## Testing Deployment

1. Deploy backend first and test API endpoints
2. Update REACT_APP_API_URL with the backend URL
3. Deploy frontend
4. Test the complete application