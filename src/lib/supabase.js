import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table structure for wallet submissions
export const TABLES = {
  SUBMISSIONS: 'wallet_submissions'
}

// Create table if it doesn't exist (run this once)
export async function createTables() {
  try {
    // This would typically be done via Supabase dashboard or migrations
    // For now, we'll handle it in the API routes
    console.log('Tables should be created via Supabase dashboard')
  } catch (error) {
    console.error('Error creating tables:', error)
  }
}


