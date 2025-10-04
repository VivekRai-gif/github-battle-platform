import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Link2, Copy } from 'lucide-react';

const SocialShare = ({ winner, loser, scoreDifference, comparisonData }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate shareable URL (you can customize this based on your deployment)
  const shareUrl = window.location.href;
  
  // Default sharing text
  const getShareText = () => {
    const winnerScore = winner === comparisonData.user1.profile.username 
      ? comparisonData.user1.score.total 
      : comparisonData.user2.score.total;
    
    const loserScore = winner === comparisonData.user1.profile.username 
      ? comparisonData.user2.score.total 
      : comparisonData.user1.score.total;

    return `🚀 GitHub Battle Results! 🚀

🏆 @${winner} defeated @${loser}!
📊 Score: ${winnerScore.toLocaleString()} vs ${loserScore.toLocaleString()}
⚡ Victory by ${scoreDifference.toLocaleString()} points!

Who will be the next GitHub champion? Battle your friends at GitHub Battle Platform! 💻

#GitHubBattle #CodingChallenge #DevLife`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(`GitHub Battle: @${winner} vs @${loser}`);
    const summary = encodeURIComponent(`@${winner} won the GitHub battle with ${scoreDifference.toLocaleString()} points difference!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
      >
        <Share2 className="w-5 h-5 mr-2" />
        Share Battle Results
      </button>

      {/* Share Menu */}
      {showShareMenu && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-github-card rounded-lg shadow-xl border border-gray-200 dark:border-github-border z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-github-text mb-3">
              Share this epic battle! 🚀
            </h3>
            
            {/* Preview Text */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-github-bg rounded-lg text-sm text-gray-700 dark:text-github-muted max-h-32 overflow-y-auto">
              {getShareText()}
            </div>

            {/* Social Media Buttons */}
            <div className="space-y-2 mb-4">
              <button
                onClick={shareToTwitter}
                className="w-full flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 mr-3" />
                Share on Twitter
              </button>
              
              <button
                onClick={shareToFacebook}
                className="w-full flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5 mr-3" />
                Share on Facebook
              </button>
              
              <button
                onClick={shareToLinkedIn}
                className="w-full flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
              >
                <Link2 className="w-5 h-5 mr-3" />
                Share on LinkedIn
              </button>
            </div>

            {/* Copy Options */}
            <div className="space-y-2 border-t border-gray-200 dark:border-github-border pt-3">
              <button
                onClick={handleCopyText}
                className="w-full flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-github-bg dark:hover:bg-gray-700 text-gray-700 dark:text-github-text rounded-lg transition-colors"
              >
                <Copy className="w-5 h-5 mr-3" />
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-github-bg dark:hover:bg-gray-700 text-gray-700 dark:text-github-text rounded-lg transition-colors"
              >
                <Link2 className="w-5 h-5 mr-3" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close menu */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default SocialShare;