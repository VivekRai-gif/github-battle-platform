import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Compare from './pages/Compare';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import { ThemeProvider } from './utils/ThemeContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">GitHub Battle Platform</h2>
          <p className="text-gray-500">Loading awesome comparisons...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-github-bg transition-colors duration-200">
          <Header />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/compare/:comparisonId" element={<Compare />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

// 404 Not Found Component
const NotFound = () => (
  <div className="container mx-auto px-4 py-16 text-center">
    <div className="max-w-md mx-auto">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-github-text mb-4">
        Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-github-muted mb-6">
        The page you're looking for doesn't exist. Let's get you back to comparing some awesome GitHub profiles!
      </p>
      <a
        href="/"
        className="btn-primary inline-block"
      >
        Back to Home
      </a>
    </div>
  </div>
);

export default App;