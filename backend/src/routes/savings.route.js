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

module.exports = savingsRouter;
