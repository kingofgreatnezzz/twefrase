import asyncio
import logging
import traceback
import sys
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters
from config import config
from user_states import UserStateManager
from message_handlers import MessageHandlers
from keyboard_handlers import KeyboardHandlers

# Configure comprehensive logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.DEBUG,  # Changed to DEBUG for troubleshooting
    handlers=[
        logging.FileHandler('bot_debug.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class CryptoProjectBot:
    """Main bot class that manages all functionality"""
    
    def __init__(self):
        logger.info("Initializing CryptoProjectBot...")
        try:
            self.state_manager = UserStateManager()
            logger.info("UserStateManager initialized successfully")
            
            self.message_handlers = MessageHandlers(self.state_manager)
            logger.info("MessageHandlers initialized successfully")
            
            self.application = None
            logger.info("Bot initialization completed")
        except Exception as e:
            logger.error(f"Failed to initialize bot: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise
    
    async def start(self):
        """Start the bot"""
        try:
            logger.info("Starting bot startup process...")
            
            # Check bot token
            if not config.TELEGRAM_BOT_TOKEN:
                logger.error("TELEGRAM_BOT_TOKEN not found in environment variables!")
                logger.error("Please check your .env file and ensure TELEGRAM_BOT_TOKEN is set")
                return
            
            logger.info(f"Bot token found: {config.TELEGRAM_BOT_TOKEN[:10]}...")
            
            # Create application
            logger.info("Creating Telegram application...")
            self.application = Application.builder().token(config.TELEGRAM_BOT_TOKEN).build()
            logger.info("Application created successfully")
            
            # Add handlers
            logger.info("Setting up handlers...")
            self._setup_handlers()
            logger.info("All handlers configured successfully")
            
            # Start the bot
            logger.info(f"Starting {config.COMPANY_NAME} bot...")
            await self.application.initialize()
            logger.info("Application initialized")
            
            await self.application.start()
            logger.info("Application started")
            
            await self.application.updater.start_polling()
            logger.info("Polling started")
            
            logger.info(f"{config.COMPANY_NAME} bot is running successfully!")
            logger.info("Bot is now listening for messages...")
            
            # Keep the bot running
            try:
                await asyncio.Event().wait()
            except KeyboardInterrupt:
                logger.info("Bot stopped by user (Ctrl+C)")
            finally:
                await self.stop()
                
        except Exception as e:
            logger.error(f"Critical error during bot startup: {e}")
            logger.error(f"Full traceback: {traceback.format_exc()}")
            raise
    
    async def stop(self):
        """Stop the bot"""
        if self.application:
            try:
                logger.info("Stopping bot...")
                await self.application.updater.stop()
                await self.application.stop()
                await self.application.shutdown()
                logger.info("Bot stopped successfully")
            except Exception as e:
                logger.error(f"Error stopping bot: {e}")
    
    def _setup_handlers(self):
        """Setup all message and callback handlers"""
        try:
            logger.info("Setting up command handlers...")
            # Command handlers
            self.application.add_handler(CommandHandler("start", self.message_handlers.handle_start))
            logger.info("Start command handler added")
            
            logger.info("Setting up callback query handlers...")
            # Callback query handlers
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_wallet_connection, pattern="^connect_wallet$"))
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_main_menu, pattern="^main_menu$"))
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_buy_tokens, pattern="^buy_tokens$"))
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_claim_tokens, pattern="^claim_tokens$"))
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_help, pattern="^help$"))
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_support, pattern="^support$"))
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_reset, pattern="^reset$"))
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_cancel, pattern="^cancel$"))
            logger.info("Main callback handlers added")
            
            # Amount selection handlers
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_amount_selection, pattern="^amount_"))
            logger.info("Amount selection handlers added")
            
            # Payment confirmation handlers
            self.application.add_handler(CallbackQueryHandler(self.message_handlers.handle_funds_sent, pattern="^funds_sent$"))
            logger.info("Payment confirmation handlers added")
            
            # Text message handlers
            self.application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.message_handlers.handle_text_message))
            logger.info("Text message handlers added")
            
            # Error handler
            self.application.add_error_handler(self._error_handler)
            logger.info("Error handler added")
            
            logger.info("All handlers configured successfully")
            
        except Exception as e:
            logger.error(f"Error setting up handlers: {e}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise
    
    async def _error_handler(self, update, context):
        """Handle errors in the bot"""
        logger.error(f"Exception while handling an update: {context.error}")
        logger.error(f"Update: {update}")
        logger.error(f"Context: {context}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        
        if update and update.effective_message:
            try:
                await update.effective_message.reply_text(
                    f"Something went wrong\n\n"
                    f"Error: `{str(context.error)}`\n\n"
                    f"Please try again or contact support if the problem persists.\n\n"
                    f"Error ID: {id(context.error)}",
                    parse_mode='Markdown'
                )
            except Exception as e:
                logger.error(f"Error sending error message: {e}")

async def main():
    """Main function to run the bot"""
    try:
        logger.info("Starting CryptoProject Telegram Bot...")
        logger.info("=" * 50)
        
        # Log configuration
        logger.info(f"Company Name: {config.COMPANY_NAME}")
        logger.info(f"Bot Username: {config.BOT_USERNAME}")
        logger.info(f"Web Platform URL: {config.WEB_PLATFORM_URL}")
        logger.info(f"Token Prices: {config.TOKEN_PRICES}")
        logger.info(f"Payment Wallet: {config.PAYMENT_WALLET_ADDRESS}")
        logger.info("=" * 50)
        
        bot = CryptoProjectBot()
        await bot.start()
        
    except Exception as e:
        logger.error(f"Fatal error in main: {e}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        logger.error(f"Full traceback: {traceback.format_exc()}")
        sys.exit(1)
