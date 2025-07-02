const { Router } = require("express");
const authRouter = Router();

const authController = require("../controllers/auth.controller");

authRouter.post("/register", authController.register);

module.exports = authRouter;