import React from 'react';
import { Github, Users, Trophy, Star, Zap, Heart, Code, Database, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Users,
      title: 'Developer Comparison',
      description: 'Compare GitHub profiles side-by-side with comprehensive statistics and scoring.'
    },
    {
      icon: Trophy,
      title: 'Intelligent Scoring',
      description: 'Advanced algorithm considers followers, stars, forks, commits, and contribution patterns.'
    },
    {
      icon: Star,
      title: 'Real-time Data',
      description: 'Fresh data directly from GitHub API ensuring accurate and up-to-date comparisons.'
    },
    {
      icon: Zap,
      title: 'Interactive Visualizations',
      description: 'Beautiful charts and graphs to visualize repository stats and programming languages.'
    }
  ];

  const techStack = [
    {
      category: 'Frontend',
      technologies: [
        { name: 'React', description: 'Modern UI library for building interactive interfaces' },
        { name: 'TailwindCSS', description: 'Utility-first CSS framework for responsive design' },
        { name: 'Chart.js', description: 'Beautiful and responsive charts for data visualization' },
        { name: 'Lucide Icons', description: 'Clean and consistent icon library' }
      ]
    },
    {
      category: 'Backend',
      technologies: [
        { name: 'Node.js', description: 'JavaScript runtime for server-side development' },
        { name: 'Express.js', description: 'Fast and minimal web framework' },
        { name: 'GitHub API', description: 'Official GitHub REST API for user and repository data' },
        { name: 'Axios', description: 'Promise-based HTTP client for API requests' }
      ]
    },
    {
      category: 'Database & Storage',
      technologies: [
        { name: 'Firebase Firestore', description: 'Real-time NoSQL database for leaderboards' },
        { name: 'Firebase Auth', description: 'Optional user authentication service' }
      ]
    },
    {
      category: 'Deployment',
      technologies: [
        { name: 'Vercel/Netlify', description: 'Frontend hosting with automatic deployments' },
        { name: 'Render/Railway', description: 'Backend hosting with CI/CD integration' }
      ]
    }
  ];

  const scoringCriteria = [
    { metric: 'Followers', weight: '1x', description: 'GitHub followers count' },
    { metric: 'Repository Stars', weight: '2x', description: 'Total stars across all repositories' },
    { metric: 'Repository Forks', weight: '3x', description: 'Total forks across all repositories' },
    { metric: 'Commits', weight: '1x', description: 'Commits in the last year' },
    { metric: 'Pull Requests', weight: '5x', description: 'Pull requests in the last year' },
    { metric: 'Issues', weight: '2x', description: 'Issues created in the last year' },
    { metric: 'Code Reviews', weight: '3x', description: 'Code reviews in the last year' },
    { metric: 'Repositories', weight: '1x', description: 'Number of original repositories' },
    { metric: 'Language Diversity', weight: '10x', description: 'Number of unique programming languages (max 5)' },
    { metric: 'Account Age', weight: '0.1x', description: 'Days since account creation' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Github className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-github-text mb-6">
          About <span className="gradient-text">GitHub Battle</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-github-muted max-w-3xl mx-auto leading-relaxed">
          GitHub Battle Platform is a comprehensive tool for comparing GitHub developers' 
          profiles, repositories, and contribution statistics. Discover who's the ultimate 
          developer in your community with our advanced scoring system and beautiful visualizations.
        </p>
      </div>

      {/* Mission Statement */}
      <section className="mb-16">
        <div className="card bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
          <div className="text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-github-text mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-github-text max-w-2xl mx-auto">
              To celebrate the incredible work of developers worldwide by providing a fun, 
              engaging, and fair way to compare GitHub achievements. We believe in fostering 
              healthy competition and inspiring developers to grow their skills.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-github-text text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card group hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-github-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring System */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-github-text text-center mb-12">
          How We Score Battles
        </h2>
        <div className="card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text mb-4">
                Scoring Criteria
              </h3>
              <p className="text-gray-600 dark:text-github-muted mb-6">
                Our algorithm evaluates multiple aspects of a developer's GitHub presence 
                to create a comprehensive score that reflects their impact and activity.
              </p>
              <div className="space-y-3">
                {scoringCriteria.slice(0, 5).map((criteria, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-github-bg rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-github-text">
                        {criteria.metric}
                      </span>
                      <div className="text-sm text-gray-600 dark:text-github-muted">
                        {criteria.description}
                      </div>
                    </div>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {criteria.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text mb-4">
                Additional Factors
              </h3>
              <div className="space-y-3">
                {scoringCriteria.slice(5).map((criteria, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-github-bg rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-github-text">
                        {criteria.metric}
                      </span>
                      <div className="text-sm text-gray-600 dark:text-github-muted">
                        {criteria.description}
                      </div>
                    </div>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {criteria.weight}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> All activity metrics are calculated for the last 12 months 
                  to ensure scores reflect current engagement and contributions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-github-text text-center mb-12">
          Built With Modern Technology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techStack.map((category, index) => (
            <div key={index} className="card">
              <div className="flex items-center space-x-2 mb-6">
                {category.category === 'Frontend' && <Code className="w-6 h-6 text-blue-600" />}
                {category.category === 'Backend' && <Database className="w-6 h-6 text-green-600" />}
                {category.category === 'Database & Storage' && <Database className="w-6 h-6 text-purple-600" />}
                {category.category === 'Deployment' && <Globe className="w-6 h-6 text-orange-600" />}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-github-text">
                  {category.category}
                </h3>
              </div>
              <div className="space-y-4">
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 dark:text-github-text">
                      {tech.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-github-muted">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="card bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your First Battle?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Compare your GitHub profile with other developers and see how you rank 
            in the community. It's free, fun, and helps you discover amazing developers!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/compare"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>Start Comparing</span>
            </a>
            <a
              href="/leaderboard"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center space-x-2"
            >
              <Trophy className="w-5 h-5" />
              <span>View Leaderboard</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;