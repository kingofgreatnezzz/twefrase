from telegram import Update
from telegram.ext import ContextTypes
from config import config, WELCOME_MESSAGE, WALLET_CONNECTION_MESSAGE, RETURN_TO_BOT_MESSAGE, MAIN_MENU_MESSAGE, BUY_TOKENS_MESSAGE, CLAIM_TOKENS_MESSAGE, CONGRATULATIONS_BUY, CONGRATULATIONS_CLAIM, ERROR_MESSAGE, INVALID_ACTION_MESSAGE
from user_states import UserState, UserStateManager
from keyboard_handlers import KeyboardHandlers
import re
from telegram.inline.inlinekeyboardbutton import InlineKeyboardButton, InlineKeyboardMarkup
import logging

logger = logging.getLogger(__name__)

class MessageHandlers:
    """Handles all incoming messages and callback queries"""
    
    def __init__(self, state_manager: UserStateManager):
        self.state_manager = state_manager
    
    async def handle_start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        user_id = update.effective_user.id
        
        # Check if this is a return from web platform
        if context.args and context.args[0].startswith('return_'):
            telegram_id = int(context.args[0].replace('return_', ''))
            if telegram_id == user_id:
                # User returned from web platform, mark wallet as connected
                self.state_manager.mark_wallet_connected(user_id)
                self.state_manager.set_user_state(user_id, UserState.MAIN_MENU)
                
                await update.message.reply_text(
                    "🎉 **Welcome back!** Your wallet has been successfully connected!\n\n"
                    "You can now proceed with your token operations.",
                    reply_markup=KeyboardHandlers.get_main_menu_keyboard(),
                    parse_mode='Markdown'
                )
                return
        
        # Regular start command
        self.state_manager.set_user_state(user_id, UserState.START)
        
        await update.message.reply_text(
            WELCOME_MESSAGE,
            reply_markup=KeyboardHandlers.get_wallet_connection_keyboard(user_id),
            parse_mode='Markdown'
        )
    
    async def handle_wallet_connection(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle wallet connection request"""
        user_id = update.effective_user.id
        self.state_manager.set_user_state(user_id, UserState.WALLET_CONNECTION)
        
        await update.callback_query.edit_message_text(
            WALLET_CONNECTION_MESSAGE,
            reply_markup=KeyboardHandlers.get_wallet_connection_keyboard(user_id),
            parse_mode='Markdown'
        )
    
    async def handle_main_menu(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle main menu selection"""
        user_id = update.effective_user.id
        
        # Check if user has connected wallet
        if not self.state_manager.is_wallet_connected(user_id):
            await update.callback_query.answer("Please connect your wallet first!")
            await update.callback_query.edit_message_text(
                WALLET_CONNECTION_MESSAGE,
                reply_markup=KeyboardHandlers.get_wallet_connection_keyboard(user_id),
                parse_mode='Markdown'
            )
            return
        
        self.state_manager.set_user_state(user_id, UserState.MAIN_MENU)
        
        await update.callback_query.edit_message_text(
            MAIN_MENU_MESSAGE,
            reply_markup=KeyboardHandlers.get_main_menu_keyboard(),
            parse_mode='Markdown'
        )
    
    async def handle_buy_tokens(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle buy tokens selection"""
        user_id = update.effective_user.id
        logger.info(f"User {user_id} selected Buy Tokens")
        
        # Show price menu
        keyboard = [
            [InlineKeyboardButton("$50 USD", callback_data="buy_50")],
            [InlineKeyboardButton("$100 USD", callback_data="buy_100")],
            [InlineKeyboardButton("$200 USD", callback_data="buy_200")],
            [InlineKeyboardButton("$1,000 USD", callback_data="buy_1000")],
            [InlineKeyboardButton("$5,000 USD", callback_data="buy_5000")],
            [InlineKeyboardButton("$10,000 USD", callback_data="buy_10000")],
            [InlineKeyboardButton("🔙 Back to Main Menu", callback_data="main_menu")]
        ]
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.callback_query.edit_message_text(
            f"💰 **Buy {config.COMPANY_NAME} Tokens**\n\n"
            "Select the amount you want to buy:",
            reply_markup=reply_markup,
            parse_mode='Markdown'
        )

    async def handle_claim_tokens(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle claim tokens selection - just ask for wallet address"""
        user_id = update.effective_user.id
        logger.info(f"User {user_id} selected Claim Tokens")
        
        # Set user state to waiting for wallet address
        context.user_data['state'] = UserState.WAITING_WALLET_ADDRESS
        context.user_data['action'] = 'claim'
        
        await update.callback_query.edit_message_text(
            f"🎁 **Claim {config.COMPANY_NAME} Tokens**\n\n"
            "Please paste your wallet address where you want to receive the tokens:",
            parse_mode='Markdown'
        )

    async def handle_buy_amount_selection(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle buy amount selection and show wallet address"""
        query = update.callback_query
        user_id = update.effective_user.id
        
        # Extract amount from callback data
        amount = query.data.replace('buy_', '')
        amount_map = {
            '50': '50',
            '100': '100', 
            '200': '200',
            '1000': '1,000',
            '5000': '5,000',
            '10000': '10,000'
        }
        
        display_amount = amount_map.get(amount, amount)
        
        # Store the selected amount
        context.user_data['selected_amount'] = amount
        context.user_data['state'] = UserState.WAITING_FUNDS_CONFIRMATION
        context.user_data['action'] = 'buy'
        
        # Show wallet address and instructions
        keyboard = [
            [InlineKeyboardButton("✅ Funds Sent", callback_data="confirm_funds_sent")],
            [InlineKeyboardButton("🔙 Back to Amounts", callback_data="buy_tokens")]
        ]
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            f"💳 **Buy {config.COMPANY_NAME} Tokens - ${display_amount} USD**\n\n"
            f"**Token Amount:** {config.get_token_equivalent(amount)} {config.TOKEN_SYMBOL}\n\n"
            f"**Send payment to this wallet address:**\n"
            f"`{config.PAYMENT_WALLET_ADDRESS}`\n\n"
            "After sending the funds, click 'Funds Sent' below:",
            reply_markup=reply_markup,
            parse_mode='Markdown'
        )

    async def handle_funds_confirmation(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle funds sent confirmation"""
        user_id = update.effective_user.id
        amount = context.user_data.get('selected_amount', 'unknown')
        amount_map = {
            '50': '50',
            '100': '100',
            '200': '200', 
            '1000': '1,000',
            '5000': '5,000',
            '10000': '10,000'
        }
        
        display_amount = amount_map.get(amount, amount)
        
        logger.info(f"User {user_id} confirmed funds sent for ${display_amount}")
        
        # Send congratulations message
        await update.callback_query.edit_message_text(
            f"🎉 **Congratulations!** 🎉\n\n"
            f"You have successfully purchased **{config.get_token_equivalent(amount)} {config.TOKEN_SYMBOL}** "
            f"for **${display_amount} USD**!\n\n"
            f"Your tokens will be sent to your connected wallet address.\n\n"
            f"Thank you for investing in {config.COMPANY_NAME}! 🚀",
            parse_mode='Markdown'
        )
        
        # Reset user state
        context.user_data['state'] = UserState.MAIN_MENU
        context.user_data['action'] = None
        context.user_data['selected_amount'] = None

    async def handle_wallet_address_input(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle wallet address input for claim tokens"""
        user_id = update.effective_user.id
        wallet_address = update.message.text.strip()
        
        logger.info(f"User {user_id} provided wallet address: {wallet_address[:10]}...")
        
        # Simple validation (basic format check)
        if len(wallet_address) < 20:
            await update.message.reply_text(
                "❌ Invalid wallet address. Please provide a valid wallet address."
            )
            return
        
        # Send congratulations message
        await update.message.reply_text(
            f"🎉 **Congratulations!** 🎉\n\n"
            f"Your {config.COMPANY_NAME} tokens will be sent to:\n"
            f"`{wallet_address}`\n\n"
            f"Thank you for being part of our community! 🚀",
            parse_mode='Markdown'
        )
        
        # Reset user state
        context.user_data['state'] = UserState.MAIN_MENU
        context.user_data['action'] = None
    
    async def handle_help(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle help request"""
        help_message = f"""
ℹ️ **{config.COMPANY_NAME} Bot Help**

🔗 **Wallet Connection:**
1. Click "Connect Wallet" button
2. Complete wallet connection on web platform
3. Return to bot automatically

💰 **Buying Tokens:**
1. Select "Buy Tokens" from main menu
2. Choose your investment amount
3. Send payment to provided wallet address
4. Click "Funds Sent" after payment

🎁 **Claiming Tokens:**
1. Select "Claim Tokens" from main menu
2. Provide your wallet address
3. Tokens will be sent automatically

🔄 **Reset:** Use reset button to start over

📞 **Support:** Contact support for additional help

Need more assistance? Use the buttons below!
"""
        
        if update.callback_query:
            await update.callback_query.edit_message_text(
                help_message,
                reply_markup=KeyboardHandlers.get_help_keyboard(),
                parse_mode='Markdown'
            )
        else:
            await update.message.reply_text(
                help_message,
                reply_markup=KeyboardHandlers.get_help_keyboard(),
                parse_mode='Markdown'
            )
    
    async def handle_support(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle support request"""
        support_message = """
📞 **Support Information**

For technical support or questions:

🔗 **Official Channels:**
- Website: [Your Website]
- Email: support@yourdomain.com
- Telegram Group: [Your Group Link]

⏰ **Response Time:** 24-48 hours

📋 **Before contacting support:**
1. Check this help section
2. Ensure wallet is properly connected
3. Verify payment details
4. Check network compatibility

We're here to help! 🚀
"""
        
        await update.callback_query.edit_message_text(
            support_message,
            reply_markup=KeyboardHandlers.get_support_keyboard(),
            parse_mode='Markdown'
        )
    
    async def handle_reset(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle reset request"""
        user_id = update.effective_user.id
        
        # Clear all user data and reset to start
        self.state_manager.clear_user_data(user_id)
        self.state_manager.set_user_state(user_id, UserState.START)
        
        await update.callback_query.edit_message_text(
            "🔄 **Bot Reset Complete!**\n\n"
            "You've been reset to the beginning. Let's start fresh! 🚀",
            reply_markup=KeyboardHandlers.get_wallet_connection_keyboard(user_id),
            parse_mode='Markdown'
        )
    
    async def handle_cancel(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle cancel action"""
        user_id = update.effective_user.id
        
        # Return to main menu
        self.state_manager.reset_user_to_main_menu(user_id)
        
        await update.callback_query.edit_message_text(
            MAIN_MENU_MESSAGE,
            reply_markup=KeyboardHandlers.get_main_menu_keyboard(),
            parse_mode='Markdown'
        )
    
    async def handle_invalid_action(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle invalid actions"""
        user_id = update.effective_user.id
        current_state = self.state_manager.get_user_state(user_id)
        
        if current_state == UserState.START:
            await update.message.reply_text(
                INVALID_ACTION_MESSAGE,
                reply_markup=KeyboardHandlers.get_wallet_connection_keyboard(user_id),
                parse_mode='Markdown'
            )
        elif current_state == UserState.MAIN_MENU:
            await update.message.reply_text(
                INVALID_ACTION_MESSAGE,
                reply_markup=KeyboardHandlers.get_main_menu_keyboard(),
                parse_mode='Markdown'
            )
        else:
            await update.message.reply_text(
                INVALID_ACTION_MESSAGE,
                reply_markup=KeyboardHandlers.get_cancel_keyboard(),
                parse_mode='Markdown'
            )
    
    async def handle_text_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """Handle text messages based on user state"""
        user_id = update.effective_user.id
        current_state = context.user_data.get('state', UserState.MAIN_MENU)
        
        logger.info(f"User {user_id} sent text message in state: {current_state}")
        
        if current_state == UserState.WAITING_WALLET_ADDRESS:
            # User is providing wallet address for claim tokens
            await self.handle_wallet_address_input(update, context)
        else:
            # Default response for unexpected text
            await update.message.reply_text(
                "Please use the menu buttons to navigate. If you need help, click the Help button.",
                reply_markup=KeyboardHandlers.get_main_menu_keyboard()
            )
