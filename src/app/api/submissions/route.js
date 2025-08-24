import { supabase, TABLES } from '../../../lib/supabase'

export async function GET() {
  try {
    console.log('Fetching submissions from Supabase...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Table name:', TABLES.SUBMISSIONS)
    
    const { data: submissions, error } = await supabase
      .from(TABLES.SUBMISSIONS)
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Failed to read submissions', details: error.message },
        { status: 500 }
      )
    }

    console.log('Submissions fetched successfully:', submissions?.length || 0, 'records')
    console.log('Latest submission:', submissions?.[0] ? {
      id: submissions[0].id,
      wallet: submissions[0].selected_wallet || submissions[0].selectedWallet,
      timestamp: submissions[0].timestamp,
      telegram_id: submissions[0].telegram_id
    } : 'No submissions')
    
    return Response.json({ 
      submissions: submissions || [],
      count: submissions?.length || 0,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error reading submissions:', error)
    return Response.json(
      { error: 'Failed to read submissions', details: error.message },
      { status: 500 }
    )
  }
}

