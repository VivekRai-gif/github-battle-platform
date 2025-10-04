// Test script to verify API functionality
import { compareUsers, getHealthCheck } from './src/utils/api.js';

async function testAPI() {
  console.log('🔍 Testing GitHub Battle Platform API...');
  
  try {
    // Test health check
    console.log('\n1. Testing health check...');
    const health = await getHealthCheck();
    console.log('✅ Health check passed:', health);
    
    // Test comparison
    console.log('\n2. Testing comparison...');
    const comparison = await compareUsers('octocat', 'defunkt');
    console.log('✅ Comparison passed');
    console.log('Winner:', comparison.winner?.profile?.username || 'No winner');
    console.log('User1:', comparison.user1?.profile?.username || 'No user1');
    console.log('User2:', comparison.user2?.profile?.username || 'No user2');
    
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
}

// Export for use in components
export default testAPI;