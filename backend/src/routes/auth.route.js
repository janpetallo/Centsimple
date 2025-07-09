const { Router } = require('express');
const authRouter = Router();
const passport = require('passport');

const authController = require('../controllers/auth.controller');
const validators = require('../middlewares/validators.middleware');

authRouter.post('/register', validators.validateUser, authController.register);
authRouter.get('/verify-email', authController.verifyEmail);

// authRouter.post("/login",
//   passport.authenticate("local", {
//     session: false,
//   }),
//   authController.login
// ); // simple way to do this, but no custom messages in response body

authRouter.post(
  '/login',
  (req, res, next) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      // This is our custom callback
      if (error) {
        return next(error); // Handle server errors
      }
      if (!user) {
        // Authentication failed. Send back the message from our strategy.
        return res.status(401).json({ message: info.message });
      }
      // Authentication succeeded. Manually attach user to the request object.
      req.user = user;
      next(); // Pass control to the next middleware (our login controller)
    })(req, res, next);
  },
  authController.login
);

authRouter.post('/logout', authController.logout);

authRouter.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  authController.profile
);

module.exports = authRouter;
