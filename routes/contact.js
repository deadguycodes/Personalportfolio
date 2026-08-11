const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to send real email to avuy2207@gmail.com
async function sendDirectEmail({ name, email, subject, message }) {
  const recipientEmail = process.env.RECEIVER_EMAIL || 'avuy2207@gmail.com';
  const emailUser = process.env.EMAIL_USER || 'avuy2207@gmail.com';
  const emailPass = process.env.EMAIL_PASS;

  if (!emailPass) {
    console.log(`ℹ️ [Email System] Form submission logged: ${name} <${email}>. Set EMAIL_PASS in .env to enable direct Gmail delivery.`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact Form" <${emailUser}>`,
    replyTo: `"${name}" <${email}>`,
    to: recipientEmail,
    subject: `📩 New Portfolio Message: ${subject || 'Inquiry from ' + name}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 24px; color: #f8fafc;">
        <h2 style="color: #a78bfa; margin-top: 0; border-bottom: 1px solid #334155; padding-bottom: 12px;">New Contact Form Message</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600; width: 100px;">From:</td>
            <td style="padding: 8px 0; color: #f8fafc;"><strong>${name}</strong> (&lt;<a href="mailto:${email}" style="color: #38bdf8;">${email}</a>&gt;)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Subject:</td>
            <td style="padding: 8px 0; color: #f8fafc;">${subject || 'Portfolio Inquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; font-weight: 600;">Date:</td>
            <td style="padding: 8px 0; color: #f8fafc;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
          </tr>
        </table>
        <div style="background: #1e293b; border-left: 4px solid #a78bfa; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #e2e8f0;">
${message}
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 24px; text-align: center;">
          You can reply directly to this email to respond to ${name}.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ [Email System] Real email successfully sent to ${recipientEmail} from ${email}`);
  return true;
}

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required.',
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  try {
    // 1. Save to MongoDB if connected
    if (isDbConnected()) {
      const Contact = require('../models/Contact');
      await Contact.create({ name, email, subject: subject || 'Portfolio Inquiry', message });
    }

    // 2. Dispatch real email via Nodemailer
    await sendDirectEmail({ name, email, subject, message });

    console.log(`📧 New contact from ${name} <${email}>: ${message}`);
    res.status(201).json({
      success: true,
      message: "Thanks for reaching out! I'll get back to you soon. 🚀",
    });
  } catch (err) {
    console.error('❌ Error processing contact form:', err);
    res.status(500).json({ success: false, message: 'Failed to process message: ' + err.message });
  }
});

// GET /api/contact (admin - list all messages)
router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, data: [], source: 'no-db' });
    }
    const Contact = require('../models/Contact');
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
