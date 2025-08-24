const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Browser extension wallet',
    icon: '🦊',
    color: 'from-orange-400 to-orange-600'
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Mobile wallet connection',
    icon: '🔗',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Exchange wallet',
    icon: '🪙',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    description: 'Mobile wallet',
    icon: '🛡️',
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'tokenpocket',
    name: 'TokenPocket',
    description: 'Multi-chain wallet',
    icon: '💼',
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Solana wallet',
    icon: '👻',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'exodus',
    name: 'Exodus',
    description: 'Desktop wallet',
    icon: '🚀',
    color: 'from-indigo-500 to-indigo-700'
  },
  {
    id: 'atomic',
    name: 'Atomic Wallet',
    description: 'Multi-currency wallet',
    icon: '⚛️',
    color: 'from-red-500 to-red-700'
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Hardware wallet',
    icon: '🔒',
    color: 'from-gray-600 to-gray-800'
  },
  {
    id: 'trezor',
    name: 'Trezor',
    description: 'Hardware wallet',
    icon: '🔐',
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'imtoken',
    name: 'imToken',
    description: 'Mobile wallet',
    icon: '📱',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'math',
    name: 'Math Wallet',
    description: 'Multi-chain wallet',
    icon: '🧮',
    color: 'from-yellow-500 to-yellow-700'
  },
  {
    id: 'safepal',
    name: 'SafePal',
    description: 'Hardware wallet',
    icon: '🛡️',
    color: 'from-green-600 to-green-800'
  },
  {
    id: 'binance',
    name: 'Binance Wallet',
    description: 'Exchange wallet',
    icon: '🟡',
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    description: 'Exchange wallet',
    icon: '🟢',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'kucoin',
    name: 'KuCoin Wallet',
    description: 'Exchange wallet',
    icon: '🔵',
    color: 'from-blue-500 to-blue-700'
  }
]

export default function WalletSelector({ onWalletSelect }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Your Wallet</h2>
        <p className="text-gray-600 dark:text-gray-300">Choose the wallet you're using to continue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {wallets.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => onWalletSelect(wallet.id)}
            className="group relative p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-4">
              <div className={`text-3xl ${wallet.icon}`}></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {wallet.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{wallet.description}</p>
              </div>
              <div className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don't see your wallet? Contact support for assistance.
        </p>
      </div>
    </div>
  )
}
