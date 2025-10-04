import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${sizeClasses[size]} border-4 border-primary-600 border-t-transparent rounded-full animate-spin`}></div>
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 dark:text-github-muted font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;