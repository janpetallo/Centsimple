const { Router } = require('express');
const savingsRouter = Router();
const passport = require('passport');

const savingsController = require('../controllers/savings.controller');
const validators = require('../middlewares/validators.middleware');

savingsRouter.post(
  '/create',
  validators.validateSaving,
  passport.authenticate('jwt', { session: false }),
  savingsController.createSaving
);

savingsRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  savingsController.getSavings
);

savingsRouter.get(
  '/:goalId/history',
  validators.validateSavingId,
  passport.authenticate('jwt', { session: false }),
  savingsController.getSavingHistory
);

savingsRouter.post(
  '/:goalId/spend',
  validators.validateSpendSaving,
  passport.authenticate('jwt', { session: false }),
  savingsController.spendFromSaving
);

savingsRouter.post(
  '/:goalId/transfer',
  validators.validateTransferSaving,
  passport.authenticate('jwt', { session: false }),
  savingsController.transferSaving
);

module.exports = savingsRouter;
