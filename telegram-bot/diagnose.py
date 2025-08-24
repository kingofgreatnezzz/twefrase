#!/usr/bin/env python3
"""
Diagnostic script for CryptoProject Telegram Bot
Helps identify and fix common setup issues
"""

import os
import sys
import importlib
import subprocess
from pathlib import Path

def print_header(title):
    """Print a formatted header"""
    print(f"\n{'='*60}")
    print(f"🔍 {title}")
    print(f"{'='*60}")

def print_section(title):
    """Print a section header"""
    print(f"\n📋 {title}")
    print("-" * 40)

def check_python_version():
    """Check Python version compatibility"""
    print_section("Python Version Check")
    
    version = sys.version_info
    print(f"Current Python version: {version.major}.{version.minor}.{version.micro}")
    
    if version >= (3, 8):
        print("✅ Python version is compatible (3.8+)")
        return True
    else:
        print("❌ Python version is too old. Please upgrade to Python 3.8+")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    print_section("Dependencies Check")
    
    required_packages = [
        'telegram',
        'python-telegram-bot',
        'dotenv'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            importlib.import_module(package.replace('-', '_'))
            print(f"✅ {package} - Installed")
        except ImportError:
            print(f"❌ {package} - Missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n📦 Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    return True

def check_environment_file():
    """Check environment configuration"""
    print_section("Environment Configuration")
    
    env_file = Path('.env')
    env_example = Path('env.example')
    
    if not env_file.exists():
        print("❌ .env file not found")
        if env_example.exists():
            print("📝 Please copy env.example to .env and configure it:")
            print("   cp env.example .env")
            print("   # Then edit .env with your settings")
        return False
    
    print("✅ .env file found")
    
    # Check required variables
    required_vars = [
        'TELEGRAM_BOT_TOKEN',
        'WEB_PLATFORM_URL',
        'COMPANY_NAME',
        'BOT_USERNAME'
    ]
    
    missing_vars = []
    
    with open(env_file, 'r') as f:
        content = f.read()
        for var in required_vars:
            if f"{var}=" in content:
                # Check if it's not the default placeholder
                if "your_bot_token_here" in content and var == "TELEGRAM_BOT_TOKEN":
                    print(f"⚠️  {var} - Still using placeholder value")
                    missing_vars.append(var)
                else:
                    print(f"✅ {var} - Configured")
            else:
                print(f"❌ {var} - Missing")
                missing_vars.append(var)
    
    if missing_vars:
        print(f"\n📝 Please configure these variables in .env:")
        for var in missing_vars:
            print(f"   {var}=your_value_here")
        return False
    
    return True

def check_telegram_bot():
    """Check Telegram bot setup"""
    print_section("Telegram Bot Setup")
    
    print("🤖 To create a Telegram bot:")
    print("1. Open Telegram and message @BotFather")
    print("2. Send /newbot command")
    print("3. Choose a name for your bot")
    print("4. Choose a username (must end with 'bot')")
    print("5. Copy the bot token")
    print("6. Add it to your .env file as TELEGRAM_BOT_TOKEN")
    
    # Try to load config to check token
    try:
        from config import config
        if config.TELEGRAM_BOT_TOKEN and config.TELEGRAM_BOT_TOKEN != "your_bot_token_here":
            print(f"\n✅ Bot token found: {config.TELEGRAM_BOT_TOKEN[:10]}...")
            return True
        else:
            print("\n❌ Bot token not configured or still using placeholder")
            return False
    except Exception as e:
        print(f"\n❌ Error loading config: {e}")
        return False

def check_file_structure():
    """Check if all required files exist"""
    print_section("File Structure Check")
    
    required_files = [
        'bot.py',
        'config.py',
        'user_states.py',
        'message_handlers.py',
        'keyboard_handlers.py',
        'requirements.txt',
        'env.example'
    ]
    
    missing_files = []
    
    for file in required_files:
        if Path(file).exists():
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - Missing")
            missing_files.append(file)
    
    if missing_files:
        print(f"\n❌ Missing files: {', '.join(missing_files)}")
        return False
    
    return True

def test_imports():
    """Test if all modules can be imported"""
    print_section("Module Import Test")
    
    modules = [
        'config',
        'user_states',
        'message_handlers',
        'keyboard_handlers'
    ]
    
    failed_imports = []
    
    for module in modules:
        try:
            importlib.import_module(module)
            print(f"✅ {module} - Import successful")
        except Exception as e:
            print(f"❌ {module} - Import failed: {e}")
            failed_imports.append(module)
    
    if failed_imports:
        print(f"\n❌ Failed imports: {', '.join(failed_imports)}")
        return False
    
    return True

def run_quick_test():
    """Run a quick test of the bot configuration"""
    print_section("Quick Configuration Test")
    
    try:
        from config import config
        
        print(f"Company: {config.COMPANY_NAME}")
        print(f"Bot Username: {config.BOT_USERNAME}")
        print(f"Web Platform: {config.WEB_PLATFORM_URL}")
        print(f"Token Tiers: {len(config.TOKEN_PRICES)}")
        print(f"Payment Wallet: {config.PAYMENT_WALLET_ADDRESS[:20]}...")
        
        print("\n✅ Configuration loaded successfully")
        return True
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

def suggest_fixes():
    """Suggest fixes for common issues"""
    print_section("Common Issues & Fixes")
    
    print("🔧 If you're getting 'Something went wrong' errors:")
    print("1. Check that your .env file exists and is configured")
    print("2. Ensure TELEGRAM_BOT_TOKEN is set correctly")
    print("3. Verify all required Python packages are installed")
    print("4. Check the bot_debug.log file for detailed error messages")
    print("5. Make sure your web platform is running")
    
    print("\n📱 To test the bot:")
    print("1. Start the bot: python start_bot.py")
    print("2. Open Telegram and find your bot")
    print("3. Send /start command")
    print("4. Check console output for any error messages")

def main():
    """Main diagnostic function"""
    print_header("CryptoProject Telegram Bot Diagnostic")
    
    print("This script will check your bot setup and identify any issues.")
    
    # Run all checks
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("File Structure", check_file_structure),
        ("Environment Config", check_environment_file),
        ("Telegram Bot", check_telegram_bot),
        ("Module Imports", test_imports),
        ("Configuration Test", run_quick_test)
    ]
    
    results = []
    
    for check_name, check_func in checks:
        try:
            result = check_func()
            results.append((check_name, result))
        except Exception as e:
            print(f"❌ {check_name} check failed with error: {e}")
            results.append((check_name, False))
    
    # Summary
    print_header("Diagnostic Summary")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"✅ Passed: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 All checks passed! Your bot should work correctly.")
        print("Try running: python start_bot.py")
    else:
        print(f"\n❌ {total - passed} check(s) failed. Please fix the issues above.")
        suggest_fixes()
    
    # Show detailed results
    print("\n📊 Detailed Results:")
    for check_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} - {check_name}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n🛑 Diagnostic interrupted by user")
    except Exception as e:
        print(f"\n❌ Diagnostic failed with error: {e}")
        import traceback
        traceback.print_exc()
