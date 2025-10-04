import React from 'react';
import { Github, MapPin, Building, Calendar, Star, GitFork, Users, Eye, Code, Trophy } from 'lucide-react';
import { formatNumber, formatDate } from '../utils/api';

const ProfileCard = ({ userData, isWinner, position }) => {
  const { profile, repositories, contributions, score } = userData;

  const getBadgeColor = (type) => {
    const colors = {
      'Star Master': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Commit King': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Influencer': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Polyglot': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Team Player': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      'default': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    };
    return colors[type] || colors.default;
  };

  const stats = [
    { icon: Users, label: 'Followers', value: formatNumber(profile.followers), color: 'text-blue-600' },
    { icon: Star, label: 'Total Stars', value: formatNumber(repositories.totalStars), color: 'text-yellow-600' },
    { icon: GitFork, label: 'Total Forks', value: formatNumber(repositories.totalForks), color: 'text-green-600' },
    { icon: Code, label: 'Repositories', value: formatNumber(repositories.total), color: 'text-purple-600' },
  ];

  const contributions_stats = [
    { label: 'Commits', value: formatNumber(contributions.commits), color: 'text-orange-600' },
    { label: 'Pull Requests', value: formatNumber(contributions.pullRequests), color: 'text-blue-600' },
    { label: 'Issues', value: formatNumber(contributions.issues), color: 'text-red-600' },
    { label: 'Reviews', value: formatNumber(contributions.reviews), color: 'text-green-600' },
  ];

  return (
    <div className={`card relative overflow-hidden ${isWinner ? 'winner-glow' : ''} transition-all duration-300`}>
      {/* Winner Badge */}
      {isWinner && (
        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
          <Trophy className="w-4 h-4" />
          <span>Winner</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex items-start space-x-4 mb-6">
        <img
          src={profile.avatar}
          alt={profile.username}
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-text truncate">
              {profile.name || profile.username}
            </h2>
            <a
              href={profile.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 dark:text-github-muted dark:hover:text-github-text transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-600 dark:text-github-muted text-lg">@{profile.username}</p>
          {profile.bio && (
            <p className="text-gray-700 dark:text-github-text mt-2 text-sm">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-2 mb-6">
        {profile.company && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-github-muted">
            <Building className="w-4 h-4" />
            <span>{profile.company}</span>
          </div>
        )}
        {profile.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-github-muted">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-github-muted">
          <Calendar className="w-4 h-4" />
          <span>Joined {formatDate(profile.createdAt)}</span>
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {score.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-github-muted">Battle Score</div>
          {score.metrics && (
            <div className="text-xs text-gray-500 dark:text-github-muted mt-1">
              Rating: {score.metrics.developerRating}/5.0 ⭐
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className={`${stat.color} mb-1`}>
              <stat.icon className="w-5 h-5 mx-auto" />
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-github-text">
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-github-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Contributions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-github-text mb-3">
          Last Year Contributions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {contributions_stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-lg font-semibold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-github-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Languages */}
      {repositories.languages && repositories.languages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-github-text mb-3">
            Top Languages
          </h3>
          <div className="space-y-2">
            {repositories.languages.slice(0, 5).map(([language, count], index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-github-text">{language}</span>
                <span className="text-sm text-gray-500 dark:text-github-muted">
                  {count} repos
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Repositories */}
      {repositories.topRepositories && repositories.topRepositories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-github-text mb-3">
            Top Repositories
          </h3>
          <div className="space-y-2">
            {repositories.topRepositories.slice(0, 3).map((repo, index) => (
              <div key={index} className="p-2 bg-gray-50 dark:bg-github-bg rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline truncate"
                  >
                    {repo.name}
                  </a>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center">
                      <GitFork className="w-3 h-3 mr-1" />
                      {repo.forks}
                    </span>
                  </div>
                </div>
                {repo.description && (
                  <p className="text-xs text-gray-600 dark:text-github-muted truncate">
                    {repo.description}
                  </p>
                )}
                {repo.language && (
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600 dark:text-github-muted">
                      {repo.language}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      {score.breakdown && (
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 dark:text-github-muted hover:text-gray-900 dark:hover:text-github-text">
            Score Breakdown
          </summary>
          <div className="mt-2 space-y-1 text-xs">
            {Object.entries(score.breakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 dark:text-github-muted capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                </span>
                <span className="text-gray-900 dark:text-github-text font-medium">
                  {Math.round(value)}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default ProfileCard;