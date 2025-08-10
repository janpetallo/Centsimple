const { body, param } = require('express-validator');

const validateUser = [
  body('firstName')
    .trim() // Remove whitespace
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters.'),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters.'),
  body('email').trim().isEmail().withMessage('Please enter a valid email.'),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/\d/)
    .withMessage('Password must contain at least one number.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[^\w\s]/)
    .withMessage('Password must contain at least one symbol.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match.');
    }
    return true;
  }),
];

const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required.')
    .isLength({ min: 2 })
    .withMessage('Category name must be at least 2 characters.'),
];

const validateTransaction = [
  body('amount')
    .trim()
    .notEmpty()
    .withMessage('Amount is required.')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('categoryId')
    .trim()
    .notEmpty()
    .withMessage('Category is required.')
    .isInt()
    .withMessage('Invalid category selected.'),
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Please use a valid date format.'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required.')
    .isIn(['INCOME', 'EXPENSE'])
    .withMessage('Invalid transaction type.'),
];

const validateCategoryId = [
  param('categoryId').isInt().withMessage('Invalid category ID.'),
];

const validateTransactionId = [
  param('transactionId').isInt().withMessage('Invalid transaction ID.'),
];

const validateSaving = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters.'),
  body('initialBalance')
    .isFloat({ gte: 0 })
    .withMessage('Initial balance must be a non-negative number.'),
  body('targetAmount')
    .optional({ nullable: true })
    .isFloat({ gt: 0 })
    .withMessage('Target amount must be a positive number.'),
  body('targetDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Please use a valid date format.'),
  body('isTransfer')
    .isBoolean()
    .withMessage('isTransfer must be a boolean value.'),
];

const validateTransferSaving = [
  param('goalId').isInt().withMessage('Invalid Goal ID.'),
  body('amount')
    .isFloat()
    .not()
    .equals('0')
    .withMessage('Amount cannot be zero.'),
  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Please use a valid date format.'),
];

const validateSpendSaving = [
  param('goalId').isInt().withMessage('Invalid Goal ID.'),
  body('amount')
    .trim()
    .notEmpty()
    .withMessage('Amount is required.')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number.'),
  body('description').trim().notEmpty().withMessage('Description is required.'),
  body('categoryId')
    .trim()
    .notEmpty()
    .withMessage('Category is required.')
    .isInt()
    .withMessage('Invalid category selected.'),
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Please use a valid date format.'),
];

module.exports = {
  validateUser,
  validateCategory,
  validateTransaction,
  validateCategoryId,
  validateTransactionId,
  validateSaving,
  validateTransferSaving,
  validateSpendSaving,
};
