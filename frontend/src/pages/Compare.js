import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Users, Search, RefreshCw, Trophy } from 'lucide-react';
import ComparisonForm from '../components/ComparisonForm';
import ProfileCard from '../components/ProfileCard';
import WinnerDisplay from '../components/WinnerDisplay';
import WinnerPopup from '../components/WinnerPopup';
import ShareButton from '../components/ShareButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { compareUsers, getComparison } from '../utils/api';

const Compare = () => {
  const { comparisonId } = useParams();
  const [searchParams] = useSearchParams();
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [initialUsers, setInitialUsers] = useState({
    user1: searchParams.get('user1') || '',
    user2: searchParams.get('user2') || ''
  });

  // Load comparison from URL if comparisonId exists
  useEffect(() => {
    if (comparisonId) {
      loadComparison(comparisonId);
    }
  }, [comparisonId]);

  const loadComparison = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComparison(id);
      setComparisonData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (username1, username2) => {
    if (!username1.trim() || !username2.trim()) {
      setError('Please enter both usernames');
      return;
    }

    if (username1.toLowerCase() === username2.toLowerCase()) {
      setError('Cannot compare a user with themselves');
      return;
    }

    setLoading(true);
    setError(null);
    setComparisonData(null);

    try {
      const data = await compareUsers(username1, username2);
      setComparisonData(data);
      
      // Show winner popup after a brief delay for drama
      setTimeout(() => {
        setShowWinnerPopup(true);
      }, 1000);
      
      // Update URL without navigation
      window.history.replaceState(
        null, 
        '', 
        `/compare?user1=${encodeURIComponent(username1)}&user2=${encodeURIComponent(username2)}`
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setComparisonData(null);
    setError(null);
    setInitialUsers({ user1: '', user2: '' });
    window.history.replaceState(null, '', '/compare');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-github-text mb-4">
          GitHub Developer Comparison
        </h1>
        <p className="text-xl text-gray-600 dark:text-github-muted max-w-2xl mx-auto">
          Enter two GitHub usernames to compare their profiles, repositories, and contributions
        </p>
      </div>

      {/* Comparison Form */}
      <div className="max-w-2xl mx-auto mb-8">
        <ComparisonForm
          onCompare={handleCompare}
          loading={loading}
          initialUsers={initialUsers}
          disabled={loading}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="card bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <Search className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
            <button
              onClick={handleReset}
              className="mt-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" text="Fetching GitHub data..." />
        </div>
      )}

      {/* Comparison Results */}
      {comparisonData && !loading && (
        <div className="animate-fade-in">
          {/* Winner Display */}
          <WinnerDisplay
            winner={comparisonData.winner}
            user1={comparisonData.user1}
            user2={comparisonData.user2}
            scoreDifference={comparisonData.scoreDifference}
          />

          {/* Profile Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ProfileCard
              userData={comparisonData.user1}
              isWinner={comparisonData.winner === comparisonData.user1.profile.username}
              position="left"
            />
            <ProfileCard
              userData={comparisonData.user2}
              isWinner={comparisonData.winner === comparisonData.user2.profile.username}
              position="right"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <ShareButton
              comparisonId={comparisonData.comparisonId}
              user1={comparisonData.user1.profile.username}
              user2={comparisonData.user2.profile.username}
            />
            
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Comparison</span>
            </button>
          </div>

          {/* Comparison Insights */}
          {comparisonData.insights && comparisonData.insights.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Battle Insights
                </h3>
                <ul className="space-y-2">
                  {comparisonData.insights.map((insight, index) => (
                    <li key={index} className="text-gray-600 dark:text-github-muted flex items-start">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!comparisonData && !loading && !error && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-github-card rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-gray-400 dark:text-github-muted" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text mb-2">
            Ready to Start a Battle?
          </h3>
          <p className="text-gray-600 dark:text-github-muted">
            Enter two GitHub usernames above to begin the comparison
          </p>
        </div>
      )}

      {/* Winner Popup */}
      {comparisonData && (
        <WinnerPopup
          isOpen={showWinnerPopup}
          onClose={() => setShowWinnerPopup(false)}
          winner={comparisonData.winner}
          user1={comparisonData.user1}
          user2={comparisonData.user2}
          scoreDifference={comparisonData.scoreDifference}
        />
      )}
    </div>
  );
};

export default Compare;