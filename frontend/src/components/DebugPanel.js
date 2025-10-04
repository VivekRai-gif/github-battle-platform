import React, { useState } from 'react';
import { getHealthCheck, compareUsers } from '../utils/api';

const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  const getCurrentApiUrl = () => {
    // Same logic as in api.js
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    if (process.env.NODE_ENV === 'production') {
      return 'https://your-backend-url.com/api';
    }
    return 'http://localhost:5000/api';
  };

  const checkAPI = async () => {
    setLoading(true);
    try {
      const health = await getHealthCheck();
      setDebugInfo({
        timestamp: new Date().toLocaleString(),
        health: health,
        apiUrl: getCurrentApiUrl(),
        nodeEnv: process.env.NODE_ENV,
        currentUrl: window.location.href
      });
    } catch (error) {
      setDebugInfo({
        timestamp: new Date().toLocaleString(),
        error: error.message,
        apiUrl: getCurrentApiUrl(),
        nodeEnv: process.env.NODE_ENV,
        currentUrl: window.location.href
      });
    } finally {
      setLoading(false);
    }
  };

  const testComparison = async () => {
    console.log('🔍 Testing comparison with octocat vs defunkt...');
    try {
      const result = await compareUsers('octocat', 'defunkt');
      console.log('✅ Comparison result:', result);
      setTestResults(prev => ({ ...prev, compare: { success: true, data: result } }));
    } catch (error) {
      console.error('❌ Comparison failed:', error);
      setTestResults(prev => ({ ...prev, compare: { success: false, error: error.message } }));
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm">
      <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
        <div className="flex space-x-2 mb-2">
          <button
            onClick={checkAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
          >
            {loading ? 'Checking...' : 'Check API'}
          </button>
          <button
            onClick={testComparison}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
          >
            Test Compare
          </button>
        </div>
        
        {debugInfo && (
          <div className="text-xs">
            <div><strong>Time:</strong> {debugInfo.timestamp}</div>
            <div><strong>API URL:</strong> {debugInfo.apiUrl}</div>
            <div><strong>Environment:</strong> {debugInfo.nodeEnv}</div>
            {debugInfo.health && (
              <div><strong>Health:</strong> ✅ OK</div>
            )}
            {debugInfo.error && (
              <div><strong>Error:</strong> ❌ {debugInfo.error}</div>
            )}
          </div>
        )}

        {testResults.compare && (
          <div className={`text-xs mt-2 p-2 rounded ${testResults.compare.success ? 'bg-green-800' : 'bg-red-800'}`}>
            <div><strong>Comparison:</strong> {testResults.compare.success ? '✅ Success' : '❌ Failed'}</div>
            {testResults.compare.error && (
              <div><strong>Error:</strong> {testResults.compare.error}</div>
            )}
            {testResults.compare.data && testResults.compare.data.winner && (
              <div><strong>Winner:</strong> {testResults.compare.data.winner.profile?.username || 'Unknown'}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;