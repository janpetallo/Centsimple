const { Router } = require('express');
const transactionRouter = Router();
const passport = require('passport');

const transactionController = require('../controllers/transaction.controller');
const validators = require('../middlewares/validators.middleware');

transactionRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  validators.validateTransaction,
  transactionController.createTransaction
);

transactionRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  transactionController.getTransactions
);

transactionRouter.put(
  '/update/:transactionId',
  passport.authenticate('jwt', { session: false }),
  validators.validateTransactionId,
  validators.validateTransaction,
  transactionController.updateTransaction
);

transactionRouter.delete(
  '/delete/:transactionId',
  passport.authenticate('jwt', { session: false }),
  validators.validateTransactionId,
  transactionController.deleteTransaction
);

module.exports = transactionRouter;
