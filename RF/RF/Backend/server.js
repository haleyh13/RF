const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://www.radhefabrications.com'
  ],
  methods: ['GET', 'POST'],
}));



// ✅ Optional: serve static files if needed
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Nodemailer transporter (using cPanel SMTP)
const transporter = nodemailer.createTransport({
  host: 'mail.radhefabrications.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Test SMTP Route
app.get('/test', async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Radhe Fabrications" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'SMTP Test',
      text: '✅ SMTP connection is working correctly.'
    });
    res.send('✅ Test email sent successfully.');
  } catch (error) {
    console.error('❌ SMTP Error:', error);
    res.status(500).send('❌ Error sending test email: ' + error.message);
  }
});

// ✅ Contact Form Submission Route
app.post('/send', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: '❌ All fields are required.' });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `Website Contact: ${subject}`,
    html: `
      <h2>📩 New Inquiry – Radhe Fabrications</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '✅ Message sent successfully!' });
  } catch (error) {
    console.error('❌ Email Error:', error);
    res.status(500).json({ message: '❌ Failed to send message.', error: error.message });
  }
});

// ✅ Start server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
