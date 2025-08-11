'use client'

import { useTheme } from '../../contexts/ThemeContext'

export default function TestThemePage() {
  const { isDark, toggleTheme, isLoaded } = useTheme()

  const checkDarkMode = () => {
    const hasDarkClass = document.documentElement.classList.contains('dark')
    const localStorageTheme = localStorage.getItem('theme')
    return { hasDarkClass, localStorageTheme }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Theme Test Page
        </h1>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Current theme: <strong>{isDark ? 'Dark' : 'Light'}</strong>
          </p>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Theme loaded: <strong>{isLoaded ? 'Yes' : 'No'}</strong>
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            HTML has 'dark' class: <strong>{checkDarkMode().hasDarkClass ? 'Yes' : 'No'}</strong>
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            LocalStorage theme: <strong>{checkDarkMode().localStorageTheme || 'None'}</strong>
          </p>
          
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Toggle Theme
          </button>

          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Refresh Page
          </button>
        </div>
        
        <div className="mt-6">
          <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
