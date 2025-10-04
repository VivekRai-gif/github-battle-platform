import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin } from 'lucide-react';
import { generateShareableUrl, copyToClipboard } from '../utils/api';

const ShareButton = ({ comparisonId, user1, user2 }) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = generateShareableUrl(comparisonId);
  const shareText = `Check out this GitHub battle: @${user1} vs @${user2}! 🚀`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'text-blue-400 hover:text-blue-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'text-blue-700 hover:text-blue-800'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary flex items-center space-x-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share Battle</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Share Menu */}
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg shadow-lg z-50 p-4 min-w-64">
            <h3 className="font-semibold text-gray-900 dark:text-github-text mb-3">
              Share this battle
            </h3>

            {/* Copy Link */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-github-muted mb-2">
                Copy link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-github-border rounded-lg bg-gray-50 dark:bg-github-bg text-gray-700 dark:text-github-text"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Link copied to clipboard!
                </p>
              )}
            </div>

            {/* Social Share */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-github-muted mb-2">
                Share on social media
              </label>
              <div className="flex space-x-3">
                {shareLinks.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-gray-100 dark:bg-github-bg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 ${platform.color}`}
                    title={`Share on ${platform.name}`}
                  >
                    <platform.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Battle Info */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-github-border">
              <div className="text-sm text-gray-600 dark:text-github-muted">
                <strong>Battle:</strong> @{user1} vs @{user2}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;