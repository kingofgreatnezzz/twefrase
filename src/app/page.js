'use client'

import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import WalletSelector from '../components/WalletSelector'
import PhraseInput from '../components/PhraseInput'

export default function Home() {
  const [selectedWallet, setSelectedWallet] = useState(null)
  const [currentStep, setCurrentStep] = useState('wallet-selection')
  const { isDark, toggleTheme } = useTheme()

  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet)
    setCurrentStep('phrase-input')
  }

  const handleBackToWalletSelection = () => {
    setSelectedWallet(null)
    setCurrentStep('wallet-selection')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Theme Toggle - Made More Prominent */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleTheme}
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

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Twefrase</h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Secure Wallet Phrase Management</p>
          <div className="mt-4">
            <div className="flex space-x-3 justify-center">
              <a 
                href="/only-admins" 
                className="inline-flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                🔐 Admin Panel
              </a>
              <a 
                href="/test-theme" 
                className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white text-sm rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                🧪 Test Theme
              </a>
            </div>
          </div>
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
