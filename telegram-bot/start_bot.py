#!/usr/bin/env python3
"""
Simple startup script for the CryptoProject Telegram Bot
"""

import sys
import os
import traceback

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_prerequisites():
    """Check if prerequisites are met"""
    print("🔍 Checking prerequisites...")
    
    # Check if .env exists
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("📝 Please run the setup first:")
        print("   python setup.py")
        return False
    
    # Check if required files exist
    required_files = ['bot.py', 'config.py', 'requirements.txt']
    for file in required_files:
        if not os.path.exists(file):
            print(f"❌ Required file not found: {file}")
            return False
    
    print("✅ Prerequisites check passed")
    return True

def main():
    """Main startup function"""
    print("🚀 Starting CryptoProject Telegram Bot...")
    print("=" * 50)
    
    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Prerequisites not met. Please fix the issues above.")
        print("\n💡 Try running the diagnostic script:")
        print("   python diagnose.py")
        return
    
    try:
        # Try to import and start the bot
        print("📦 Importing bot modules...")
        from bot import main as bot_main_function
        
        print("✅ Bot modules imported successfully")
        print("🤖 Starting bot...")
        print("Press Ctrl+C to stop the bot")
        print("=" * 50)
        
        # Start the bot - FIXED: Call the function to get the coroutine
        import asyncio
        asyncio.run(bot_main_function())
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("\n💡 This usually means missing dependencies.")
        print("Try running: pip install -r requirements.txt")
        
    except Exception as e:
        print(f"❌ Error starting bot: {e}")
        print("\n🔍 Full error details:")
        traceback.print_exc()
        
        print("\n💡 Try running the diagnostic script:")
        print("   python diagnose.py")
        
        print("\n📋 Common solutions:")
        print("1. Check your .env file configuration")
        print("2. Ensure TELEGRAM_BOT_TOKEN is set correctly")
        print("3. Verify all dependencies are installed")
        print("4. Check bot_debug.log for detailed errors")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Bot startup interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        traceback.print_exc()
        sys.exit(1)
