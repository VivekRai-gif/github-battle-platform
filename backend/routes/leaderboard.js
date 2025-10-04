const express = require('express');
const router = express.Router();
const FirebaseService = require('../services/FirebaseService');

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 50, 
      period = 'all', // all, week, month
      sortBy = 'score' // score, comparisons, wins
    } = req.query;

    const leaderboard = await FirebaseService.getLeaderboard({
      limit: parseInt(limit),
      period,
      sortBy
    });

    res.json({
      leaderboard,
      meta: {
        period,
        sortBy,
        limit: parseInt(limit),
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Failed to retrieve leaderboard'
    });
  }
});

// Get user's leaderboard position
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const userStats = await FirebaseService.getUserLeaderboardStats(username);
    
    if (!userStats) {
      return res.status(404).json({
        error: 'User not found in leaderboard'
      });
    }

    res.json(userStats);

  } catch (error) {
    console.error('Get user leaderboard stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve user leaderboard stats'
    });
  }
});

// Get trending users (most compared recently)
router.get('/trending', async (req, res) => {
  try {
    const { 
      limit = 20,
      period = 'week' // day, week, month
    } = req.query;

    const trending = await FirebaseService.getTrendingUsers({
      limit: parseInt(limit),
      period
    });

    res.json({
      trending,
      meta: {
        period,
        limit: parseInt(limit),
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get trending users error:', error);
    res.status(500).json({
      error: 'Failed to retrieve trending users'
    });
  }
});

// Get leaderboard statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await FirebaseService.getLeaderboardStats();

    res.json(stats);

  } catch (error) {
    console.error('Get leaderboard stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve leaderboard statistics'
    });
  }
});

module.exports = router;