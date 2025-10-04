class ScoreService {
  constructor() {
    // Default scoring weights
    this.weights = {
      follower: 1,          // +1 point per follower
      star: 2,              // +2 points per star
      fork: 3,              // +3 points per fork
      commit: 1,            // +1 point per commit (last year)
      pullRequest: 5,       // +5 points per PR (last year)
      issue: 2,             // +2 points per issue (last year)
      review: 3,            // +3 points per review (last year)
      repository: 1,        // +1 point per original repository
      languageDiversity: 10, // +10 points per unique language (max 5)
      accountAge: 0.1       // +0.1 points per day since account creation
    };
  }

  calculateScore(userData) {
    const { profile, repositories, contributions } = userData;
    
    let score = 0;
    const breakdown = {};

    // Follower score
    const followerScore = profile.followers * this.weights.follower;
    score += followerScore;
    breakdown.followers = followerScore;

    // Repository stars score
    const starScore = repositories.totalStars * this.weights.star;
    score += starScore;
    breakdown.stars = starScore;

    // Repository forks score
    const forkScore = repositories.totalForks * this.weights.fork;
    score += forkScore;
    breakdown.forks = forkScore;

    // Contribution scores
    const commitScore = contributions.commits * this.weights.commit;
    score += commitScore;
    breakdown.commits = commitScore;

    const prScore = contributions.pullRequests * this.weights.pullRequest;
    score += prScore;
    breakdown.pullRequests = prScore;

    const issueScore = contributions.issues * this.weights.issue;
    score += issueScore;
    breakdown.issues = issueScore;

    const reviewScore = contributions.reviews * this.weights.review;
    score += reviewScore;
    breakdown.reviews = reviewScore;

    // Repository count score (only original repos)
    const repoScore = repositories.ownRepos * this.weights.repository;
    score += repoScore;
    breakdown.repositories = repoScore;

    // Language diversity score (capped at 5 languages)
    const languageCount = Math.min(repositories.languages.length, 5);
    const languageScore = languageCount * this.weights.languageDiversity;
    score += languageScore;
    breakdown.languageDiversity = languageScore;

    // Account age score
    const accountCreated = new Date(profile.createdAt);
    const daysSinceCreation = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));
    const ageScore = daysSinceCreation * this.weights.accountAge;
    score += ageScore;
    breakdown.accountAge = ageScore;

    // Calculate additional metrics for display
    const metrics = this.calculateAdditionalMetrics(userData);

    return {
      total: Math.round(score),
      breakdown,
      metrics
    };
  }

  calculateAdditionalMetrics(userData) {
    const { profile, repositories, contributions } = userData;

    return {
      // Engagement rate (stars per repo)
      starsPerRepo: repositories.total > 0 ? 
        Math.round((repositories.totalStars / repositories.total) * 100) / 100 : 0,

      // Fork rate (forks per repo)
      forksPerRepo: repositories.total > 0 ? 
        Math.round((repositories.totalForks / repositories.total) * 100) / 100 : 0,

      // Activity level (contributions per month)
      contributionsPerMonth: Math.round(
        (contributions.commits + contributions.pullRequests + 
         contributions.issues + contributions.reviews) / 12
      ),

      // Developer rating (subjective combination)
      developerRating: this.calculateDeveloperRating(userData),

      // Specialization (most used language)
      primaryLanguage: repositories.languages.length > 0 ? 
        repositories.languages[0][0] : 'Unknown',

      // Collaboration score (PRs + reviews)
      collaborationScore: contributions.pullRequests + contributions.reviews,

      // Community impact (followers + stars)
      communityImpact: profile.followers + repositories.totalStars
    };
  }

  calculateDeveloperRating(userData) {
    const { profile, repositories, contributions } = userData;
    
    // Scale factors for different aspects
    const factors = {
      activity: Math.min(contributions.commits / 100, 1), // Max 1 for 100+ commits
      popularity: Math.min(repositories.totalStars / 1000, 1), // Max 1 for 1000+ stars
      collaboration: Math.min(contributions.pullRequests / 50, 1), // Max 1 for 50+ PRs
      consistency: repositories.total > 0 ? Math.min(repositories.ownRepos / 20, 1) : 0, // Max 1 for 20+ repos
      community: Math.min(profile.followers / 100, 1) // Max 1 for 100+ followers
    };

    const averageRating = (
      factors.activity + 
      factors.popularity + 
      factors.collaboration + 
      factors.consistency + 
      factors.community
    ) / 5;

    // Convert to 5-star rating
    return Math.round(averageRating * 5 * 10) / 10; // Round to 1 decimal
  }

  // Generate user badges based on achievements
  generateBadges(userData) {
    const badges = [];
    const { profile, repositories, contributions } = userData;

    // Star badges
    if (repositories.totalStars >= 1000) badges.push({ name: 'Star Master', icon: '⭐', description: '1000+ total stars' });
    else if (repositories.totalStars >= 100) badges.push({ name: 'Rising Star', icon: '🌟', description: '100+ total stars' });

    // Commit badges
    if (contributions.commits >= 500) badges.push({ name: 'Commit King', icon: '👑', description: '500+ commits this year' });
    else if (contributions.commits >= 100) badges.push({ name: 'Code Warrior', icon: '⚔️', description: '100+ commits this year' });

    // Follower badges
    if (profile.followers >= 1000) badges.push({ name: 'Influencer', icon: '📢', description: '1000+ followers' });
    else if (profile.followers >= 100) badges.push({ name: 'Popular', icon: '👥', description: '100+ followers' });

    // Language badges
    if (repositories.languages.length >= 10) badges.push({ name: 'Polyglot', icon: '🌍', description: '10+ languages' });
    else if (repositories.languages.length >= 5) badges.push({ name: 'Multi-lingual', icon: '🗣️', description: '5+ languages' });

    // Collaboration badges
    if (contributions.pullRequests >= 50) badges.push({ name: 'Team Player', icon: '🤝', description: '50+ pull requests' });
    if (contributions.reviews >= 25) badges.push({ name: 'Code Reviewer', icon: '🔍', description: '25+ code reviews' });

    // Repository badges
    if (repositories.ownRepos >= 50) badges.push({ name: 'Prolific', icon: '📚', description: '50+ repositories' });

    // Account age badges
    const accountCreated = new Date(profile.createdAt);
    const yearsSinceCreation = (Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsSinceCreation >= 5) badges.push({ name: 'Veteran', icon: '🏆', description: '5+ years on GitHub' });

    return badges;
  }

  // Compare two users and provide insights
  compareUsers(user1Data, user2Data) {
    const user1Score = this.calculateScore(user1Data);
    const user2Score = this.calculateScore(user2Data);

    let winner;
    if (user1Score.total > user2Score.total) {
      winner = 'user1';
    } else if (user2Score.total > user1Score.total) {
      winner = 'user2';
    } else {
      // Tie-breaker: Use secondary criteria
      if (user1Data.profile.followers !== user2Data.profile.followers) {
        winner = user1Data.profile.followers > user2Data.profile.followers ? 'user1' : 'user2';
      } else if (user1Data.repositories.total !== user2Data.repositories.total) {
        winner = user1Data.repositories.total > user2Data.repositories.total ? 'user1' : 'user2';
      } else if (user1Data.profile.createdAt !== user2Data.profile.createdAt) {
        winner = new Date(user1Data.profile.createdAt) < new Date(user2Data.profile.createdAt) ? 'user1' : 'user2';
      } else {
        // Final tiebreaker: alphabetical order
        winner = user1Data.profile.username.toLowerCase() < user2Data.profile.username.toLowerCase() ? 'user1' : 'user2';
      }
    }

    const comparison = {
      winner,
      scoreDifference: Math.abs(user1Score.total - user2Score.total),
      insights: []
    };

    // Generate insights
    if (user1Data.repositories.totalStars > user2Data.repositories.totalStars * 2) {
      comparison.insights.push(`${user1Data.profile.username} has significantly more starred repositories`);
    } else if (user2Data.repositories.totalStars > user1Data.repositories.totalStars * 2) {
      comparison.insights.push(`${user2Data.profile.username} has significantly more starred repositories`);
    }

    if (user1Data.contributions.commits > user2Data.contributions.commits * 2) {
      comparison.insights.push(`${user1Data.profile.username} is much more active in commits`);
    } else if (user2Data.contributions.commits > user1Data.contributions.commits * 2) {
      comparison.insights.push(`${user2Data.profile.username} is much more active in commits`);
    }

    return comparison;
  }

  // Get scoring weights (for customization)
  getWeights() {
    return { ...this.weights };
  }

  // Update scoring weights
  updateWeights(newWeights) {
    this.weights = { ...this.weights, ...newWeights };
  }
}

module.exports = new ScoreService();