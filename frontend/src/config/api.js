// API configuration for production and development
const getApiBaseUrl = () => {
  // For production, try environment variable first, then fallback to common deployment URLs
  if (process.env.NODE_ENV === 'production') {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    
    // Auto-detect common deployment patterns
    if (window.location.hostname.includes('vercel.app')) {
      // For Vercel deployments, you'll need to replace this with your actual backend URL
      return 'https://your-backend-url.vercel.app/api';
    }
    
    if (window.location.hostname.includes('netlify.app')) {
      // For Netlify deployments
      return 'https://your-backend-url.netlify.app/api';
    }
    
    // Default production fallback - replace with your deployed backend URL
    return 'https://your-backend-url.herokuapp.com/api';
  }
  
  // Development
  return 'http://localhost:3004';
};

const API_BASE_URL = getApiBaseUrl();

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export default API_BASE_URL;