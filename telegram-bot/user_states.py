from enum import Enum
from typing import Dict, Any
import json

class UserState(Enum):
    """User conversation states"""
    MAIN_MENU = "main_menu"
    WAITING_WALLET_ADDRESS = "waiting_wallet_address"  # For claim tokens
    WAITING_FUNDS_CONFIRMATION = "waiting_funds_confirmation"  # For buy tokens
    CONNECTING_WALLET = "connecting_wallet"  # When user is on web platform

class UserStateManager:
    """Manages user conversation states and data"""
    
    def __init__(self):
        self.user_states: Dict[int, UserState] = {}
        self.user_data: Dict[int, Dict[str, Any]] = {}
    
    def get_user_state(self, user_id: int) -> UserState:
        """Get current state for a user"""
        return self.user_states.get(user_id, UserState.MAIN_MENU)
    
    def set_user_state(self, user_id: int, state: UserState):
        """Set state for a user"""
        self.user_states[user_id] = state
    
    def get_user_data(self, user_id: int) -> Dict[str, Any]:
        """Get data for a user"""
        if user_id not in self.user_data:
            self.user_data[user_id] = {}
        return self.user_data[user_id]
    
    def set_user_data(self, user_id: int, key: str, value: Any):
        """Set data for a user"""
        if user_id not in self.user_data:
            self.user_data[user_id] = {}
        self.user_data[user_id][key] = value
    
    def clear_user_data(self, user_id: int):
        """Clear all data for a user"""
        if user_id in self.user_data:
            del self.user_data[user_id]
        if user_id in self.user_states:
            del self.user_states[user_id]
    
    def reset_user_to_main_menu(self, user_id: int):
        """Reset user to main menu state"""
        self.set_user_state(user_id, UserState.MAIN_MENU)
        # Keep essential data but clear temporary ones
        user_data = self.get_user_data(user_id)
        essential_keys = ['telegram_id', 'wallet_connected', 'submission_id']
        cleaned_data = {k: v for k, v in user_data.items() if k in essential_keys}
        self.user_data[user_id] = cleaned_data
    
    def is_wallet_connected(self, user_id: int) -> bool:
        """Check if user has connected wallet"""
        user_data = self.get_user_data(user_id)
        return user_data.get('wallet_connected', False)
    
    def mark_wallet_connected(self, user_id: int, submission_id: str = None):
        """Mark user's wallet as connected"""
        self.set_user_data(user_id, 'wallet_connected', True)
        if submission_id:
            self.set_user_data(user_id, 'submission_id', submission_id)
        self.set_user_data(user_id, 'telegram_id', user_id)
    
    def get_payment_amount(self, user_id: int) -> int:
        """Get selected payment amount for user"""
        user_data = self.get_user_data(user_id)
        return user_data.get('selected_amount', 0)
    
    def set_payment_amount(self, user_id: int, amount: int):
        """Set selected payment amount for user"""
        self.set_user_data(user_id, 'selected_amount', amount)
    
    def get_wallet_address(self, user_id: int) -> str:
        """Get wallet address for claiming tokens"""
        user_data = self.get_user_data(user_id)
        return user_data.get('claim_wallet_address', '')
    
    def set_wallet_address(self, user_id: int, address: str):
        """Set wallet address for claiming tokens"""
        self.set_user_data(user_id, 'claim_wallet_address', address)
    
    def get_user_stats(self) -> Dict[str, Any]:
        """Get statistics about all users"""
        total_users = len(self.user_states)
        connected_wallets = sum(1 for user_id in self.user_states 
                              if self.is_wallet_connected(user_id))
        
        return {
            'total_users': total_users,
            'connected_wallets': connected_wallets,
            'active_conversations': len([s for s in self.user_states.values() 
                                      if s != UserState.MAIN_MENU])
        }
    
    def export_user_data(self) -> str:
        """Export all user data as JSON string"""
        export_data = {
            'user_states': {str(k): v.value for k, v in self.user_states.items()},
            'user_data': self.user_data
        }
        return json.dumps(export_data, indent=2, default=str)
