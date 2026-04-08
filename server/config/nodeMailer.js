// FIX: Remove the '.js' from the package import
import nodemailer from 'nodemailer'; 
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_ID, 
    // This MUST be a 16-character Google App Password, not your login password
    pass: process.env.EMAIL_PASSWORD, 
  },
});

// Verification step
transporter.verify((error) => {
  if (error) {
    console.log("Email System: ❌ Configuration Error. Check your App Password.");
    console.error(error);
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