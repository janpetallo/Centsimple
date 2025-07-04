const { body } = require('express-validator');
const lengthErr = 'must be at least 2 characters';
const emailErr = 'must be a valid email';

const validateUser = [
  body('firstName')
    .trim() // Remove whitespace
    .isLength({ min: 2 })
    .withMessage(`First name ${lengthErr}`)
    .escape(), // Sanitize to prevent XSS
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage(`Last name ${lengthErr}`)
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[^\w\s]/)
    .withMessage('Password must contain at least one symbol'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2 })
    .withMessage(`Category name ${lengthErr}`)
    .escape(),
];

module.exports = { validateUser, validateCategory };
