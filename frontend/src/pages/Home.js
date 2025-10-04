import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Github, Users, Trophy, Star, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { getTrendingUsers, getLeaderboardStats } from '../utils/api';

const Home = () => {
  const [trendingUsers, setTrendingUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, leaderboardStats] = await Promise.all([
          getTrendingUsers({ limit: 5 }),
          getLeaderboardStats()
        ]);
        setTrendingUsers(trending.trending || []);
        setStats(leaderboardStats);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Compare Developers',
      description: 'Enter two GitHub usernames and see who comes out on top with our comprehensive scoring system.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Trophy,
      title: 'Global Leaderboard',
      description: 'Track the most compared users and see who ranks highest in the developer community.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Get detailed insights into repositories, contributions, and programming languages.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Star,
      title: 'Share Results',
      description: 'Generate shareable links for your comparisons and show off your GitHub achievements.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-purple-50 dark:from-github-bg dark:to-github-card py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center animate-bounce-in">
                <Github className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-github-text mb-6">
              <span className="gradient-text">GitHub Battle</span>
              <br />
              <span className="text-3xl md:text-4xl">Platform</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-github-muted mb-8 max-w-2xl mx-auto">
              Compare GitHub users' profiles, repositories, and contribution stats. 
              Discover who's the ultimate developer in your community!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/compare"
                className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg group"
              >
                <Users className="w-5 h-5" />
                <span>Start Comparing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                to="/leaderboard"
                className="btn-secondary flex items-center space-x-2 px-8 py-3 text-lg"
              >
                <Trophy className="w-5 h-5" />
                <span>View Leaderboard</span>
              </Link>
            </div>

            {/* Stats */}
            {stats && !loading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-github-muted">Users Compared</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.totalComparisons.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-github-muted">Total Battles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.averageScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-github-muted">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.topScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-github-muted">Top Score</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-github-text mb-4">
              Why Choose GitHub Battle?
            </h2>
            <p className="text-xl text-gray-600 dark:text-github-muted max-w-2xl mx-auto">
              Comprehensive developer comparison with real-time data and beautiful visualizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-github-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Users Section */}
      {trendingUsers.length > 0 && (
        <section className="py-20 px-4 bg-gray-50 dark:bg-github-card">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-github-text mb-4">
                <Zap className="w-8 h-8 inline-block mr-2 text-yellow-500" />
                Trending This Week
              </h2>
              <p className="text-gray-600 dark:text-github-muted">
                Most compared developers in the community
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {trendingUsers.map((user, index) => (
                  <div
                    key={user.username}
                    className="card flex items-center justify-between hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        #{user.rank}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-github-text">
                          {user.username}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-github-muted">
                          {user.comparisons} comparisons this week
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/compare?user1=${user.username}`}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Challenge
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Link to="/leaderboard" className="btn-secondary">
                View Full Leaderboard
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Battle?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Compare your GitHub profile with other developers and see how you rank in the community!
          </p>
          <Link
            to="/compare"
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Github className="w-5 h-5" />
            <span>Start Your First Battle</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;