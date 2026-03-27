const nodemailer = require('nodemailer');

let transporter;

function isMailEnabled() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM_EMAIL);
}

function createTransporter() {
  if (!isMailEnabled()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD || ''
          }
        : undefined
    });
  }

  return transporter;
}

async function sendMail(options) {
  const activeTransporter = createTransporter();

  if (!activeTransporter) {
    return { skipped: true };
  }

  return activeTransporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || process.env.APP_NAME || 'GYC Sierra Leone'}" <${process.env.SMTP_FROM_EMAIL}>`,
    ...options
  });
}

async function sendContactNotification(message) {
  if (!process.env.ADMIN_EMAIL) {
    return { skipped: true };
  }

  return sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `New contact message: ${message.subject || 'Website enquiry'}`,
    text: [
      'A new contact message has been submitted on the website.',
      '',
      `Name: ${message.full_name}`,
      `Email: ${message.email}`,
      `Phone: ${message.phone || 'Not provided'}`,
      `Subject: ${message.subject || 'No subject'}`,
      '',
      'Message:',
      message.message
    ].join('\n'),
    html: `
      <p>A new contact message has been submitted on the website.</p>
      <p><strong>Name:</strong> ${message.full_name}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Phone:</strong> ${message.phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${message.subject || 'No subject'}</p>
      <p><strong>Message:</strong></p>
      <p>${String(message.message).replace(/\n/g, '<br />')}</p>
    `
  });
}

async function sendContactAutoReply(message) {
  return sendMail({
    to: message.email,
    subject: 'We have received your message',
    text: [
      `Dear ${message.full_name},`,
      '',
      'We have received your message and will get back to you.',
      '',
      'Thank you,',
      process.env.APP_NAME || 'GYC Sierra Leone'
    ].join('\n'),
    html: `
      <p>Dear ${message.full_name},</p>
      <p>We have received your message and will get back to you.</p>
      <p>Thank you,<br />${process.env.APP_NAME || 'GYC Sierra Leone'}</p>
    `
  });
}

module.exports = {
  isMailEnabled,
  sendContactNotification,
  sendContactAutoReply
};
