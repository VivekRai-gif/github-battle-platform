import React, { useState, useEffect } from 'react';
import { X, Trophy, Crown, Medal, Sparkles } from 'lucide-react';
import SocialShare from './SocialShare';

const WinnerPopup = ({ isOpen, onClose, winner, user1, user2, scoreDifference }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Animation sequence
      setTimeout(() => setAnimationPhase(1), 500);
      setTimeout(() => setAnimationPhase(2), 1000);
      setTimeout(() => setAnimationPhase(3), 1500);
    } else {
      setShowConfetti(false);
      setAnimationPhase(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const winnerData = winner === user1.profile.username ? user1 : user2;
  const loserData = winner === user1.profile.username ? user2 : user1;

  const getWinnerIcon = () => {
    if (scoreDifference > 1000) return Crown;
    if (scoreDifference > 500) return Trophy;
    return Medal;
  };

  const getVictoryLevel = () => {
    const percentage = (scoreDifference / loserData.score.total) * 100;
    if (percentage > 50) return 'LEGENDARY';
    if (percentage > 25) return 'EPIC';
    if (percentage > 10) return 'GREAT';
    return 'CLOSE';
  };

  const getVictoryMessage = () => {
    const percentage = (scoreDifference / loserData.score.total) * 100;
    if (percentage > 50) return 'Total domination! 🔥';
    if (percentage > 25) return 'Impressive victory! ⚡';
    if (percentage > 10) return 'Well-fought battle! 🚀';
    return 'Nail-biting finish! 🎯';
  };

  const WinnerIcon = getWinnerIcon();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 text-2xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div className="bg-white dark:bg-github-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with dramatic effect */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white p-8 rounded-t-2xl text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white to-transparent transform rotate-45"></div>
          </div>
          
          <div className="relative z-10">
            {/* Trophy Icon with Animation */}
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4 transform transition-all duration-1000 ${animationPhase >= 1 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
              <WinnerIcon className="w-10 h-10 text-white" />
            </div>

            {/* Victory Level */}
            <div className={`text-lg font-bold mb-2 transform transition-all duration-1000 delay-300 ${animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {getVictoryLevel()} VICTORY!
            </div>

            {/* Winner Name */}
            <h1 className={`text-3xl md:text-4xl font-black mb-2 transform transition-all duration-1000 delay-500 ${animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              🏆 @{winnerData.profile.username} WINS! 🏆
            </h1>

            {/* Victory Message */}
            <p className={`text-lg opacity-90 transform transition-all duration-1000 delay-700 ${animationPhase >= 3 ? 'translate-y-0 opacity-90' : 'translate-y-4 opacity-0'}`}>
              {getVictoryMessage()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Score Comparison */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Winner */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 relative">
                  <img
                    src={winnerData.profile.avatar}
                    alt={winnerData.profile.username}
                    className="w-full h-full rounded-full border-4 border-yellow-400 shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {winnerData.score.total.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-github-muted">
                  @{winnerData.profile.username}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  WINNER
                </div>
              </div>

              {/* VS and Difference */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-1">VS</div>
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  +{scoreDifference.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">point lead</div>
              </div>

              {/* Loser */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3">
                  <img
                    src={loserData.profile.avatar}
                    alt={loserData.profile.username}
                    className="w-full h-full rounded-full border-4 border-gray-300 shadow-lg opacity-75"
                  />
                </div>
                <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                  {loserData.score.total.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-github-muted">
                  @{loserData.profile.username}
                </div>
                <div className="text-xs text-gray-500 font-semibold">
                  CHALLENGER
                </div>
              </div>
            </div>
          </div>

          {/* Battle Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {Math.round((scoreDifference / loserData.score.total) * 100)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-github-muted">Win Margin</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {(winnerData.score.total + loserData.score.total).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-github-muted">Total Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {scoreDifference > 1000 ? 'Epic' : scoreDifference > 500 ? 'Great' : 'Close'}
                </div>
                <div className="text-xs text-gray-600 dark:text-github-muted">Battle Rating</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {getVictoryLevel()}
                </div>
                <div className="text-xs text-gray-600 dark:text-github-muted">Victory Type</div>
              </div>
            </div>
          </div>

          {/* Social Share */}
          <div className="flex justify-center">
            <SocialShare 
              winner={winnerData.profile.username}
              loser={loserData.profile.username}
              scoreDifference={scoreDifference}
              comparisonData={{ user1, user2 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerPopup;