import React, { useState } from 'react';
import { Search, Users, ArrowRight } from 'lucide-react';
import { isValidUsername } from '../utils/api';

const ComparisonForm = ({ onCompare, loading, initialUsers, disabled }) => {
  const [usernames, setUsernames] = useState({
    user1: initialUsers?.user1 || '',
    user2: initialUsers?.user2 || ''
  });
  const [errors, setErrors] = useState({});

  const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (!isValidUsername(username.trim())) {
      return 'Invalid GitHub username format';
    }
    return null;
  };

  const handleInputChange = (field, value) => {
    setUsernames(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    const user1Error = validateUsername(usernames.user1);
    const user2Error = validateUsername(usernames.user2);
    
    if (user1Error) newErrors.user1 = user1Error;
    if (user2Error) newErrors.user2 = user2Error;
    
    if (usernames.user1.toLowerCase() === usernames.user2.toLowerCase()) {
      newErrors.general = 'Cannot compare a user with themselves';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onCompare(usernames.user1.trim(), usernames.user2.trim());
    }
  };

  const handleSwap = () => {
    setUsernames(prev => ({
      user1: prev.user2,
      user2: prev.user1
    }));
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User 1 Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-github-text mb-2">
            First Developer
          </label>
          <div className="relative">
            <input
              type="text"
              value={usernames.user1}
              onChange={(e) => handleInputChange('user1', e.target.value)}
              placeholder="e.g., octocat"
              className={`input-field pr-10 ${errors.user1 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              disabled={disabled}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {errors.user1 && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.user1}</p>
          )}
        </div>

        {/* User 2 Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-github-text mb-2">
            Second Developer
          </label>
          <div className="relative">
            <input
              type="text"
              value={usernames.user2}
              onChange={(e) => handleInputChange('user2', e.target.value)}
              placeholder="e.g., github"
              className={`input-field pr-10 ${errors.user2 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              disabled={disabled}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {errors.user2 && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.user2}</p>
          )}
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          type="submit"
          disabled={disabled || loading}
          className="btn-primary flex items-center justify-center space-x-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Comparing...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Compare Developers</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleSwap}
          disabled={disabled || !usernames.user1 || !usernames.user2}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Swap
        </button>
      </div>

      {/* Quick Examples */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-github-border">
        <p className="text-sm text-gray-600 dark:text-github-muted mb-3">
          Try these popular comparisons:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ['torvalds', 'gaearon'],
            ['sindresorhus', 'tj'],
            ['addyosmani', 'getify']
          ].map(([user1, user2], index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setUsernames({ user1, user2 });
                setErrors({});
              }}
              disabled={disabled}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-github-card dark:hover:bg-gray-600 text-gray-700 dark:text-github-muted rounded-full transition-colors duration-200 disabled:opacity-50"
            >
              {user1} vs {user2}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default ComparisonForm;