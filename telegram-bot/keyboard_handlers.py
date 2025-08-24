from telegram import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup
from config import config

class KeyboardHandlers:
    """Handles all keyboard layouts and button interactions"""
    
    @staticmethod
    def get_wallet_connection_keyboard(telegram_user_id: int) -> InlineKeyboardMarkup:
        """Get keyboard for wallet connection"""
        web_url = f"{config.WEB_PLATFORM_URL}?telegram_id={telegram_user_id}"
        
        keyboard = [
            [InlineKeyboardButton("🔗 Connect Wallet", url=web_url)],
            [InlineKeyboardButton("ℹ️ Help", callback_data="help")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_main_menu_keyboard():
        """Get main menu keyboard"""
        keyboard = [
            [InlineKeyboardButton("💰 Buy Tokens", callback_data="buy_tokens")],
            [InlineKeyboardButton("🎁 Claim Tokens", callback_data="claim_tokens")],
            [InlineKeyboardButton("🔗 Connect Wallet", callback_data="connect_wallet")],
            [InlineKeyboardButton("❓ Help", callback_data="help")],
            [InlineKeyboardButton("🆘 Support", callback_data="support")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_buy_tokens_keyboard() -> InlineKeyboardMarkup:
        """Get buy tokens amount selection keyboard"""
        keyboard = [
            [InlineKeyboardButton("💎 50 USD", callback_data="amount_50")],
            [InlineKeyboardButton("💎 100 USD", callback_data="amount_100")],
            [InlineKeyboardButton("💎 200 USD", callback_data="amount_200")],
            [InlineKeyboardButton("💎 1,000 USD", callback_data="amount_1000")],
            [InlineKeyboardButton("💎 5,000 USD", callback_data="amount_5000")],
            [InlineKeyboardButton("💎 10,000 USD", callback_data="amount_10000")],
            [InlineKeyboardButton("🔙 Back to Menu", callback_data="main_menu")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_payment_confirmation_keyboard() -> InlineKeyboardMarkup:
        """Get payment confirmation keyboard"""
        keyboard = [
            [InlineKeyboardButton("✅ Funds Sent", callback_data="funds_sent")],
            [InlineKeyboardButton("🔙 Change Amount", callback_data="buy_tokens")],
            [InlineKeyboardButton("🏠 Main Menu", callback_data="main_menu")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_claim_tokens_keyboard() -> InlineKeyboardMarkup:
        """Get claim tokens keyboard"""
        keyboard = [
            [InlineKeyboardButton("🔙 Back to Menu", callback_data="main_menu")],
            [InlineKeyboardButton("ℹ️ Help", callback_data="help")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_help_keyboard() -> InlineKeyboardMarkup:
        """Get help keyboard"""
        keyboard = [
            [InlineKeyboardButton("🔗 Connect Wallet", callback_data="connect_wallet")],
            [InlineKeyboardButton("🏠 Main Menu", callback_data="main_menu")],
            [InlineKeyboardButton("📞 Support", callback_data="support")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_support_keyboard() -> InlineKeyboardMarkup:
        """Get support keyboard"""
        keyboard = [
            [InlineKeyboardButton("🏠 Main Menu", callback_data="main_menu")],
            [InlineKeyboardButton("🔙 Back", callback_data="help")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_admin_keyboard() -> InlineKeyboardMarkup:
        """Get admin keyboard (for future use)"""
        keyboard = [
            [InlineKeyboardButton("📊 Statistics", callback_data="admin_stats")],
            [InlineKeyboardButton("📤 Export Data", callback_data="admin_export")],
            [InlineKeyboardButton("🏠 Main Menu", callback_data="main_menu")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_yes_no_keyboard() -> InlineKeyboardMarkup:
        """Get yes/no confirmation keyboard"""
        keyboard = [
            [
                InlineKeyboardButton("✅ Yes", callback_data="confirm_yes"),
                InlineKeyboardButton("❌ No", callback_data="confirm_no")
            ]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_cancel_keyboard() -> InlineKeyboardMarkup:
        """Get cancel keyboard"""
        keyboard = [
            [InlineKeyboardButton("❌ Cancel", callback_data="cancel")]
        ]
        return InlineKeyboardMarkup(keyboard)
    
    @staticmethod
    def get_web_platform_return_keyboard(telegram_user_id: int) -> InlineKeyboardMarkup:
        """Get keyboard for returning to Telegram bot from web platform"""
        bot_url = f"https://t.me/{config.BOT_USERNAME}?start=return_{telegram_user_id}"
        
        keyboard = [
            [InlineKeyboardButton("🤖 Return to Bot", url=bot_url)],
            [InlineKeyboardButton("ℹ️ Help", callback_data="help")]
        ]
        return InlineKeyboardMarkup(keyboard)
