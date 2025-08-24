from telegram import Update
from telegram.ext import ContextTypes
from config import config, WELCOME_MESSAGE, WALLET_CONNECTION_MESSAGE, RETURN_TO_BOT_MESSAGE, MAIN_MENU_MESSAGE, BUY_TOKENS_MESSAGE, CLAIM_TOKENS_MESSAGE, CONGRATULATIONS_BUY, CONGRATULATIONS_CLAIM, ERROR_MESSAGE, INVALID_ACTION_MESSAGE
from user_states import UserState, UserStateManager
from keyboard_handlers import KeyboardHandlers
import re

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
    
    async def handle_buy_tokens(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle buy tokens selection"""
        user_id = update.effective_user.id
        self.state_manager.set_user_state(user_id, UserState.BUY_TOKENS)
        
        await update.callback_query.edit_message_text(
            BUY_TOKENS_MESSAGE,
            reply_markup=KeyboardHandlers.get_buy_tokens_keyboard(),
            parse_mode='Markdown'
        )
    
    async def handle_amount_selection(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle token amount selection"""
        user_id = update.effective_user.id
        callback_data = update.callback_query.data
        
        # Extract amount from callback data
        amount = int(callback_data.replace('amount_', ''))
        self.state_manager.set_payment_amount(user_id, amount)
        self.state_manager.set_user_state(user_id, UserState.WAITING_PAYMENT)
        
        # Get token amount for selected USD
        token_amount = config.TOKEN_PRICES[amount]
        
        payment_message = f"""
💰 **Payment Details**

Selected Amount: **${amount:,}**
Tokens to Receive: **{token_amount:,} {config.COMPANY_NAME} tokens**

📝 **Payment Instructions:**

Send exactly **${amount:,}** to this wallet address:
`{config.PAYMENT_WALLET_ADDRESS}`

⚠️ **Important:** 
- Only send the exact amount: ${amount:,}
- Use the correct network (Ethereum/BSC)
- Wait for confirmation before clicking "Funds Sent"

After sending payment, click "✅ Funds Sent" below.
"""
        
        await update.callback_query.edit_message_text(
            payment_message,
            reply_markup=KeyboardHandlers.get_payment_confirmation_keyboard(),
            parse_mode='Markdown'
        )
    
    async def handle_funds_sent(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle funds sent confirmation"""
        user_id = update.effective_user.id
        amount = self.state_manager.get_payment_amount(user_id)
        
        # Reset user to main menu
        self.state_manager.reset_user_to_main_menu(user_id)
        
        await update.callback_query.edit_message_text(
            "🎉 **Congratulations!** 🎉\n\n"
            f"✅ **Payment Confirmed: ${amount:,}**\n\n"
            "🎯 **Status:** Processing\n"
            "⏱️ **Time:** 24-48 hours\n\n"
            f"Your **{config.TOKEN_PRICES[amount]:,} {config.COMPANY_NAME} tokens** will be sent to your connected wallet!\n\n"
            "You'll receive a notification once the tokens are sent!\n\n"
            "Thank you for your investment! 🚀💰",
            reply_markup=KeyboardHandlers.get_main_menu_keyboard(),
            parse_mode='Markdown'
        )
    
    async def handle_claim_tokens(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle claim tokens selection"""
        user_id = update.effective_user.id
        
        # Reset user to main menu and send congratulations immediately
        self.state_manager.reset_user_to_main_menu(user_id)
        
        await update.callback_query.edit_message_text(
            "🎉 **Congratulations!** 🎉\n\n"
            "🎁 **Your tokens have been claimed successfully!**\n\n"
            "✅ **Status:** Tokens Sent\n"
            "⏱️ **Time:** 24-48 hours\n\n"
            "You'll receive your tokens in your connected wallet!\n\n"
            "Thank you for using our service! 🚀",
            reply_markup=KeyboardHandlers.get_main_menu_keyboard(),
            parse_mode='Markdown'
        )
    
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
2. Tokens are claimed automatically!
3. You'll receive them in your connected wallet

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
    
    async def handle_text_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle text messages based on user state"""
        user_id = update.effective_user.id
        current_state = self.state_manager.get_user_state(user_id)
        
        # No special text handling needed since claim tokens is immediate
        await self.handle_invalid_action(update, context)
