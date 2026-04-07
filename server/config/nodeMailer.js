import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Shorthand for smtp.gmail.com/465/secure
  auth: {
    user: process.env.EMAIL_ID, 
    pass: process.env.EMAIL_PASSWORD, // Must be the 16-character App Password
  },
});

// Verification step to ensure your .env credentials actually work
transporter.verify((error) => {
  if (error) {
    console.log("Email System: ❌ Configuration Error. Check your App Password.");
  } else {
    console.log("Email System: ✅ Ready to send booking confirmations.");
  }
});

export const sendEmail = async ({ to, subject, body }) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to,
    subject,
    html: body,
  };

  return transporter.sendMail(mailOptions);
};

export default transporter;