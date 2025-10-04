import React from 'react';
import { Github, Heart, Star, Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-github-card border-t border-gray-200 dark:border-github-border mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">GitHub Battle</span>
            </div>
            <p className="text-gray-600 dark:text-github-muted mb-4 max-w-md">
              Compare GitHub users' profiles, repositories, and contribution stats. 
              Discover who's the ultimate developer in your community!
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-github-muted dark:hover:text-github-text transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-github-text uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-gray-900 dark:text-github-muted dark:hover:text-github-text transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/compare"
                  className="text-gray-600 hover:text-gray-900 dark:text-github-muted dark:hover:text-github-text transition-colors duration-200"
                >
                  Compare Users
                </a>
              </li>
              <li>
                <a
                  href="/leaderboard"
                  className="text-gray-600 hover:text-gray-900 dark:text-github-muted dark:hover:text-github-text transition-colors duration-200"
                >
                  Leaderboard
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 dark:text-github-muted dark:hover:text-github-text transition-colors duration-200"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-github-text uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.github.com/en/rest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-github-muted dark:hover:text-github-text transition-colors duration-200"
                >
                  GitHub API
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-github-muted dark:hover:text-github-text transition-colors duration-200"
                >
                  GitHub Pro
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/features"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 dark:text-github-muted dark:hover:text-github-text transition-colors duration-200"
                >
                  GitHub Features
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-github-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-gray-600 dark:text-github-muted">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for the developer community</span>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-1 text-gray-600 dark:text-github-muted">
                <Star className="w-4 h-4" />
                <span className="text-sm">Star us on GitHub</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600 dark:text-github-muted">
                <Coffee className="w-4 h-4" />
                <span className="text-sm">Buy us a coffee</span>
              </div>
            </div>
          </div>
          <div className="text-center md:text-left mt-4">
            <p className="text-sm text-gray-500 dark:text-github-muted">
              &copy; {currentYear} GitHub Battle Platform. Built with React, Node.js, and the GitHub API.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;