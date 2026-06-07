const nodemailer = require('nodemailer');

/**
 * Check if SMTP is properly configured
 */
const isSmtpConfigured = () => {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

/**
 * Create nodemailer transporter from SMTP env vars
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send confirmation email to the user who submitted the contact form
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} inquiryId - Unique inquiry ID (SCC-XXXXXX)
 */
const sendConfirmationEmail = async (to, name, inquiryId) => {
  if (!isSmtpConfigured()) {
    console.log('📧 SMTP not configured — confirmation email skipped.');
    return;
  }

  try {
    const transporter = createTransporter();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f0f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header with gradient -->
    <tr>
      <td style="background: linear-gradient(135deg, #7c3aed, #e11d48); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">She Can Foundation</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Empowering Women, Transforming Lives</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="margin: 0 0 16px; color: #1e1b4b; font-size: 22px;">Thank You, ${name}! 💜</h2>
        <p style="margin: 0 0 20px; color: #4b5563; font-size: 15px; line-height: 1.7;">
          We have received your message and our team will review it shortly. We appreciate you reaching out to She Can Foundation.
        </p>
        <!-- Inquiry ID Box -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background: linear-gradient(135deg, #f5f3ff, #fdf2f8); border: 1px solid #e9d5ff; border-radius: 12px; padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Inquiry ID</p>
              <p style="margin: 0; color: #7c3aed; font-size: 28px; font-weight: 700; letter-spacing: 2px;">${inquiryId}</p>
              <p style="margin: 12px 0 0; color: #9ca3af; font-size: 12px;">Please save this ID for future reference</p>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; color: #4b5563; font-size: 15px; line-height: 1.7;">
          Our team typically responds within <strong>24-48 hours</strong>. If your matter is urgent, please don't hesitate to reach out again.
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #1e1b4b; padding: 24px 30px; text-align: center;">
        <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 13px;">
          © ${new Date().getFullYear()} She Can Foundation. All rights reserved.
        </p>
        <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">
          This is an automated confirmation. Please do not reply to this email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"She Can Foundation" <${process.env.SMTP_USER}>`,
      to,
      subject: `We received your message — Inquiry ${inquiryId}`,
      html: htmlContent,
    });

    console.log(`📧 Confirmation email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error.message);
  }
};

/**
 * Send admin notification email when a new contact form is submitted
 * @param {object} messageData - The message document data
 */
const sendAdminNotification = async (messageData) => {
  if (!isSmtpConfigured()) {
    console.log('📧 SMTP not configured — admin notification email skipped.');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.log('📧 ADMIN_EMAIL not set — admin notification skipped.');
    return;
  }

  try {
    const transporter = createTransporter();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f0f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #7c3aed, #e11d48); padding: 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 22px;">🔔 New Contact Submission</h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 30px;">
        <p style="margin: 0 0 20px; color: #4b5563; font-size: 15px;">A new message has been submitted on the She Can Connect platform.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 140px;">Inquiry ID</td>
            <td style="padding: 12px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; color: #7c3aed; font-weight: 700;">${messageData.inquiryId}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Name</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${messageData.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Email</td>
            <td style="padding: 12px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${messageData.email}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Phone</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${messageData.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Category</td>
            <td style="padding: 12px 16px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${messageData.category}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Subject</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${messageData.subject}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 16px; background-color: #f5f3ff; border-radius: 8px; margin-top: 8px;">
              <p style="margin: 0 0 4px; font-weight: 600; color: #374151; font-size: 13px;">MESSAGE</p>
              <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">${messageData.message}</p>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; color: #9ca3af; font-size: 13px; text-align: center;">
          Log in to the admin dashboard to respond to this inquiry.
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #1e1b4b; padding: 20px; text-align: center;">
        <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 12px;">She Can Foundation — Admin Notification</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"She Can Connect" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New ${messageData.category} Inquiry — ${messageData.inquiryId}`,
      html: htmlContent,
    });

    console.log(`📧 Admin notification sent to ${adminEmail}`);
  } catch (error) {
    console.error('❌ Error sending admin notification:', error.message);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendAdminNotification,
};
