const nodemailer = require('nodemailer');

// Temporary function to generate an account ONCE
async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal Account Credentials:');
  console.log('User:', testAccount.user);
  console.log('Pass:', testAccount.pass);
}

// createTestAccount(); // Comment this out after generating test account

// Create the transporter object using Etheral credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

async function sendVerificationEmail(userEmail, token) {
  // The verification URL your user will click
  const verificationUrl = `http://localhost:5001/api/auth/verify-email?token=${token}`;

  // Use the transporter to send the email
  const info = await transporter.sendMail({
    from: '"Momentum Money" <noreply@momentum.money>', // sender address
    to: userEmail, // list of receivers
    subject: 'Verify Your Email Address', // Subject line
    text: `Please verify your email by clicking this link: ${verificationUrl}`, // plain text body
    html: `<p>Please verify your email by clicking this link:</p><a href="${verificationUrl}">${verificationUrl}</a>`, // html body
  });

  // Log the URL to the special Ethereal inbox where you can view the sent email
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = { sendVerificationEmail };
