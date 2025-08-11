# Twefrase - Wallet Phrase Input Application

A simple Next.js application that allows users to select their wallet and input their 12-word recovery phrase.

## Features

- **Wallet Selection**: Choose from popular wallets like MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet, and TokenPocket
- **Phrase Input**: Secure 12-word recovery phrase input form with validation
- **Data Storage**: All submissions are automatically saved to a local JSON file
- **Admin Dashboard**: Access `/only-admins` route to view all submissions with search and filtering
- **Export Functionality**: Download all submissions as a JSON file
- **Modern UI**: Beautiful interface built with Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd twefrase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select Your Wallet**: Choose the wallet you're using from the available options
2. **Enter Recovery Phrase**: Input your 12-word recovery phrase in the provided form
3. **Submit**: Click submit to save your phrase to the database
4. **View Submissions**: Access the admin panel at `/only-admins` to see all submissions
5. **Export Data**: Use the export button in the admin panel to download all data as JSON

## Admin Features

- **View All Submissions**: See every wallet selection and phrase submitted
- **Search & Filter**: Search by wallet type or phrase words, filter by specific wallets
- **Export Data**: Download all submissions as a JSON file for analysis
- **Real-time Stats**: View submission counts, wallet types, and timestamps

## Project Structure

```
twefrase/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── only-admins/
│   │   │   └── page.js
│   │   └── api/
│   │       ├── submit-phrase/
│   │       │   └── route.js
│   │       └── submissions/
│   │           └── route.js
│   └── components/
│       ├── WalletSelector.tsx
│       └── PhraseInput.tsx
├── data/
│   └── .gitkeep
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - Modern React with hooks

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Note

⚠️ **Important**: This is a demonstration application. In a real-world scenario, never handle recovery phrases in plain text or send them over unsecured connections. Always use proper encryption and secure transmission methods.

## License

This project is for educational purposes only.
"# twefrase" 
