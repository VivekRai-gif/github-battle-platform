import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import ComparisonForm from '../components/ComparisonForm';
import ProfileCard from '../components/ProfileCard';
import WinnerPopup from '../components/WinnerPopup';
import LoadingSpinner from '../components/LoadingSpinner';
import DebugPanel from '../components/DebugPanel';
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
      
      // Check if the API response has error
      if (data.error) {
        setError(data.error);
        return;
      }
      
      // Validate the response structure
      if (!data || !data.user1 || !data.user2 || !data.user1.profile || !data.user2.profile) {
        setError('Invalid comparison data. Please try again.');
        return;
      }
      
      setComparisonData(data);
    } catch (error) {
      console.error('Load comparison error:', error);
      setError('Failed to load comparison. Please try again.');
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
      console.log('🔍 Comparing users:', username1, 'vs', username2);
      const data = await compareUsers(username1, username2);
      
      console.log('📊 API Response:', data);
      
      // Check if the API response has error
      if (data.error) {
        console.error('❌ API returned error:', data.error);
        setError(data.error);
        return;
      }
      
      // Validate the response structure
      if (!data || !data.user1 || !data.user2) {
        console.error('❌ Missing user data:', data);
        setError('Invalid response from server. User data is missing.');
        return;
      }
      
      if (!data.user1.profile || !data.user2.profile) {
        console.error('❌ Missing profile data:', data);
        setError('Invalid response from server. Profile data is missing.');
        return;
      }
      
      if (!data.winner) {
        console.error('❌ No winner determined:', data);
        setError('Unable to determine winner. Please try again.');
        return;
      }
      
      console.log('✅ Comparison successful!');
      console.log('Winner:', data.winner);
      console.log('User1:', data.user1.profile.username);
      console.log('User2:', data.user2.profile.username);
      
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
      console.error('Comparison error:', error);
      setError('Failed to fetch user data. Please check the usernames and try again.');
    } finally {
      setLoading(false);
    }
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
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" text="Fetching GitHub data..." />
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


      {/* Winner Popup and Results - bulletproof null checks and fallback UI */}
      {comparisonData && comparisonData.user1 && comparisonData.user2 && comparisonData.user1.profile && comparisonData.user2.profile && comparisonData.winner ? (
        <>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start mt-8">
            <ProfileCard user={comparisonData.user1} highlight={comparisonData.winner === 'user1'} />
            <ProfileCard user={comparisonData.user2} highlight={comparisonData.winner === 'user2'} />
          </div>
          <WinnerPopup
            isOpen={showWinnerPopup}
            onClose={() => setShowWinnerPopup(false)}
            winner={comparisonData.winner === 'user1' ? comparisonData.user1 : comparisonData.user2}
            user1={comparisonData.user1}
            user2={comparisonData.user2}
            scoreDifference={comparisonData.scoreDifference}
          />
        </>
      ) : comparisonData ? (
        <div className="mt-8 text-center text-red-600">
          <p>Sorry, we couldn't display the results due to missing or invalid data. Please try again.</p>
        </div>
      ) : null}

      {/* Debug Panel - only show in development */}
      {process.env.NODE_ENV === 'development' && <DebugPanel />}
    </div>
  );
};

export default Compare;