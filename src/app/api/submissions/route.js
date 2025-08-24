import { supabase, TABLES } from '../../../lib/supabase'

export async function GET() {
  try {
    console.log('Fetching submissions from Supabase...')
    
    const { data: submissions, error } = await supabase
      .from(TABLES.SUBMISSIONS)
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Failed to read submissions' },
        { status: 500 }
      )
    }

    console.log('Submissions fetched successfully:', submissions?.length || 0, 'records')
    return Response.json({ submissions: submissions || [] })
  } catch (error) {
    console.error('Error reading submissions:', error)
    return Response.json(
      { error: 'Failed to read submissions' },
      { status: 500 }
    )
  }
}

