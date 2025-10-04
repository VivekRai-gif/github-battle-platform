import React from 'react';
import { Trophy, Crown, Medal, Zap } from 'lucide-react';
import SocialShare from './SocialShare';

const WinnerDisplay = ({ winner, user1, user2, scoreDifference }) => {
  // Since we eliminated ties, we always have a winner
  const winnerData = winner === user1.profile.username ? user1 : user2;
  const loserData = winner === user1.profile.username ? user2 : user1;

  const getWinnerIcon = () => {
    if (scoreDifference > 1000) return Crown;
    if (scoreDifference > 500) return Trophy;
    return Medal;
  };

  const WinnerIcon = getWinnerIcon();

  const getWinMargin = () => {
    const percentage = (scoreDifference / loserData.score.total) * 100;
    if (percentage > 50) return 'Dominant Victory! 🔥';
    if (percentage > 25) return 'Clear Victory! ⚡';
    if (percentage > 10) return 'Close Victory! 🚀';
    return 'Narrow Victory! 🎯';
  };

  const getVictoryMessage = () => {
    const percentage = (scoreDifference / loserData.score.total) * 100;
    if (percentage > 50) return 'An absolute domination in the coding arena!';
    if (percentage > 25) return 'A commanding performance that leaves no doubt!';
    if (percentage > 10) return 'A solid showing of coding expertise!';
    return 'A thrilling battle that came down to the wire!';
  };

  const getWinnerGradient = () => {
    if (scoreDifference > 1000) return 'from-yellow-400 via-yellow-500 to-yellow-600';
    if (scoreDifference > 500) return 'from-blue-400 via-blue-500 to-blue-600';
    return 'from-green-400 via-green-500 to-green-600';
  };

  return (
    <div className="text-center mb-12 animate-bounce-in">
      {/* Winner Announcement */}
      <div className="relative mb-6">
        <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${getWinnerGradient()} rounded-full mb-4 animate-pulse-slow`}>
          <WinnerIcon className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Zap className="w-8 h-8 text-yellow-400 animate-bounce" />
        </div>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-github-text mb-2">
        <span className="gradient-text">@{winnerData.profile.username}</span> Wins!
      </h2>
      
      <p className="text-xl text-gray-600 dark:text-github-muted mb-2">
        {getVictoryMessage()}
      </p>
      
      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">
        {getWinMargin()}
      </p>

      {/* Score Comparison */}
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Winner Score */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2">
              <img
                src={winnerData.profile.avatar}
                alt={winnerData.profile.username}
                className="w-full h-full rounded-full border-4 border-yellow-400 shadow-lg"
              />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {winnerData.score.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-github-muted">
              @{winnerData.profile.username}
            </div>
          </div>

          {/* VS Separator */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400 dark:text-github-muted">VS</div>
            <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
              +{scoreDifference.toLocaleString()}
            </div>
          </div>

          {/* Loser Score */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2">
              <img
                src={loserData.profile.avatar}
                alt={loserData.profile.username}
                className="w-full h-full rounded-full border-4 border-gray-300 shadow-lg opacity-75"
              />
            </div>
            <div className="text-3xl font-bold text-gray-500 dark:text-gray-400">
              {loserData.score.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-github-muted">
              @{loserData.profile.username}
            </div>
          </div>
        </div>

        {/* Battle Stats */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-github-text">
                Win Margin
              </div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {Math.round((scoreDifference / loserData.score.total) * 100)}%
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-github-text">
                Total Battle Score
              </div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {(winnerData.score.total + loserData.score.total).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-github-text">
                Battle Rating
              </div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {scoreDifference > 1000 ? 'Epic' : 
                 scoreDifference > 500 ? 'Great' : 
                 scoreDifference > 100 ? 'Good' : 'Close'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Message */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg max-w-md mx-auto">
        <p className="text-yellow-800 dark:text-yellow-200 font-medium">
          🎉 Epic coding battle complete! Share this victory with the world! 🌟
        </p>
      </div>

      {/* Social Share */}
      <div className="mt-6 flex justify-center">
        <SocialShare 
          winner={winnerData.profile.username}
          loser={loserData.profile.username}
          scoreDifference={scoreDifference}
          comparisonData={{ user1, user2 }}
        />
      </div>
    </div>
  );
};

export default WinnerDisplay;