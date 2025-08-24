# 🚀 CryptoProject Telegram Bot

A complete Telegram bot integration for your existing wallet phrase collection platform. This bot guides users through wallet connection, token purchases, and claiming processes.

## ✨ Features

- **🤖 Welcome Flow**: Greets users and guides them to connect wallets
- **🔗 Web Integration**: Seamlessly connects to your existing web platform
- **💰 Token Purchase**: Multiple investment tiers with clear pricing
- **🎁 Token Claiming**: Easy token claiming process
- **🔄 State Management**: Tracks user progress through conversation
- **📱 Interactive Menus**: Beautiful inline keyboards for all actions
- **🛡️ Error Handling**: Graceful error handling and user guidance

## 🏗️ Architecture

```
telegram-bot/
├── bot.py                 # Main bot class and handlers
├── config.py             # Configuration and messages
├── user_states.py        # User state management
├── message_handlers.py   # Message and callback handlers
├── keyboard_handlers.py  # Keyboard layouts
├── start_bot.py         # Simple startup script
├── requirements.txt      # Python dependencies
├── env.example          # Environment variables template
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd telegram-bot
pip install -r requirements.txt
```

### 2. Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Choose a name for your bot
4. Choose a username (must end with 'bot')
5. Copy the bot token

### 3. Configure Environment

```bash
# Copy the example file
cp env.example .env

# Edit .env with your settings
nano .env
```

**Required Variables:**
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEB_PLATFORM_URL=http://localhost:3000
COMPANY_NAME=YourCompanyName
BOT_USERNAME=YourBotUsername
PAYMENT_WALLET_ADDRESS=0x...
```

### 4. Start the Bot

```bash
# Option 1: Use startup script
python start_bot.py

# Option 2: Run directly
python bot.py
```

## 🔄 User Flow

### 1. **Start Bot** → User sends `/start`
- Bot welcomes user
- Shows wallet connection button

### 2. **Connect Wallet** → User clicks button
- Redirects to your web platform
- User enters 12-word phrase
- Web platform processes submission

### 3. **Return to Bot** → Automatic redirect
- Bot recognizes returning user
- Shows main menu options

### 4. **Main Menu** → User chooses action
- **Buy Tokens**: Select amount → Payment instructions → Confirmation
- **Claim Tokens**: Enter wallet address → Success message

## 🎯 Configuration Options

### Company Details
- Company name
- Bot username
- Token pricing tiers
- Payment wallet address

### Token Pricing
```bash
TOKEN_PRICE_50=500      # 50 USD = 500 tokens
TOKEN_PRICE_100=1000    # 100 USD = 1000 tokens
TOKEN_PRICE_200=2000    # 200 USD = 2000 tokens
TOKEN_PRICE_1000=10000  # 1000 USD = 10000 tokens
TOKEN_PRICE_5000=50000  # 5000 USD = 50000 tokens
TOKEN_PRICE_10000=100000 # 10000 USD = 100000 tokens
```

### Web Platform Integration
- Base URL configuration
- Telegram user ID tracking
- Automatic redirect handling

## 🔧 Customization

### Messages
All bot messages are in `config.py` and can be easily customized:

```python
WELCOME_MESSAGE = """
🚀 Welcome to YourCompany!

I'm here to help you connect your crypto wallet...
"""
```

### Token Prices
Update the pricing in `config.py` or environment variables:

```python
TOKEN_PRICES = {
    50: 500,      # 50 USD = 500 tokens
    100: 1000,    # 100 USD = 1000 tokens
    # ... add more tiers
}
```

### Keyboard Layouts
Modify button layouts in `keyboard_handlers.py`:

```python
@staticmethod
def get_main_menu_keyboard():
    keyboard = [
        [InlineKeyboardButton("💰 Buy Tokens", callback_data="buy_tokens")],
        [InlineKeyboardButton("🎁 Claim Tokens", callback_data="claim_tokens")],
        # ... add more buttons
    ]
    return InlineKeyboardMarkup(keyboard)
```

## 🚨 Security Notes

- **Never commit** your `.env` file to git
- **Keep your bot token** secure and private
- **Validate all inputs** (wallet addresses, amounts)
- **Use HTTPS** for production web platform URLs
- **Implement rate limiting** for production use

## 🐛 Troubleshooting

### Common Issues

**Bot not responding:**
- Check bot token in `.env`
- Ensure bot is running (`python start_bot.py`)
- Check console for error messages

**Web platform not redirecting:**
- Verify `WEB_PLATFORM_URL` in `.env`
- Check web platform is running
- Ensure deep linking is working

**Dependencies missing:**
```bash
pip install -r requirements.txt
```

### Debug Mode
Enable detailed logging by modifying `bot.py`:

```python
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.DEBUG  # Change from INFO to DEBUG
)
```

## 📱 Testing

### Test the Bot
1. Start the bot: `python start_bot.py`
2. Open Telegram and find your bot
3. Send `/start` command
4. Test the complete flow

### Test Web Integration
1. Ensure your web platform is running
2. Click "Connect Wallet" in bot
3. Complete wallet submission
4. Verify automatic return to bot

## 🚀 Production Deployment

### Environment Setup
```bash
# Production environment variables
TELEGRAM_BOT_TOKEN=your_production_token
WEB_PLATFORM_URL=https://yourdomain.com
COMPANY_NAME=YourCompany
BOT_USERNAME=YourBotUsername
```

### Process Management
```bash
# Using systemd (Linux)
sudo systemctl enable crypto-bot
sudo systemctl start crypto-bot

# Using PM2 (Node.js)
pm2 start bot.py --name crypto-bot
pm2 save
pm2 startup
```

### Monitoring
- Check bot logs regularly
- Monitor user interactions
- Track error rates
- Monitor web platform integration

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review console logs
- Verify configuration settings
- Test individual components

## 📄 License

This project is for educational purposes. Customize and use according to your needs.

---

**🎉 Your Telegram bot is ready to launch!** 

Users will now have a seamless experience from initial contact through to token operations, all managed through your Telegram bot interface.
