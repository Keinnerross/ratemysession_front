import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, feedback, website } = body;

    // Honeypot field validation - if 'website' is filled, it's likely a bot
    if (website) {
      console.log('Honeypot triggered - potential spam detected');
      // Return success to not alert the bot
      return NextResponse.json({
        success: true,
        message: 'Feedback received successfully'
      }, { status: 200 });
    }

    // Validate required fields
    if (!name || !email || !feedback) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Validate feedback length
    if (feedback.length < 10) {
      return NextResponse.json({
        success: false,
        error: 'Feedback must be at least 10 characters long'
      }, { status: 400 });
    }

    // Check environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.FEEDBACK_RECIPIENT_EMAIL) {
      console.error('Missing Gmail SMTP configuration in environment variables');
      return NextResponse.json({
        success: false,
        error: 'Email service not configured. Please contact support.'
      }, { status: 500 });
    }

    // Create nodemailer transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Feedback</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #6042E9 0%, #796BF5 100%);
              color: white;
              padding: 30px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-top: none;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .info-section {
              background: #f9fafb;
              padding: 20px;
              border-radius: 6px;
              margin-bottom: 20px;
            }
            .info-row {
              margin-bottom: 12px;
            }
            .info-label {
              font-weight: 600;
              color: #6042E9;
              display: inline-block;
              min-width: 100px;
            }
            .info-value {
              color: #4b5563;
            }
            .feedback-section {
              background: #ffffff;
              border: 1px solid #e5e7eb;
              padding: 20px;
              border-radius: 6px;
              margin-top: 20px;
            }
            .feedback-label {
              font-weight: 600;
              color: #6042E9;
              margin-bottom: 10px;
              display: block;
            }
            .feedback-content {
              color: #1f2937;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6b7280;
              font-size: 14px;
            }
            .timestamp {
              color: #9ca3af;
              font-size: 13px;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📝 New Feedback Received</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Rate My Session</p>
          </div>

          <div class="content">
            <div class="info-section">
              <div class="info-row">
                <span class="info-label">From:</span>
                <span class="info-value">${name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value"><a href="mailto:${email}" style="color: #6042E9; text-decoration: none;">${email}</a></span>
              </div>
            </div>

            <div class="feedback-section">
              <span class="feedback-label">Feedback Message:</span>
              <div class="feedback-content">${feedback}</div>
            </div>

            <div class="timestamp">
              Received on ${timestamp}
            </div>
          </div>

          <div class="footer">
            <p>This email was sent from the Rate My Session feedback form.</p>
            <p>You can reply directly to this email to respond to ${name}.</p>
          </div>
        </body>
      </html>
    `;

    // Create plain text version (fallback)
    const textContent = `
New Feedback Received - Rate My Session

From: ${name}
Email: ${email}

Feedback Message:
${feedback}

---
Received on ${timestamp}

You can reply directly to this email to respond to ${name}.
    `.trim();

    // Email options
    const mailOptions = {
      from: `"Rate My Session Feedback" <${process.env.GMAIL_USER}>`,
      to: process.env.FEEDBACK_RECIPIENT_EMAIL,
      replyTo: email, // User can reply directly to the feedback sender
      subject: `New Feedback from ${name}`,
      text: textContent,
      html: htmlContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`Feedback email sent successfully from ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error sending feedback email:', error);

    // Check if it's a nodemailer authentication error
    if (error.code === 'EAUTH') {
      return NextResponse.json({
        success: false,
        error: 'Email authentication failed. Please contact support.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to submit feedback. Please try again later.'
    }, { status: 500 });
  }
}
