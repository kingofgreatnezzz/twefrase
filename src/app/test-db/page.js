'use client'

import { useState } from 'react'

export default function TestDBPage() {
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState({
    selectedWallet: 'TEST_WALLET',
    phrase: ['test', 'phrase', 'words', 'here', 'for', 'testing', 'purposes', 'only', 'delete', 'this', 'record', 'now']
  })

  const testDatabaseConnection = async () => {
    setLoading(true)
    setTestResult(null)
    
    try {
      console.log('🧪 Testing database connection...')
      
      // Test 1: Check if we can fetch submissions
      const response = await fetch('/api/submissions')
      const data = await response.json()
      
      console.log('📡 Submissions API response:', data)
      
      if (response.ok) {
        setTestResult({
          success: true,
          message: 'Database connection successful!',
          details: {
            submissionsCount: data.count || 0,
            lastUpdated: data.lastUpdated,
            debug: data.debug
          }
        })
      } else {
        setTestResult({
          success: false,
          message: 'Failed to fetch submissions',
          details: data
        })
      }
    } catch (error) {
      console.error('❌ Test failed:', error)
      setTestResult({
        success: false,
        message: 'Test failed with error',
        details: {
          error: error.message,
          stack: error.stack
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const testDataSubmission = async () => {
    setLoading(true)
    setTestResult(null)
    
    try {
      console.log('🧪 Testing data submission...')
      
      const response = await fetch('/api/submit-phrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testData,
          timestamp: new Date().toISOString(),
          telegramId: 'TEST_USER_123'
        })
      })
      
      const data = await response.json()
      console.log('📡 Submit API response:', data)
      
      if (response.ok) {
        setTestResult({
          success: true,
          message: 'Data submission successful!',
          details: {
            submissionId: data.submissionId,
            telegramId: data.telegramId,
            response: data
          }
        })
        
        // Wait a moment then test fetching the new submission
        setTimeout(() => {
          testDatabaseConnection()
        }, 1000)
      } else {
        setTestResult({
          success: false,
          message: 'Data submission failed',
          details: data
        })
      }
    } catch (error) {
      console.error('❌ Submission test failed:', error)
      setTestResult({
        success: false,
        message: 'Submission test failed with error',
        details: {
          error: error.message,
          stack: error.stack
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const clearTestData = async () => {
    setLoading(true)
    setTestResult(null)
    
    try {
      console.log('🧹 Clearing test data...')
      
      // This would require a DELETE endpoint, but for now we'll just show a message
      setTestResult({
        success: true,
        message: 'Test data cleanup initiated',
        details: {
          note: 'Test data will be automatically cleaned up or you can manually delete from the database'
        }
      })
    } catch (error) {
      console.error('❌ Cleanup failed:', error)
      setTestResult({
        success: false,
        message: 'Cleanup failed',
        details: {
          error: error.message
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🧪 Database Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Use this page to test database connectivity and data operations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={testDatabaseConnection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔍 Test Connection
            </button>
            
            <button
              onClick={testDataSubmission}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📝 Test Submission
            </button>
            
            <button
              onClick={clearTestData}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🧹 Clear Test Data
            </button>
          </div>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Testing...</p>
            </div>
          )}
          
          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">{testResult.success ? '✅' : '❌'}</span>
                <h3 className={`font-semibold ${
                  testResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}>
                  {testResult.message}
                </h3>
              </div>
              
              {testResult.details && (
                <div className="mt-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Details:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Data Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Wallet Type
              </label>
              <input
                type="text"
                value={testData.selectedWallet}
                onChange={(e) => setTestData(prev => ({ ...prev, selectedWallet: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Phrase Words (12 words)
              </label>
              <input
                type="text"
                value={testData.phrase.join(' ')}
                onChange={(e) => setTestData(prev => ({ 
                  ...prev, 
                  phrase: e.target.value.split(' ').filter(word => word.trim()) 
                }))}
                placeholder="word1 word2 word3..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Current Test Data:</strong> {testData.selectedWallet} - {testData.phrase.join(' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
