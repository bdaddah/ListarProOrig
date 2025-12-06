import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey && apiKey !== 'your-sendgrid-api-key') {
  sgMail.setApiKey(apiKey);
}

const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@listarapp.com';
const fromName = process.env.SENDGRID_FROM_NAME || 'ListarPro';
const appName = process.env.APP_NAME || 'ListarPro';

/**
 * Generate a secure random token for password reset
 */
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate token expiration time (1 hour from now)
 */
export const getTokenExpiration = (): Date => {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  return expiration;
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  toEmail: string,
  userName: string,
  resetToken: string
): Promise<boolean> => {
  // Check if SendGrid is configured
  if (!apiKey || apiKey === 'your-sendgrid-api-key') {
    console.log('SendGrid not configured. Reset token:', resetToken);
    console.log('Email would be sent to:', toEmail);
    // Return true in development to allow testing without actual email
    return process.env.NODE_ENV === 'development';
  }

  // For mobile app, we'll use a deep link or OTP code
  // The token can be used directly as a code (first 6 chars) or full token via web
  const resetCode = resetToken.substring(0, 6).toUpperCase();

  const msg = {
    to: toEmail,
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject: `${appName} - Password Reset Request`,
    text: `
Hello ${userName},

You have requested to reset your password for your ${appName} account.

Your password reset code is: ${resetCode}

Enter this code in the app to reset your password.

This code will expire in 1 hour.

If you did not request a password reset, please ignore this email or contact support if you have concerns.

Best regards,
The ${appName} Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>

    <p>Hello <strong>${userName}</strong>,</p>

    <p>You have requested to reset your password for your ${appName} account.</p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
      <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your password reset code is:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: monospace;">
        ${resetCode}
      </div>
    </div>

    <p>Enter this code in the app to reset your password.</p>

    <p style="color: #999; font-size: 14px;">
      <strong>Note:</strong> This code will expire in <strong>1 hour</strong>.
    </p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">

    <p style="color: #999; font-size: 12px; margin-bottom: 0;">
      If you did not request a password reset, please ignore this email or contact support if you have concerns.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    await sgMail.send(msg);
    console.log(`Password reset email sent to ${toEmail}`);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    if (error.response) {
      console.error('SendGrid error body:', error.response.body);
    }
    return false;
  }
};

/**
 * Send OTP verification email
 */
export const sendOTPEmail = async (
  toEmail: string,
  userName: string,
  otp: string
): Promise<boolean> => {
  // Check if SendGrid is configured
  if (!apiKey || apiKey === 'your-sendgrid-api-key') {
    console.log('SendGrid not configured. OTP:', otp);
    console.log('Email would be sent to:', toEmail);
    return process.env.NODE_ENV === 'development';
  }

  const msg = {
    to: toEmail,
    from: {
      email: fromEmail,
      name: fromName,
    },
    subject: `${appName} - Verification Code`,
    text: `
Hello ${userName},

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you did not request this code, please ignore this email.

Best regards,
The ${appName} Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
  </div>

  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Verification Code</h2>

    <p>Hello <strong>${userName}</strong>,</p>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
      <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your verification code is:</p>
      <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #667eea; font-family: monospace;">
        ${otp}
      </div>
    </div>

    <p style="color: #999; font-size: 14px;">
      This code will expire in <strong>10 minutes</strong>.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    await sgMail.send(msg);
    console.log(`OTP email sent to ${toEmail}`);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    return false;
  }
};
