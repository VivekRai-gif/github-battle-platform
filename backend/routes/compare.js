const express = require('express');
const router = express.Router();
const GitHubService = require('../services/GitHubService');
const ScoreService = require('../services/ScoreService');
const FirebaseService = require('../services/FirebaseService');

// Compare two GitHub users
router.post('/', async (req, res) => {
  try {
    const { username1, username2 } = req.body;

    if (!username1 || !username2) {
      return res.status(400).json({
        error: 'Both username1 and username2 are required'
      });
    }

    if (username1.toLowerCase() === username2.toLowerCase()) {
      return res.status(400).json({
        error: 'Cannot compare a user with themselves'
      });
    }

    console.log(`🔄 Comparing users: ${username1} vs ${username2}`);

    // Fetch user data from GitHub
    const [user1Data, user2Data] = await Promise.all([
      GitHubService.getUserData(username1),
      GitHubService.getUserData(username2)
    ]);

    // Calculate scores
    const user1Score = ScoreService.calculateScore(user1Data);
    const user2Score = ScoreService.calculateScore(user2Data);

    // Determine winner with tiebreaker system
    let winner;
    if (user1Score.total > user2Score.total) {
      winner = username1;
    } else if (user2Score.total > user1Score.total) {
      winner = username2;
    } else {
      // Tie-breaker: Use secondary criteria
      // Priority: followers > total repos > account age > username alphabetically
      if (user1Data.profile.followers !== user2Data.profile.followers) {
        winner = user1Data.profile.followers > user2Data.profile.followers ? username1 : username2;
      } else if (user1Data.repositories.total !== user2Data.repositories.total) {
        winner = user1Data.repositories.total > user2Data.repositories.total ? username1 : username2;
      } else if (user1Data.profile.createdAt !== user2Data.profile.createdAt) {
        winner = new Date(user1Data.profile.createdAt) < new Date(user2Data.profile.createdAt) ? username1 : username2;
      } else {
        // Final tiebreaker: alphabetical order (earlier username wins)
        winner = username1.toLowerCase() < username2.toLowerCase() ? username1 : username2;
      }
    }

    // Prepare comparison result
    const comparisonResult = {
      user1: {
        ...user1Data,
        score: user1Score
      },
      user2: {
        ...user2Data,
        score: user2Score
      },
      winner,
      scoreDifference: Math.abs(user1Score - user2Score),
      timestamp: new Date().toISOString(),
      comparisonId: `${username1}_vs_${username2}_${Date.now()}`
    };

    // Save to Firebase (async, don't wait)
    FirebaseService.saveComparison(comparisonResult).catch(error => {
      console.error('Failed to save comparison to Firebase:', error);
    });

    res.json(comparisonResult);

  } catch (error) {
    console.error('Comparison error:', error);
    
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        error: error.message
      });
    }

    if (error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'GitHub API rate limit exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Failed to compare users',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get comparison by ID (for shareable links)
router.get('/:comparisonId', async (req, res) => {
  try {
    const { comparisonId } = req.params;
    
    const comparison = await FirebaseService.getComparison(comparisonId);
    
    if (!comparison) {
      return res.status(404).json({
        error: 'Comparison not found'
      });
    }

    res.json(comparison);

  } catch (error) {
    console.error('Get comparison error:', error);
    res.status(500).json({
      error: 'Failed to retrieve comparison'
    });
  }
});

// Get user's comparison history
router.get('/user/:username/history', async (req, res) => {
  try {
    const { username } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const history = await FirebaseService.getUserHistory(username, parseInt(limit), parseInt(offset));

    res.json({
      username,
      history,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: history.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user history'
    });
  }
});

module.exports = router;