import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class Config:
    """Configuration class with validation"""
    
    def __init__(self):
        # Telegram Bot Configuration
        self.TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
        
        # Web Platform Configuration
        self.WEB_PLATFORM_URL = os.getenv('WEB_PLATFORM_URL', 'http://localhost:3000')
        
        # Company/Project Configuration
        self.COMPANY_NAME = os.getenv('COMPANY_NAME', 'CryptoProject')
        self.BOT_USERNAME = os.getenv('BOT_USERNAME', 'CryptoProjectBot')
        
        # Token Pricing (USD to Token conversion)
        self.TOKEN_PRICES = {
            50: int(os.getenv('TOKEN_PRICE_50', '500')),
            100: int(os.getenv('TOKEN_PRICE_100', '1000')),
            200: int(os.getenv('TOKEN_PRICE_200', '2000')),
            1000: int(os.getenv('TOKEN_PRICE_1000', '10000')),
            5000: int(os.getenv('TOKEN_PRICE_5000', '50000')),
            10000: int(os.getenv('TOKEN_PRICE_10000', '100000'))
        }
        
        # Wallet Address for receiving payments
        self.PAYMENT_WALLET_ADDRESS = os.getenv('PAYMENT_WALLET_ADDRESS', '0x1234567890abcdef1234567890abcdef12345678')
        
        # Validate configuration
        self._validate_config()
    
    def _validate_config(self):
        """Validate configuration and log issues"""
        logger.info("Validating configuration...")
        
        # Check required variables
        if not self.TELEGRAM_BOT_TOKEN:
            logger.error("CRITICAL: TELEGRAM_BOT_TOKEN is missing!")
            logger.error("   Please add TELEGRAM_BOT_TOKEN=your_token_here to your .env file")
            logger.error("   Get your token from @BotFather on Telegram")
        else:
            logger.info(f"TELEGRAM_BOT_TOKEN found: {self.TELEGRAM_BOT_TOKEN[:10]}...")
        
        # Check web platform URL
        if not self.WEB_PLATFORM_URL.startswith(('http://', 'https://')):
            logger.warning("WEB_PLATFORM_URL should start with http:// or https://")
        logger.info(f"WEB_PLATFORM_URL: {self.WEB_PLATFORM_URL}")
        
        # Check company configuration
        logger.info(f"COMPANY_NAME: {self.COMPANY_NAME}")
        logger.info(f"BOT_USERNAME: {self.BOT_USERNAME}")
        
        # Check token prices
        logger.info(f"Token prices configured: {len(self.TOKEN_PRICES)} tiers")
        for usd, tokens in self.TOKEN_PRICES.items():
            logger.info(f"   ${usd:,} = {tokens:,} tokens")
        
        # Check wallet address
        if self.PAYMENT_WALLET_ADDRESS == '0x1234567890abcdef1234567890abcdef12345678':
            logger.warning("Using default wallet address. Please update PAYMENT_WALLET_ADDRESS in .env")
        logger.info(f"Payment wallet: {self.PAYMENT_WALLET_ADDRESS}")
        
        # Check environment file
        env_file = '.env'
        if os.path.exists(env_file):
            logger.info(f"Environment file found: {env_file}")
        else:
            logger.warning(f"Environment file not found: {env_file}")
            logger.warning("   Please copy env.example to .env and configure it")
        
        logger.info("Configuration validation completed")
    
    def get_config_summary(self):
        """Get a summary of current configuration"""
        return {
            'has_token': bool(self.TELEGRAM_BOT_TOKEN),
            'web_url': self.WEB_PLATFORM_URL,
            'company': self.COMPANY_NAME,
            'bot_username': self.BOT_USERNAME,
            'token_tiers': len(self.TOKEN_PRICES),
            'payment_wallet': self.PAYMENT_WALLET_ADDRESS
        }

# Create global config instance
config = Config()

# Bot Messages (defined after config is created)
WELCOME_MESSAGE = f"""
🚀 Welcome to {config.COMPANY_NAME}!

I'm here to help you connect your crypto wallet and manage your tokens.

Let's get started by connecting your wallet! 🎯
"""

WALLET_CONNECTION_MESSAGE = f"""
🔗 **Wallet Connection Required**

To proceed, you need to connect your crypto wallet first.

Click the button below to securely connect your wallet:
"""

RETURN_TO_BOT_MESSAGE = """
✅ **Wallet Connected Successfully!**

🎉 Great! Your wallet has been connected and verified.

You'll be redirected back to the bot automatically to continue...
"""

MAIN_MENU_MESSAGE = f"""
🎯 **{config.COMPANY_NAME} - Main Menu**

What would you like to do today?

1️⃣ **Buy {config.COMPANY_NAME} Tokens** - Purchase tokens with USD
2️⃣ **Claim Tokens** - Claim your allocated tokens
"""

BUY_TOKENS_MESSAGE = f"""
💰 **Buy {config.COMPANY_NAME} Tokens**

Choose your investment amount:

💎 **50 USD** = {config.TOKEN_PRICES[50]:,} tokens
💎 **100 USD** = {config.TOKEN_PRICES[100]:,} tokens  
💎 **200 USD** = {config.TOKEN_PRICES[200]:,} tokens
💎 **1,000 USD** = {config.TOKEN_PRICES[1000]:,} tokens
💎 **5,000 USD** = {config.TOKEN_PRICES[5000]:,} tokens
💎 **10,000 USD** = {config.TOKEN_PRICES[10000]:,} tokens

📝 **Payment Instructions:**

Send your payment to this wallet address:
`{config.PAYMENT_WALLET_ADDRESS}`

⚠️ **Important:** Only send the exact amount you selected.

After sending payment, click "✅ Funds Sent" below.
"""

CLAIM_TOKENS_MESSAGE = """
🎁 **Claim Your Tokens**

Please paste your wallet address where you'd like to receive the tokens:

Format: `0x...` (Ethereum/BSC address)
"""

CONGRATULATIONS_BUY = f"""
🎉 **Congratulations!**

Your payment has been received and your {config.COMPANY_NAME} tokens are being processed!

📊 **Transaction Details:**
- Status: ✅ Confirmed
- Tokens: Being transferred to your connected wallet
- Processing Time: 2-5 minutes

Thank you for investing in {config.COMPANY_NAME}! 🚀
"""

CONGRATULATIONS_CLAIM = f"""
🎉 **Congratulations!**

Your {config.COMPANY_NAME} tokens have been sent to your wallet!

📊 **Transaction Details:**
- Status: ✅ Completed
- Tokens: Transferred successfully
- Wallet: Your specified address

Welcome to the {config.COMPANY_NAME} community! 🚀
"""

ERROR_MESSAGE = """
❌ **Something went wrong**

Please try again or contact support if the problem persists.
"""

INVALID_ACTION_MESSAGE = """
⚠️ **Invalid Action**

Please use the menu buttons or type a valid command.
"""
