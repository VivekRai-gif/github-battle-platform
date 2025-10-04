import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, TrendingUp, Users, Calendar, Filter } from 'lucide-react';
import { getLeaderboard, getTrendingUsers } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatNumber, formatRelativeTime } from '../utils/api';

// Helper functions
const getRankIcon = (rank) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
  return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
};

const getRankBadge = (rank) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
  if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
  if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
  if (rank <= 10) return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
  return 'bg-gray-100 text-gray-700 dark:bg-github-card dark:text-github-text';
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [filters, setFilters] = useState({
    period: 'all',
    sortBy: 'highestScore',
    limit: 50
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leaderboardData, trendingData] = await Promise.all([
        getLeaderboard(filters),
        getTrendingUsers({ limit: 20, period: 'week' })
      ]);
      setLeaderboard(leaderboardData.leaderboard || []);
      setTrending(trendingData.trending || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
    { id: 'trending', name: 'Trending', icon: TrendingUp }
  ];

  const sortOptions = [
    { value: 'highestScore', label: 'Highest Score' },
    { value: 'totalComparisons', label: 'Most Battles' },
    { value: 'wins', label: 'Most Wins' },
    { value: 'averageScore', label: 'Average Score' }
  ];

  const periodOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-github-text mb-4">
          Developer Leaderboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-github-muted max-w-2xl mx-auto">
          See who ranks highest in the GitHub battle arena
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-github-card rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-github-bg text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-github-muted hover:text-gray-900 dark:hover:text-github-text'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters (only for leaderboard tab) */}
      {activeTab === 'leaderboard' && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600 dark:text-github-muted" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-github-text">
                Filters
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-github-text mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="input-field"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-github-text mb-2">
                  Period
                </label>
                <select
                  value={filters.period}
                  onChange={(e) => setFilters(prev => ({ ...prev, period: e.target.value }))}
                  className="input-field"
                >
                  {periodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-github-text mb-2">
                  Show Top
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                  className="input-field"
                >
                  <option value={25}>Top 25</option>
                  <option value={50}>Top 50</option>
                  <option value={100}>Top 100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" text="Loading rankings..." />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {activeTab === 'leaderboard' ? (
            <LeaderboardList leaderboard={leaderboard} />
          ) : (
            <TrendingList trending={trending} />
          )}
        </div>
      )}
    </div>
  );
};

const LeaderboardList = ({ leaderboard }) => (
  <div className="space-y-4">
    {leaderboard.map((user, index) => (
      <div
        key={user.username}
        className={`card flex items-center justify-between hover:shadow-lg transition-all duration-200 ${
          user.rank <= 3 ? 'border-2 border-yellow-200 dark:border-yellow-800' : ''
        }`}
      >
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getRankBadge(user.rank)}`}>
            {user.rank <= 3 ? (
              getRankIcon(user.rank)
            ) : (
              <span className="font-bold">#{user.rank}</span>
            )}
          </div>

          {/* User Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-github-text">
              @{user.username}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-github-muted">
              <span>{formatNumber(user.totalComparisons)} battles</span>
              <span>{user.winRate}% win rate</span>
              {user.lastUpdated && (
                <span>Active {formatRelativeTime(user.lastUpdated)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {formatNumber(user.highestScore)}
          </div>
          <div className="text-sm text-gray-600 dark:text-github-muted">
            Best Score
          </div>
          {user.averageScore && (
            <div className="text-xs text-gray-500 dark:text-github-muted">
              Avg: {formatNumber(user.averageScore)}
            </div>
          )}
        </div>
      </div>
    ))}

    {leaderboard.length === 0 && (
      <div className="text-center py-12">
        <Trophy className="w-12 h-12 text-gray-400 dark:text-github-muted mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text mb-2">
          No battles yet
        </h3>
        <p className="text-gray-600 dark:text-github-muted">
          Be the first to start a comparison!
        </p>
      </div>
    )}
  </div>
);

const TrendingList = ({ trending }) => (
  <div className="space-y-4">
    <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-github-text">
          Most Compared This Week
        </h3>
      </div>
      <p className="text-gray-600 dark:text-github-muted">
        These developers are generating the most buzz in the community
      </p>
    </div>

    {trending.map((user, index) => (
      <div
        key={user.username}
        className="card flex items-center justify-between hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            #{user.rank}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-github-text">
              @{user.username}
            </h3>
            <div className="text-sm text-gray-600 dark:text-github-muted">
              Featured in {user.comparisons} battles this week
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
            {user.comparisons}
          </span>
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
      </div>
    ))}

    {trending.length === 0 && (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 dark:text-github-muted mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text mb-2">
          No trending users yet
        </h3>
        <p className="text-gray-600 dark:text-github-muted">
          Start some battles to see trending developers!
        </p>
      </div>
    )}
  </div>
);

export default Leaderboard;