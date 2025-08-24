# 🔧 Troubleshooting Guide

## ❌ "Something went wrong" Error

If you're getting this generic error message, follow these steps:

### 1. 🚨 **Immediate Actions**

```bash
# Stop the bot (Ctrl+C) and run diagnostic
python diagnose.py
```

### 2. 🔍 **Check the Logs**

Look for `bot_debug.log` file in your telegram-bot folder. This contains detailed error information.

### 3. 📋 **Common Issues & Solutions**

#### **Issue: Bot Token Not Configured**
```
❌ TELEGRAM_BOT_TOKEN not found in environment variables!
```

**Solution:**
1. Create `.env` file: `cp env.example .env`
2. Edit `.env` and add your bot token:
   ```bash
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
3. Get token from [@BotFather](https://t.me/botfather) on Telegram

#### **Issue: Missing Dependencies**
```
❌ ModuleNotFoundError: No module named 'telegram'
```

**Solution:**
```bash
pip install -r requirements.txt
```

#### **Issue: Python Version Too Old**
```
❌ Python version is too old. Please upgrade to Python 3.8+
```

**Solution:**
- Windows: Download from [python.org](https://python.org)
- Linux: `sudo apt install python3.8` or higher
- macOS: `brew install python@3.8` or higher

#### **Issue: Environment File Missing**
```
❌ .env file not found
```

**Solution:**
```bash
cp env.example .env
# Then edit .env with your settings
```

### 4. 🧪 **Step-by-Step Testing**

#### **Test 1: Basic Setup**
```bash
cd telegram-bot
python diagnose.py
```

#### **Test 2: Configuration**
```bash
python -c "from config import config; print('Config loaded:', config.COMPANY_NAME)"
```

#### **Test 3: Bot Startup**
```bash
python start_bot.py
```

### 5. 🚀 **Complete Reset Process**

If nothing else works, try a complete reset:

```bash
# 1. Stop the bot
# 2. Delete and recreate .env
rm .env
cp env.example .env

# 3. Edit .env with your settings
# 4. Reinstall dependencies
pip install -r requirements.txt

# 5. Run diagnostic
python diagnose.py

# 6. Start bot
python start_bot.py
```

## 🔍 **Debug Mode**

The bot now runs in DEBUG mode by default. This means:

- **Console output**: Detailed logging to terminal
- **Log file**: `bot_debug.log` with all messages
- **Error details**: Full stack traces for debugging

## 📱 **Testing the Bot**

### **Before Testing:**
1. ✅ Bot is running (`python start_bot.py`)
2. ✅ No error messages in console
3. ✅ `bot_debug.log` file exists

### **Test Commands:**
1. **Start**: Send `/start` to your bot
2. **Check Response**: Bot should show welcome message
3. **Check Logs**: Look for any error messages

### **Expected Flow:**
```
User: /start
Bot: Welcome message + Connect Wallet button
User: Click Connect Wallet
Bot: Redirects to web platform
```

## 🚨 **Critical Error Messages**

### **"TELEGRAM_BOT_TOKEN not found"**
- **Cause**: Missing or incorrect bot token
- **Fix**: Check `.env` file and bot token

### **"Module import failed"**
- **Cause**: Missing Python packages
- **Fix**: Run `pip install -r requirements.txt`

### **"Configuration validation failed"**
- **Cause**: Invalid settings in `.env`
- **Fix**: Check all required variables

### **"Handler setup failed"**
- **Cause**: Code error in message handlers
- **Fix**: Check `bot_debug.log` for specific error

## 💡 **Pro Tips**

1. **Always check `bot_debug.log`** first - it contains the real error
2. **Run `python diagnose.py`** before starting the bot
3. **Verify your bot token** with @BotFather
4. **Check Python version**: `python --version`
5. **Ensure `.env` file exists** and is properly configured

## 🆘 **Still Having Issues?**

If you're still experiencing problems:

1. **Run diagnostic**: `python diagnose.py`
2. **Check logs**: Look at `bot_debug.log`
3. **Verify setup**: Ensure all prerequisites are met
4. **Check console**: Look for error messages when starting

## 📞 **Getting Help**

When asking for help, include:

- **Error message** from console
- **Log file contents** (relevant parts)
- **Diagnostic output**: `python diagnose.py`
- **Your setup**: OS, Python version, etc.

---

**Remember**: The bot now has comprehensive logging and error handling. Most issues can be resolved by checking the logs and running the diagnostic script! 🚀
