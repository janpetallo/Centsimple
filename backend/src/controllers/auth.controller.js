const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const emailService = require('../services/email.service');

// Helper function to get consistent cookie options
function getCookieOptions() {
  const options = {
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'lax';
  } else {
    // For development on localhost with different ports
    options.secure = true;
    options.sameSite = 'none';
  }
  return options;
}

async function register(req, res) {
  let newUser;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    const successMessage =
      'Your registration request has been processed. Please check your email for next steps.';

    if (existingUser) {
      // If user exists but is not verified, resend their verification email.
      if (!existingUser.isVerified) {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.user.update({
          where: { email: email },
          data: {
            verificationToken: verificationToken,
            verificationTokenExpires: expiresAt,
          },
        });

        await emailService.sendVerificationEmail(email, verificationToken);

        // Return a 200 OK with the same generic message.
        return res.status(200).json({ message: successMessage });
      }

      // If user exists and is verified, return the SAME message as a new registration.
      return res.status(201).json({ message: successMessage });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        verificationToken: verificationToken,
        verificationTokenExpires: expiresAt,
      },
    });

    // call the function sending the verification email
    await emailService.sendVerificationEmail(email, verificationToken);

    // Remove all sensitive fields before sending the response
    const {
      password: _,
      verificationToken: __,
      verificationTokenExpires: ___,
      ...user
    } = newUser;

    res.status(201).json({
      message: successMessage,
      user: user,
    });
  } catch (error) {
    console.error('Registration error:', error);

    // If a user was created before the error happened, delete them.
    if (newUser) {
      await prisma.user.delete({ where: { id: newUser.id } });
    }

    res
      .status(500)
      .json({ message: 'Could not create your account. Please try again.' });
  }
}

async function verifyEmail(req, res) {
  const token = req.query.token;
  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gte: new Date(), // token should not be expired yet
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'This verification link is invalid or has expired.' });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    res.status(200).json({
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Email verification error', error);
    res
      .status(500)
      .json({ message: 'Could not verify your email. Please try again.' });
  }
}

async function resendVerificationEmail(req, res) {
  const { email } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const genericSuccessMessage =
      'If an account with this email exists, a new verification link has been sent.';

    // If user doesn't exist or is already verified, we do nothing but send the generic message.
    if (!existingUser || existingUser.isVerified) {
      return res.status(200).json({ message: genericSuccessMessage });
    }

    // This block now only runs if the user exists AND is not verified.
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        verificationToken: verificationToken,
        verificationTokenExpires: expiresAt,
      },
    });

    await emailService.sendVerificationEmail(email, verificationToken);

    // User exists and is not verified, so we send the same generic success message.
    return res.status(200).json({ message: genericSuccessMessage });
  } catch (error) {
    console.error('Resend verification email error', error);
    res.status(500).json({
      message: 'Could not resend verification email. Please try again.',
    });
  }
}

async function login(req, res) {
  try {
    const userPayload = {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    };

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(userPayload, secret, { expiresIn: '1h' });

    const cookieOptions = {
      ...getCookieOptions(),
      maxAge: 60 * 60 * 1000, // 1 hour
    };

    res.cookie('token', token, cookieOptions);

    res.status(200).json(req.user);
  } catch (error) {
    console.error('Login error', error);
    res
      .status(500)
      .json({ message: 'Something went wrong. Please try again.' });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('token', getCookieOptions());
    res.status(200).json({ message: 'You have been logged out.' });
  } catch (error) {
    console.error('Logout error', error);
    res
      .status(500)
      .json({ message: 'Something went wrong. Please try again.' });
  }
}

async function profile(req, res) {
  try {
    // req.user do not have the sensitive data since they were removed in passport.js
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Profile access error', error);
    res
      .status(500)
      .json({ message: 'Could not load your profile. Please try again.' });
  }
}

module.exports = {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  logout,
  profile,
};
