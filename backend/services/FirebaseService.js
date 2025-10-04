const admin = require('firebase-admin');

class FirebaseService {
  constructor() {
    this.initialized = false;
    this.db = null;
    this.init();
  }

  init() {
    try {
      // Check if Firebase environment variables are set
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
        console.log('📝 Firebase environment variables not set, running in development mode');
        this.initialized = false;
        return;
      }

      // Initialize Firebase Admin if not already initialized
      if (!admin.apps.length) {
        const serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI,
          token_uri: process.env.FIREBASE_TOKEN_URI,
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID
        });
      }

      this.db = admin.firestore();
      this.initialized = true;
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error.message);
      console.log('📝 Continuing in development mode without Firebase');
      // Continue without Firebase for development
      this.initialized = false;
    }
  }

  isInitialized() {
    return this.initialized;
  }

  async saveComparison(comparisonData) {
    if (!this.isInitialized()) {
      console.log('📝 Would save comparison (Firebase not initialized):', comparisonData.comparisonId);
      return;
    }

    try {
      const { user1, user2, winner, scoreDifference, timestamp, comparisonId } = comparisonData;

      // Save the full comparison
      await this.db.collection('comparisons').doc(comparisonId).set({
        ...comparisonData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update leaderboard for both users
      await Promise.all([
        this.updateUserStats(user1.profile.username, user1.score.total, winner === user1.profile.username),
        this.updateUserStats(user2.profile.username, user2.score.total, winner === user2.profile.username)
      ]);

      console.log(`✅ Comparison saved: ${comparisonId}`);
    } catch (error) {
      console.error('❌ Error saving comparison:', error);
      throw error;
    }
  }

  async updateUserStats(username, score, won) {
    if (!this.isInitialized()) return;

    try {
      const userRef = this.db.collection('leaderboard').doc(username);
      
      await this.db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        
        if (userDoc.exists) {
          const data = userDoc.data();
          transaction.update(userRef, {
            lastScore: score,
            highestScore: Math.max(data.highestScore || 0, score),
            totalComparisons: (data.totalComparisons || 0) + 1,
            wins: (data.wins || 0) + (won ? 1 : 0),
            losses: (data.losses || 0) + (won ? 0 : 1),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            averageScore: ((data.averageScore || 0) * (data.totalComparisons || 0) + score) / ((data.totalComparisons || 0) + 1)
          });
        } else {
          transaction.set(userRef, {
            username,
            lastScore: score,
            highestScore: score,
            totalComparisons: 1,
            wins: won ? 1 : 0,
            losses: won ? 0 : 1,
            averageScore: score,
            firstSeen: admin.firestore.FieldValue.serverTimestamp(),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      });
    } catch (error) {
      console.error(`❌ Error updating stats for ${username}:`, error);
    }
  }

  async getComparison(comparisonId) {
    if (!this.isInitialized()) {
      return null;
    }

    try {
      const doc = await this.db.collection('comparisons').doc(comparisonId).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()?.toISOString()
      };
    } catch (error) {
      console.error('❌ Error getting comparison:', error);
      throw error;
    }
  }

  async getLeaderboard({ limit = 50, period = 'all', sortBy = 'highestScore' } = {}) {
    if (!this.isInitialized()) {
      return [];
    }

    try {
      let query = this.db.collection('leaderboard');

      // Apply period filter
      if (period !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (period) {
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }
        
        query = query.where('lastUpdated', '>=', startDate);
      }

      // Apply sorting
      const validSortFields = ['highestScore', 'lastScore', 'totalComparisons', 'wins', 'averageScore'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'highestScore';
      
      query = query.orderBy(sortField, 'desc').limit(limit);

      const snapshot = await query.get();
      
      return snapshot.docs.map((doc, index) => ({
        rank: index + 1,
        username: doc.id,
        ...doc.data(),
        firstSeen: doc.data().firstSeen?.toDate()?.toISOString(),
        lastUpdated: doc.data().lastUpdated?.toDate()?.toISOString(),
        winRate: doc.data().totalComparisons > 0 ? 
          Math.round((doc.data().wins / doc.data().totalComparisons) * 100) : 0
      }));
    } catch (error) {
      console.error('❌ Error getting leaderboard:', error);
      throw error;
    }
  }

  async getUserLeaderboardStats(username) {
    if (!this.isInitialized()) {
      return null;
    }

    try {
      const doc = await this.db.collection('leaderboard').doc(username).get();
      
      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      
      // Get user's rank
      const higherScored = await this.db.collection('leaderboard')
        .where('highestScore', '>', data.highestScore)
        .get();
      
      const rank = higherScored.size + 1;

      return {
        username,
        rank,
        ...data,
        firstSeen: data.firstSeen?.toDate()?.toISOString(),
        lastUpdated: data.lastUpdated?.toDate()?.toISOString(),
        winRate: data.totalComparisons > 0 ? 
          Math.round((data.wins / data.totalComparisons) * 100) : 0
      };
    } catch (error) {
      console.error('❌ Error getting user leaderboard stats:', error);
      throw error;
    }
  }

  async getTrendingUsers({ limit = 20, period = 'week' } = {}) {
    if (!this.isInitialized()) {
      return [];
    }

    try {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      // Get recent comparisons and count user appearances
      const comparisons = await this.db.collection('comparisons')
        .where('timestamp', '>=', startDate.toISOString())
        .get();

      const userCounts = {};
      
      comparisons.docs.forEach(doc => {
        const data = doc.data();
        const user1 = data.user1?.profile?.username;
        const user2 = data.user2?.profile?.username;
        
        if (user1) userCounts[user1] = (userCounts[user1] || 0) + 1;
        if (user2) userCounts[user2] = (userCounts[user2] || 0) + 1;
      });

      // Sort by appearance count and get top users
      const trending = Object.entries(userCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([username, count], index) => ({
          rank: index + 1,
          username,
          comparisons: count
        }));

      return trending;
    } catch (error) {
      console.error('❌ Error getting trending users:', error);
      throw error;
    }
  }

  async getUserHistory(username, limit = 10, offset = 0) {
    if (!this.isInitialized()) {
      return [];
    }

    try {
      const comparisons = await this.db.collection('comparisons')
        .where('user1.profile.username', '==', username)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .offset(offset)
        .get();

      const comparisons2 = await this.db.collection('comparisons')
        .where('user2.profile.username', '==', username)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .offset(offset)
        .get();

      // Combine and sort results
      const allComparisons = [
        ...comparisons.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...comparisons2.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];

      return allComparisons
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit)
        .map(comparison => ({
          ...comparison,
          createdAt: comparison.createdAt?.toDate()?.toISOString()
        }));
    } catch (error) {
      console.error('❌ Error getting user history:', error);
      throw error;
    }
  }

  async getLeaderboardStats() {
    if (!this.isInitialized()) {
      return {
        totalUsers: 0,
        totalComparisons: 0,
        averageScore: 0,
        topScore: 0
      };
    }

    try {
      const leaderboardSnapshot = await this.db.collection('leaderboard').get();
      const comparisonsSnapshot = await this.db.collection('comparisons').get();

      let totalScore = 0;
      let topScore = 0;
      let totalComparisons = 0;

      leaderboardSnapshot.docs.forEach(doc => {
        const data = doc.data();
        totalScore += data.averageScore || 0;
        topScore = Math.max(topScore, data.highestScore || 0);
        totalComparisons += data.totalComparisons || 0;
      });

      return {
        totalUsers: leaderboardSnapshot.size,
        totalComparisons: comparisonsSnapshot.size,
        averageScore: leaderboardSnapshot.size > 0 ? 
          Math.round(totalScore / leaderboardSnapshot.size) : 0,
        topScore
      };
    } catch (error) {
      console.error('❌ Error getting leaderboard stats:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseService();