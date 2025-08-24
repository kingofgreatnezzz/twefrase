'use client'

import { useState, useEffect } from 'react'

export default function MobileTestPage() {
  const [deviceInfo, setDeviceInfo] = useState({})
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Collect device information
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          availWidth: window.screen.availWidth,
          availHeight: window.screen.availHeight
        },
        location: {
          href: window.location.href,
          origin: window.location.origin,
          protocol: window.location.protocol
        }
      }
      
      setDeviceInfo(info)
      
      // Test required APIs
      const requiredAPIs = ['fetch', 'localStorage', 'addEventListener', 'setTimeout']
      const apiErrors = []
      
      requiredAPIs.forEach(api => {
        if (typeof window[api] === 'undefined') {
          apiErrors.push(`Missing API: ${api}`)
        }
      })
      
      if (apiErrors.length > 0) {
        setErrors(apiErrors)
      }
      
    } catch (error) {
      setErrors([`Error collecting device info: ${error.message}`])
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading device information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Mobile Device Test Page</h1>
        
        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h2 className="font-bold mb-2">Errors Found:</h2>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Device Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Basic Info</h3>
              <p><strong>User Agent:</strong> {deviceInfo.userAgent}</p>
              <p><strong>Platform:</strong> {deviceInfo.platform}</p>
              <p><strong>Language:</strong> {deviceInfo.language}</p>
              <p><strong>Cookies:</strong> {deviceInfo.cookieEnabled ? 'Enabled' : 'Disabled'}</p>
              <p><strong>Online:</strong> {deviceInfo.onLine ? 'Yes' : 'No'}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Viewport</h3>
              <p><strong>Width:</strong> {deviceInfo.viewport?.width}px</p>
              <p><strong>Height:</strong> {deviceInfo.viewport?.height}px</p>
              
              <h3 className="font-medium text-gray-700 mt-4">Screen</h3>
              <p><strong>Width:</strong> {deviceInfo.screen?.width}px</p>
              <p><strong>Height:</strong> {deviceInfo.screen?.height}px</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Location Information</h2>
          <p><strong>URL:</strong> {deviceInfo.location?.href}</p>
          <p><strong>Origin:</strong> {deviceInfo.location?.origin}</p>
          <p><strong>Protocol:</strong> {deviceInfo.location?.protocol}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Tests</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                try {
                  localStorage.setItem('test', 'mobile-test-value')
                  const value = localStorage.getItem('test')
                  alert(`localStorage test: ${value}`)
                } catch (error) {
                  alert(`localStorage error: ${error.message}`)
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test localStorage
            </button>
            
            <button
              onClick={() => {
                try {
                  fetch('/api/submissions')
                    .then(response => response.json())
                    .then(data => alert(`API test successful: ${data.count || 0} submissions`))
                    .catch(error => alert(`API test failed: ${error.message}`))
                } catch (error) {
                  alert(`Fetch error: ${error.message}`)
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-2"
            >
              Test API
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ml-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
