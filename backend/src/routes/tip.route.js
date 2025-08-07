const { Router } = require('express');
const tipRouter = Router();
const passport = require('passport');

const tipController = require('../controllers/tip.controller');

tipRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  tipController.generateTip
);

module.exports = tipRouter;
