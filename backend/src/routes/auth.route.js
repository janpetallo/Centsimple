const { Router } = require("express");
const authRouter = Router();

const authController = require("../controllers/auth.controller");
const validators = require("../middlewares/validators.middleware");

authRouter.post("/register", validators.validateUser, authController.register);

module.exports = authRouter;
