// Test script to verify Supabase database connection
// Run this with: node test-db-connection.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Database Connection...')
console.log('📡 Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('🔑 Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please create a .env.local file with:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_project_url')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n🔄 Testing basic connection...')
    
    // Test 1: Check if we can connect
    const { data: testData, error: testError } = await supabase
      .from('wallet_submissions')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Connection failed:', testError.message)
      return
    }
    
    console.log('✅ Database connection successful!')
    
    // Test 2: Check table structure
    console.log('\n📊 Checking table structure...')
    const { data: columns, error: columnsError } = await supabase
      .from('wallet_submissions')
      .select('*')
      .limit(1)
    
    if (columnsError) {
      console.error('❌ Error reading table:', columnsError.message)
      return
    }
    
    if (columns && columns.length > 0) {
      const sampleRecord = columns[0]
      console.log('✅ Table structure:')
      console.log('   - id:', typeof sampleRecord.id)
      console.log('   - selected_wallet:', typeof sampleRecord.selected_wallet)
      console.log('   - phrase:', Array.isArray(sampleRecord.phrase) ? `array[${sampleRecord.phrase.length}]` : typeof sampleRecord.phrase)
      console.log('   - timestamp:', typeof sampleRecord.timestamp)
      console.log('   - ip:', typeof sampleRecord.ip)
      console.log('   - telegram_id:', typeof sampleRecord.telegram_id)
      console.log('   - created_at:', typeof sampleRecord.created_at)
    } else {
      console.log('ℹ️  Table is empty (no records yet)')
    }
    
    // Test 3: Count total records
    console.log('\n🔢 Counting total records...')
    const { count, error: countError } = await supabase
      .from('wallet_submissions')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Error counting records:', countError.message)
      return
    }
    
    console.log(`✅ Total records in table: ${count}`)
    
    // Test 4: Try to insert a test record (then delete it)
    console.log('\n🧪 Testing insert/delete operations...')
    const testRecord = {
      selected_wallet: 'TEST_WALLET',
      phrase: ['test', 'phrase', 'words', 'here', 'for', 'testing', 'purposes', 'only', 'delete', 'this', 'record', 'now'],
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1',
      telegram_id: null
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('wallet_submissions')
      .insert([testRecord])
      .select()
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message)
      return
    }
    
    console.log('✅ Insert test successful!')
    
    // Delete the test record
    const { error: deleteError } = await supabase
      .from('wallet_submissions')
      .delete()
      .eq('id', insertData[0].id)
    
    if (deleteError) {
      console.error('❌ Delete test failed:', deleteError.message)
      return
    }
    
    console.log('✅ Delete test successful!')
    
    console.log('\n🎉 All database tests passed! Your Supabase connection is working correctly.')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

testConnection()
