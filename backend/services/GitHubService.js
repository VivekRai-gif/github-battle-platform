const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Battle-Platform'
    };

    if (this.token) {
      this.headers['Authorization'] = `token ${this.token}`;
    }
  }

  async makeRequest(url, options = {}) {
    try {
      const response = await axios({
        url: `${this.baseURL}${url}`,
        headers: this.headers,
        timeout: 10000,
        ...options
      });

      // Check rate limit
      const remaining = response.headers['x-ratelimit-remaining'];
      if (remaining && parseInt(remaining) < 10) {
        console.warn(`⚠️ GitHub API rate limit low: ${remaining} requests remaining`);
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`User not found`);
      }
      if (error.response?.status === 403) {
        throw new Error(`GitHub API rate limit exceeded`);
      }
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  async getUserProfile(username) {
    const user = await this.makeRequest(`/users/${username}`);
    
    return {
      username: user.login,
      name: user.name,
      avatar: user.avatar_url,
      bio: user.bio,
      company: user.company,
      location: user.location,
      blog: user.blog,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      publicGists: user.public_gists,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      htmlUrl: user.html_url
    };
  }

  async getUserRepositories(username) {
    try {
      // Get all repos (max 100 per page, get first 5 pages = 500 repos max)
      const allRepos = [];
      for (let page = 1; page <= 5; page++) {
        const repos = await this.makeRequest(`/users/${username}/repos?per_page=100&page=${page}&sort=updated`);
        if (repos.length === 0) break;
        allRepos.push(...repos);
        if (repos.length < 100) break; // Last page
      }

      // Filter out forks if we want only original repos
      const ownRepos = allRepos.filter(repo => !repo.fork);
      
      // Calculate statistics
      const totalStars = allRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = allRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
      const totalWatchers = allRepos.reduce((sum, repo) => sum + repo.watchers_count, 0);

      // Get language statistics
      const languages = {};
      allRepos.forEach(repo => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      // Sort languages by frequency
      const sortedLanguages = Object.entries(languages)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10); // Top 10 languages

      // Get top repositories by stars
      const topRepos = allRepos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .map(repo => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          updatedAt: repo.updated_at
        }));

      return {
        total: allRepos.length,
        ownRepos: ownRepos.length,
        forkedRepos: allRepos.length - ownRepos.length,
        totalStars,
        totalForks,
        totalWatchers,
        languages: sortedLanguages,
        topRepositories: topRepos
      };
    } catch (error) {
      console.error(`Error fetching repositories for ${username}:`, error.message);
      return {
        total: 0,
        ownRepos: 0,
        forkedRepos: 0,
        totalStars: 0,
        totalForks: 0,
        totalWatchers: 0,
        languages: [],
        topRepositories: []
      };
    }
  }

  async getUserContributions(username) {
    try {
      // Get events (recent activity)
      const events = await this.makeRequest(`/users/${username}/events?per_page=100`);
      
      // Count different types of contributions in the last year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const contributions = {
        commits: 0,
        pullRequests: 0,
        issues: 0,
        reviews: 0
      };

      events.forEach(event => {
        const eventDate = new Date(event.created_at);
        if (eventDate >= oneYearAgo) {
          switch (event.type) {
            case 'PushEvent':
              contributions.commits += event.payload.commits?.length || 0;
              break;
            case 'PullRequestEvent':
              contributions.pullRequests += 1;
              break;
            case 'IssuesEvent':
              contributions.issues += 1;
              break;
            case 'PullRequestReviewEvent':
              contributions.reviews += 1;
              break;
          }
        }
      });

      return contributions;
    } catch (error) {
      console.error(`Error fetching contributions for ${username}:`, error.message);
      return {
        commits: 0,
        pullRequests: 0,
        issues: 0,
        reviews: 0
      };
    }
  }

  async getUserData(username) {
    try {
      console.log(`📊 Fetching data for user: ${username}`);

      const [profile, repositories, contributions] = await Promise.all([
        this.getUserProfile(username),
        this.getUserRepositories(username),
        this.getUserContributions(username)
      ]);

      return {
        profile,
        repositories,
        contributions,
        fetchedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching user data for ${username}:`, error.message);
      throw error;
    }
  }

  // Get rate limit info
  async getRateLimit() {
    try {
      const rateLimit = await this.makeRequest('/rate_limit');
      return rateLimit;
    } catch (error) {
      console.error('Error fetching rate limit:', error.message);
      return null;
    }
  }
}

module.exports = new GitHubService();