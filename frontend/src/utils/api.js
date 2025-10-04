import axios from 'axios';

// Smart API URL detection for different deployment scenarios
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Production auto-detection
  if (process.env.NODE_ENV === 'production') {
    const hostname = window.location.hostname;
    
    // Auto-detect based on deployment platform
    if (hostname.includes('vercel.app')) {
      return 'https://your-backend-deployment.vercel.app/api';
    }
    if (hostname.includes('netlify.app')) {
      return 'https://your-backend-deployment.netlify.app/api';
    }
    if (hostname.includes('railway.app')) {
      return 'https://your-backend-deployment.railway.app/api';
    }
    
    // Default production API - REPLACE WITH YOUR ACTUAL BACKEND URL
    return 'https://your-backend-url.com/api';
  }
  
  // Development fallback
  return 'http://localhost:3004/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('🚨 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('🚨 API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (error.response?.status === 404) {
      throw new Error(error.response.data?.error || 'Resource not found');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'An error occurred');
  }
);

// API functions
export const compareUsers = async (username1, username2) => {
  const response = await api.post('/compare', {
    username1: username1.trim(),
    username2: username2.trim(),
  });
  return response.data;
};

export const getComparison = async (comparisonId) => {
  const response = await api.get(`/compare/${comparisonId}`);
  return response.data;
};

export const getUserHistory = async (username, limit = 10, offset = 0) => {
  const response = await api.get(`/compare/user/${username}/history`, {
    params: { limit, offset },
  });
  return response.data;
};

export const getLeaderboard = async (options = {}) => {
  const { limit = 50, period = 'all', sortBy = 'score' } = options;
  const response = await api.get('/leaderboard', {
    params: { limit, period, sortBy },
  });
  return response.data;
};

export const getUserLeaderboardStats = async (username) => {
  const response = await api.get(`/leaderboard/user/${username}`);
  return response.data;
};

export const getTrendingUsers = async (options = {}) => {
  const { limit = 20, period = 'week' } = options;
  const response = await api.get('/leaderboard/trending', {
    params: { limit, period },
  });
  return response.data;
};

export const getLeaderboardStats = async () => {
  const response = await api.get('/leaderboard/stats');
  return response.data;
};

export const getHealthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Utility functions
export const isValidUsername = (username) => {
  return /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/.test(username);
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

export const generateShareableUrl = (comparisonId) => {
  return `${window.location.origin}/compare/${comparisonId}`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export default api;