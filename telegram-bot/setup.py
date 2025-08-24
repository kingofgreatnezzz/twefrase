#!/usr/bin/env python3
"""
Setup script for CryptoProject Telegram Bot
"""

import os
import sys
import subprocess
import shutil

def print_banner():
    """Print setup banner"""
    print("""
🚀 CryptoProject Telegram Bot Setup
====================================

This script will help you set up your Telegram bot quickly!
""")

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required. Current version:", sys.version)
        sys.exit(1)
    print("✅ Python version:", sys.version)

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing dependencies...")
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies. Please run manually:")
        print("   pip install -r requirements.txt")
        return False
    return True

def create_env_file():
    """Create .env file from template"""
    if os.path.exists(".env"):
        print("✅ .env file already exists")
        return True
    
    if not os.path.exists("env.example"):
        print("❌ env.example file not found!")
        return False
    
    try:
        shutil.copy("env.example", ".env")
        print("✅ .env file created from template")
        print("📝 Please edit .env file with your configuration")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def check_telegram_bot():
    """Check if user has created Telegram bot"""
    print("\n🤖 Telegram Bot Setup Check:")
    print("1. Have you messaged @BotFather on Telegram?")
    print("2. Did you create a new bot with /newbot?")
    print("3. Do you have your bot token?")
    
    response = input("\nEnter 'y' if you have completed these steps: ").lower().strip()
    
    if response == 'y':
        print("✅ Great! You're ready to configure the bot")
        return True
    else:
        print("📋 Please complete these steps first:")
        print("   1. Open Telegram and message @BotFather")
        print("   2. Send /newbot command")
        print("   3. Choose bot name and username")
        print("   4. Copy the bot token")
        print("   5. Run this setup script again")
        return False

def show_next_steps():
    """Show next steps for user"""
    print("""
🎯 Next Steps:
==============

1. 📝 Edit .env file with your configuration:
   - TELEGRAM_BOT_TOKEN=your_bot_token_here
   - COMPANY_NAME=YourCompanyName
   - BOT_USERNAME=YourBotUsername
   - PAYMENT_WALLET_ADDRESS=0x...

2. 🚀 Start the bot:
   python start_bot.py

3. 🧪 Test the bot:
   - Open Telegram and find your bot
   - Send /start command
   - Test the complete flow

4. 🔗 Test web integration:
   - Ensure your web platform is running
   - Click "Connect Wallet" in bot
   - Complete wallet submission
   - Verify automatic return to bot

📚 For detailed instructions, see README.md
""")

def main():
    """Main setup function"""
    print_banner()
    
    # Check Python version
    check_python_version()
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Setup failed at dependency installation")
        return
    
    # Create environment file
    if not create_env_file():
        print("❌ Setup failed at environment file creation")
        return
    
    # Check Telegram bot setup
    if not check_telegram_bot():
        print("❌ Setup incomplete - please create Telegram bot first")
        return
    
    # Show next steps
    show_next_steps()
    
    print("\n🎉 Setup completed successfully!")
    print("Your Telegram bot is ready to be configured and launched!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Setup interrupted by user")
    except Exception as e:
        print(f"\n❌ Setup failed with error: {e}")
        sys.exit(1)
