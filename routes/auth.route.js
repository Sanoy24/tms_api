const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/auth/register", authController.registerUser);
router.post("/auth/login", authController.loginUser);
router.post("/auth/forgot-password", authController.forgetPassword);
router.post("/auth/password-reset", authController.resetPassword);

module.exports = router;
