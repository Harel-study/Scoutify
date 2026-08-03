import { transporter } from '../config/nodemailer.js';
import logger from '../config/logger.js';

/**
 * Sends a password reset email containing a secure single-use token link.
 *
 * @param {string} toEmail - Recipient email address
 * @param {string} rawToken - The raw unhashed token to include in the reset URL
 */
export const sendResetEmail = async (toEmail: string, rawToken: string): Promise<void> => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password/${rawToken}`;
  const fromEmail = process.env.EMAIL_FROM || 'Scoutify Support <noreply@scoutify.com>';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>איפוס סיסמה ב-Scoutify</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #0f172a;
          color: #f8fafc;
          margin: 0;
          padding: 40px 20px;
          direction: rtl;
        }
        .container {
          max-width: 560px;
          margin: 0 auto;
          background-color: #1e293b;
          border-radius: 24px;
          padding: 40px;
          border: 1px solid #334155;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .logo {
          text-align: center;
          margin-bottom: 24px;
        }
        .logo-badge {
          display: inline-block;
          width: 48px;
          height: 48px;
          background-color: #10b981;
          border-radius: 16px;
          color: #ffffff;
          font-weight: 800;
          font-size: 24px;
          line-height: 48px;
        }
        h1 {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
          margin-top: 0;
          margin-bottom: 16px;
        }
        p {
          font-size: 15px;
          line-height: 1.6;
          color: #94a3b8;
          margin-bottom: 24px;
          text-align: center;
        }
        .button-wrapper {
          text-align: center;
          margin: 32px 0;
        }
        .btn {
          display: inline-block;
          background-color: #10b981;
          color: #ffffff !important;
          font-weight: 600;
          font-size: 16px;
          padding: 14px 32px;
          border-radius: 16px;
          text-decoration: none;
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
        }
        .footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #334155;
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }
        .link-alt {
          word-break: break-all;
          color: #10b981;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <div class="logo-badge">S</div>
        </div>
        <h1>בקשה לאיפוס סיסמה</h1>
        <p>
          קיבלנו בקשה לאיפוס הסיסמה לחשבון ה-Scoutify שלך. 
          כדי לבחור סיסמה חדשה, לחץ על הכפתור למטה:
        </p>
        <div class="button-wrapper">
          <a href="${resetUrl}" class="btn" target="_blank">איפוס סיסמה</a>
        </div>
        <p style="font-size: 13px; color: #64748b;">
          קישור זה תקף ל-<strong>10 דקות בלבד</strong>. אם לא ביקשת לאפס את הסיסמה, תוכל להתעלם מבקשה זו בבטחה.
        </p>
        <div class="footer">
          <p>אם הכפתור אינו עובד, העתק והדבק את הקישור הבא בדפדפן:</p>
          <p class="link-alt">${resetUrl}</p>
          <p style="margin-top: 16px;">© Scoutify Sports Network. כל הזכויות שמורות.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: 'איפוס סיסמה לחשבון Scoutify',
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${toEmail}`);
    // If using dev stream transporter, log the reset URL directly for local development testing
    if ((info as any).message) {
      logger.info(`[DEV EMAIL SIMULATION] Reset Link: ${resetUrl}`);
      console.log(`\n==================================================`);
      console.log(`[DEV EMAIL SIMULATION] Password Reset Email Sent!`);
      console.log(`To: ${toEmail}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log(`==================================================\n`);
    }
  } catch (err: any) {
    logger.error(`Error sending password reset email to ${toEmail}: ${err.message}`);
    // Print reset link to console in dev mode so testing never fails due to missing SMTP
    console.log(`\n[FALLBACK RESET LINK]: ${resetUrl}\n`);
  }
};
