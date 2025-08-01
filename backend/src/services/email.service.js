const nodemailer = require('nodemailer');

// Temporary function to generate an account ONCE
async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal Account Credentials:');
  console.log('User:', testAccount.user);
  console.log('Pass:', testAccount.pass);
}

// createTestAccount(); // Comment this out after generating test account

// Create the transporter object
let transporter;

if (process.env.NODE_ENV === 'production') {
  // Production: Use real Gmail credentials
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Development: Use Ethereal
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS,
    },
  });
}

async function sendVerificationEmail(userEmail, token) {
  // The verification URL your user will click
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  // Use the transporter to send the email
  const info = await transporter.sendMail({
    from: '"Centsimple" <noreply@centsimple.app>', // sender address
    to: userEmail, // list of receivers
    subject: 'Confirm your Centsimple account', // Subject line
    text: `Welcome to Centsimple! Please confirm your email address by visiting this link: ${verificationUrl}`, // plain text body
    html: `
      <div style="font-family: sans-serif; padding: 20px; text-align: center;">
        <img src="https://raw.githubusercontent.com/janpetallo/finance-tracker-app/refs/heads/fix/final-mvp-polish/assets/favicon.svg" alt="Centsimple Logo" width="64" height="64" style="margin-bottom: 10px;" />
        <h2 style="color: #333;">Welcome to Centsimple!</h2>
        <p style="color: #555; font-size: 16px;">
          Please click the button below to confirm your email address and activate your account.
        </p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: white; background-color: #6750a4; text-decoration: none; border-radius: 9999px;">
          Confirm Email Address
        </a>
        <p style="color: #888; font-size: 12px;">
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    `, // html body
  });

  // Log the URL to the special Ethereal inbox where you can view the sent email
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = { sendVerificationEmail };
