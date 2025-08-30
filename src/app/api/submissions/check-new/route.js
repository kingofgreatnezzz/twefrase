import { supabase, TABLES } from '../../../../lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sinceId = searchParams.get('since')
    
    if (!sinceId) {
      return Response.json(
        { error: 'Missing since parameter' },
        { status: 400 }
      )
    }
    
    console.log('🔍 Checking for new submissions since ID:', sinceId)
    
    // Fetch only submissions with ID greater than the known latest ID
    const { data: newSubmissions, error } = await supabase
      .from(TABLES.SUBMISSIONS)
      .select('*')
      .gt('id', parseInt(sinceId))
      .order('timestamp', { ascending: false })
    
    if (error) {
      console.error('❌ Error checking for new submissions:', error)
      return Response.json(
        { error: 'Failed to check for new submissions', details: error.message },
        { status: 500 }
      )
    }
    
    console.log('✅ Found new submissions:', newSubmissions?.length || 0)
    
    if (newSubmissions && newSubmissions.length > 0) {
      console.log('🆕 New submissions:', newSubmissions.map(s => ({
        id: s.id,
        wallet: s.selected_wallet,
        timestamp: s.timestamp
      })))
    }
    
    return Response.json({
      newSubmissions: newSubmissions || [],
      count: newSubmissions?.length || 0,
      sinceId: parseInt(sinceId),
      checkedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Critical error checking for new submissions:', error)
    return Response.json(
      { error: 'Failed to check for new submissions', details: error.message },
      { status: 500 }
    )
  }
}
