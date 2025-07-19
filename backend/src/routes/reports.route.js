const { Router } = require('express');
const reportsRouter = Router();
const passport = require('passport');

const reportsController = require('../controllers/reports.controller');

reportsRouter.get(
  '/summary',
  passport.authenticate('jwt', { session: false }),
  reportsController.getSummaryReport
);

module.exports = reportsRouter;
