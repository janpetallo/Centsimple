const { Router } = require('express');
const categoryRouter = Router();
const passport = require('passport');

const categoryController = require('../controllers/category.controller');
const validators = require('../middlewares/validators.middleware');

categoryRouter.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  validators.validateCategory,
  categoryController.createCategory
);

categoryRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  categoryController.getCategories
);

categoryRouter.put(
  '/update/:categoryId',
  passport.authenticate('jwt', { session: false }),
  validators.validateCategory,
  categoryController.updateCategory
);

categoryRouter.delete(
  '/delete/:categoryId',
  passport.authenticate('jwt', { session: false }),
  categoryController.deleteCategory
);

module.exports = categoryRouter;
