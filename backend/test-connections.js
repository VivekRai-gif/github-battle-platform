const axios = require('axios');

// Test GitHub API connectivity
async function testGitHubAPI() {
  console.log('🧪 Testing GitHub API Connection...\n');
  
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('❌ GITHUB_TOKEN not set in environment variables');
    return false;
  }

  try {
    // Test authenticated user endpoint
    const response = await axios({
      url: 'https://api.github.com/user',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Battle-Platform-Test'
      }
    });

    console.log('✅ GitHub API connection successful!');
    console.log(`📊 Rate limit: ${response.headers['x-ratelimit-remaining']}/${response.headers['x-ratelimit-limit']}`);
    console.log(`👤 Authenticated as: ${response.data.login}\n`);
    return true;
  } catch (error) {
    console.log('❌ GitHub API connection failed:');
    console.log(`   Status: ${error.response?.status}`);
    console.log(`   Message: ${error.message}\n`);
    return false;
  }
}

// Test GitHub user validation
async function testUserValidation(username = 'octocat') {
  console.log(`🔍 Testing user validation for: ${username}...\n`);
  
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('❌ GITHUB_TOKEN not set');
    return false;
  }

  try {
    const response = await axios({
      url: `https://api.github.com/users/${username}`,
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Battle-Platform-Test'
      }
    });

    console.log('✅ User validation successful!');
    console.log(`👤 User: ${response.data.login} (${response.data.name})`);
    console.log(`📊 Public repos: ${response.data.public_repos}`);
    console.log(`👥 Followers: ${response.data.followers}\n`);
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`❌ User '${username}' not found on GitHub\n`);
    } else {
      console.log('❌ User validation failed:');
      console.log(`   Status: ${error.response?.status}`);
      console.log(`   Message: ${error.message}\n`);
    }
    return false;
  }
}

// Test Firebase connection
async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...\n');
  
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing Firebase environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n📝 Please check your .env file and SETUP.md guide\n');
    return false;
  }

  try {
    // Try to initialize Firebase (this is a basic test)
    const admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
        token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }

    // Test Firestore connection
    const db = admin.firestore();
    await db.collection('test').doc('connection').set({
      test: true,
      timestamp: new Date()
    });
    
    console.log('✅ Firebase connection successful!');
    console.log(`📊 Project ID: ${process.env.FIREBASE_PROJECT_ID}\n`);
    return true;
  } catch (error) {
    console.log('❌ Firebase connection failed:');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 GitHub Battle Platform - Connection Tests\n');
  console.log('='.repeat(50));
  
  const results = {
    github: await testGitHubAPI(),
    userValidation: await testUserValidation('octocat'),
    firebase: await testFirebaseConnection()
  };

  console.log('='.repeat(50));
  console.log('📊 Test Results Summary:');
  console.log(`   GitHub API: ${results.github ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   User Validation: ${results.userValidation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Firebase: ${results.firebase ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (!allPassed) {
    console.log('\n📖 Check SETUP.md for configuration instructions');
  }
}

// Run tests if called directly
if (require.main === module) {
  require('dotenv').config();
  runTests().catch(console.error);
}

module.exports = {
  testGitHubAPI,
  testUserValidation,
  testFirebaseConnection,
  runTests
};