const nodemailer = require('nodemailer');

// Configura el transporte de correo (puedes usar Gmail, Outlook, etc.)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error enviando correo:', error);
    return false;
  }
}

module.exports = { sendEmail }; 