# 🚀 GitHub Battle Platform

A comprehensive web platform for comparing GitHub users' profiles, repositories, and contribution stats. Built with React, Node.js, and powered by the GitHub API.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://your-demo-url.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/your-username/github-battle-platform)

## ✨ Features

### 🎯 Core Features
- **Developer Comparison**: Enter two GitHub usernames and get detailed side-by-side analysis
- **Intelligent Scoring**: Advanced algorithm considering followers, stars, forks, commits, and more
- **Real-time Data**: Fresh data directly from GitHub API
- **Interactive Visualizations**: Charts for programming languages and repository statistics
- **Global Leaderboard**: Track top developers and trending users
- **Shareable Results**: Generate shareable links for battle results
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes for better user experience

### 📊 Scoring System
Our comprehensive scoring algorithm evaluates:
- **+1 point** per follower
- **+2 points** per repository star
- **+3 points** per repository fork
- **+1 point** per commit (last year)
- **+5 points** per pull request (last year)
- **+2 points** per issue (last year)
- **+3 points** per code review (last year)
- **+1 point** per original repository
- **+10 points** per unique programming language (max 5)
- **+0.1 points** per day since account creation

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 | Modern UI library |
| | TailwindCSS | Utility-first CSS framework |
| | React Router | Client-side routing |
| | Chart.js | Data visualizations |
| | Lucide Icons | Beautiful icons |
| **Backend** | Node.js & Express | API server |
| | GitHub REST API | User and repository data |
| | Axios | HTTP client |
| **Database** | Firebase Firestore | Real-time leaderboard |
| **Hosting** | Vercel/Netlify | Frontend deployment |
| | Render/Railway | Backend deployment |

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- GitHub Personal Access Token
- Firebase project (optional, for leaderboard)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/github-battle-platform.git
   cd github-battle-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   **Backend (.env)**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env`:
   ```env
   # GitHub API
   GITHUB_TOKEN=your_github_personal_access_token
   PORT=5000
   NODE_ENV=development
   
   # Firebase (optional)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_key\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your_client_email
   
   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

   **Frontend (.env)**
   ```bash
   # Create frontend/.env.local
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both frontend (http://localhost:3000) and backend (http://localhost:5000)

## 📋 Detailed Setup

### GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `read:user`, `user:email`
4. Copy the token and add it to your `.env` file

### Firebase Setup (Optional)

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Create a service account:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Add the credentials to your `.env` file

### Environment Variables Reference

#### Backend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Yes | GitHub Personal Access Token |
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | Environment (development/production) |
| `FIREBASE_PROJECT_ID` | No | Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | No | Firebase private key |
| `FIREBASE_CLIENT_EMAIL` | No | Firebase client email |
| `FRONTEND_URL` | No | Frontend URL for CORS |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window (default: 15min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Max requests per window (default: 100) |

#### Frontend Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | No | Backend API URL (default: http://localhost:5000/api) |

## 📖 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-api-domain.com/api`

### Endpoints

#### Compare Users
```http
POST /compare
Content-Type: application/json

{
  "username1": "octocat",
  "username2": "github"
}
```

**Response:**
```json
{
  "user1": {
    "profile": { ... },
    "repositories": { ... },
    "contributions": { ... },
    "score": { "total": 1250, "breakdown": { ... } }
  },
  "user2": { ... },
  "winner": "octocat",
  "scoreDifference": 450,
  "comparisonId": "unique_id",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Get Comparison
```http
GET /compare/:comparisonId
```

#### Get Leaderboard
```http
GET /leaderboard?limit=50&period=all&sortBy=highestScore
```

#### Get Trending Users
```http
GET /leaderboard/trending?limit=20&period=week
```

#### Health Check
```http
GET /health
```

### Error Responses

```json
{
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (user not found)
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## 🏗️ Project Structure

```
github-battle-platform/
├── frontend/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── ProfileCard.js
│   │   │   ├── WinnerDisplay.js
│   │   │   ├── ComparisonForm.js
│   │   │   ├── ShareButton.js
│   │   │   └── LoadingSpinner.js
│   │   ├── pages/              # Page components
│   │   │   ├── Home.js
│   │   │   ├── Compare.js
│   │   │   ├── Leaderboard.js
│   │   │   └── About.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── api.js          # API client
│   │   │   └── ThemeContext.js # Theme management
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                     # Node.js backend
│   ├── routes/                 # API routes
│   │   ├── compare.js          # User comparison endpoints
│   │   └── leaderboard.js      # Leaderboard endpoints
│   ├── services/               # Business logic
│   │   ├── GitHubService.js    # GitHub API integration
│   │   ├── ScoreService.js     # Scoring algorithm
│   │   └── FirebaseService.js  # Database operations
│   ├── models/                 # Data models (if using MongoDB)
│   ├── server.js               # Express server
│   ├── package.json
│   └── .env.example            # Environment variables template
├── package.json                # Root package.json
├── README.md                   # This file
└── .gitignore
```

## 🎨 UI Components

### ProfileCard
Displays user profile with:
- Avatar and basic info
- Battle score with breakdown
- Repository statistics
- Top programming languages
- Recent contributions
- Top repositories

### WinnerDisplay
Shows battle results with:
- Winner announcement
- Score comparison
- Win margin calculation
- Battle statistics

### ComparisonForm
User input form with:
- Username validation
- Swap functionality
- Quick example buttons
- Loading states

### Leaderboard
Rankings display with:
- Filterable leaderboard
- Trending users section
- Rank indicators
- Statistics overview

## 🔧 Development

### Available Scripts

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build frontend for production
npm run build

# Start production server
npm start
```

### Code Style

- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS
- **Conventional Commits**: Commit message format

### Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   cd frontend
   vercel
   ```

2. **Environment Variables**
   - Add `REACT_APP_API_URL` in Vercel dashboard

3. **Build Settings**
   - Framework: React
   - Build Command: `npm run build`
   - Output Directory: `build`

### Frontend Deployment (Netlify)

1. **Connect Repository**
   - Link GitHub repository to Netlify

2. **Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

3. **Environment Variables**
   - Add `REACT_APP_API_URL` in Netlify settings

### Backend Deployment (Render)

1. **Create Web Service**
   - Connect GitHub repository
   - Root directory: `backend`

2. **Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add all backend environment variables

### Backend Deployment (Railway)

1. **Deploy from GitHub**
   ```bash
   # Railway CLI
   npm i -g @railway/cli
   railway login
   railway deploy
   ```

2. **Environment Variables**
   - Add via Railway dashboard or CLI

### Environment Setup for Production

**Frontend Environment Variables:**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

**Backend Environment Variables:**
```env
GITHUB_TOKEN=your_production_token
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase vars
```

## 🔒 Security Considerations

### Rate Limiting
- API requests limited to 100 per 15 minutes per IP
- GitHub API rate limiting respected

### Environment Variables
- Never commit sensitive data
- Use different tokens for development/production
- Rotate tokens regularly

### CORS Configuration
- Frontend URL whitelisted
- Credentials handling configured

### Input Validation
- Username format validation
- SQL injection prevention
- XSS protection

## 🐛 Troubleshooting

### Common Issues

1. **GitHub API Rate Limit**
   ```
   Error: rate limit exceeded
   ```
   - **Solution**: Add GitHub Personal Access Token to increase rate limit

2. **Firebase Connection Error**
   ```
   Error: Firebase initialization failed
   ```
   - **Solution**: Check Firebase credentials in environment variables
   - **Note**: App works without Firebase (leaderboard disabled)

3. **CORS Error**
   ```
   Error: blocked by CORS policy
   ```
   - **Solution**: Ensure `FRONTEND_URL` matches your frontend domain

4. **Build Errors**
   ```
   Module not found
   ```
   - **Solution**: Run `npm run install:all` to install all dependencies

### Debug Mode

Enable debug logging:
```bash
# Backend
DEBUG=* npm run dev

# Frontend
REACT_APP_DEBUG=true npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Coding Standards

- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test your changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing comprehensive developer data
- [React](https://reactjs.org/) for the awesome frontend framework
- [TailwindCSS](https://tailwindcss.com/) for beautiful and responsive styling
- [Lucide Icons](https://lucide.dev/) for clean and consistent icons
- [Firebase](https://firebase.google.com/) for real-time database capabilities

## 📞 Support

- 📧 Email: support@github-battle.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/github-battle-platform/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/github-battle-platform/discussions)

## 🗺️ Roadmap

### Phase 1 ✅
- [x] Basic user comparison
- [x] Scoring algorithm
- [x] Responsive UI
- [x] Leaderboard
- [x] Share functionality

### Phase 2 🚧
- [ ] GitHub OAuth login
- [ ] User profiles and history
- [ ] Enhanced visualizations with Chart.js
- [ ] Badge system
- [ ] API rate optimization

### Phase 3 📋
- [ ] AI-powered insights
- [ ] Team comparisons
- [ ] Weekly/monthly competitions
- [ ] Advanced filtering
- [ ] Export functionality

---

<div align="center">
  <h3>⭐ If you found this project helpful, please star it on GitHub! ⭐</h3>
  <p>Made with ❤️ for the developer community</p>
</div>