'use client'

import { useTheme } from '../../contexts/ThemeContext'
import Link from 'next/link'

export default function TermsPage() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <main className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">📋 Terms and Conditions</h1>
         
        </div>

        {/* Important Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border-l-4 border-yellow-400 mb-8">
          <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-3">
            ⚠️ IMPORTANT DISCLAIMER
          </h2>
          <p className="text-yellow-800 dark:text-yellow-200">
            This platform is provided for <strong>EDUCATIONAL PURPOSES ONLY</strong>. 
            By using this service, you acknowledge and accept all risks associated with cryptocurrency operations.
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-8 mb-8">
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                1. Educational Purpose
              </h2>
              <p className="leading-relaxed">
                This website and its associated Telegram bot are designed solely for educational purposes 
                related to cryptocurrency wallet management and blockchain technology demonstration. 
                The platform serves as a learning tool to understand how cryptocurrency wallets work, 
                how seed phrases function, and how blockchain technology operates in practice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                2. User Responsibility
              </h2>
              <p className="leading-relaxed mb-4">
                Users are solely responsible for their actions and decisions when using this platform. 
                We do not provide financial advice, investment recommendations, or guarantee any outcomes. 
                All decisions made by users are at their own discretion and risk.
              </p>
              <p className="leading-relaxed">
                Users must ensure they understand the implications of their actions and are responsible 
                for maintaining the security of their own cryptocurrency wallets and private keys.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                3. Risk Acknowledgment
              </h2>
              <p className="leading-relaxed mb-4">
                By using this platform, you acknowledge that:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2 leading-relaxed">
                <li>Cryptocurrency operations involve inherent risks and market volatility</li>
                <li>Digital assets can lose value rapidly and without warning</li>
                <li>Wallet security is entirely your responsibility</li>
                <li>No guarantees are provided regarding token values, returns, or platform stability</li>
                <li>Technical issues may result in loss of access or data</li>
                <li>Regulatory changes may affect cryptocurrency operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                4. No Financial Advice
              </h2>
              <p className="leading-relaxed">
                Information provided on this platform is for demonstration and educational purposes only. 
                We are not licensed financial advisors, brokers, or investment professionals. 
                Always consult with qualified financial professionals before making any investment decisions. 
                Past performance does not indicate future results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                5. Limitation of Liability
              </h2>
              <p className="leading-relaxed mb-4">
                The platform operators, developers, and associated parties are not liable for:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2 leading-relaxed">
                <li>Financial losses incurred by users through platform use</li>
                <li>Technical issues, service interruptions, or platform downtime</li>
                <li>Security breaches, wallet compromises, or data loss</li>
                <li>Any direct, indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Third-party actions or external factors beyond our control</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                6. Security and Privacy
              </h2>
              <p className="leading-relaxed mb-4">
                While we implement security measures to protect user data, we cannot guarantee:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2 leading-relaxed">
                <li>Complete protection against all security threats</li>
                <li>100% uptime or uninterrupted service</li>
                <li>Protection against user error or negligence</li>
                <li>Security of third-party services or integrations</li>
              </ul>
              <p className="leading-relaxed">
                Users are responsible for maintaining their own security practices and should never 
                share private keys, seed phrases, or sensitive information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                7. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing and using this platform, you explicitly agree to these terms and conditions 
                in their entirety. If you do not agree with any part of these terms, please do not use 
                this service. Continued use of the platform constitutes ongoing acceptance of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                8. Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time without prior notice. 
                Changes will be effective immediately upon posting. Continued use of the platform 
                after changes constitutes acceptance of the modified terms. Users are responsible 
                for regularly reviewing these terms for updates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                9. Governing Law
              </h2>
              <p className="leading-relaxed">
                These terms are governed by applicable laws and regulations. Users are responsible 
                for ensuring compliance with local cryptocurrency and financial regulations in their 
                jurisdiction. Any disputes will be resolved according to applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                10. Contact Information
              </h2>
              <p className="leading-relaxed mb-4">
                For questions about these terms or the platform:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="mb-2"><strong>📧 Email:</strong> support@twefrase.com</p>
                <p className="mb-2"><strong>💬 Telegram:</strong> @Cryptoproxyy_bot</p>
                <p className="mb-2"><strong>🌐 Website:</strong> twefrase.vercel.app</p>
                <p><strong>⏰ Response Time:</strong> 24-48 hours</p>
              </div>
            </section>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-400 mb-8">
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-3">
            📝 Legal Notice
          </h2>
          <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
            This platform operates under applicable laws and regulations. Users are responsible for 
            ensuring compliance with local cryptocurrency and financial regulations in their jurisdiction. 
            The platform operators make no representations regarding the legality of cryptocurrency 
            operations in any specific location.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">Last updated: {new Date().toLocaleDateString()}</p>
          <p>© 2024 Twefrase. All rights reserved.</p>
        </div>
      </main>
    </div>
  )
}
