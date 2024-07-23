const User = require("../models/user.model");
const ResetToken = require("../models/reset.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const crypto = require("crypto");
const { sendEmail } = require("../utils/mailer");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "account already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.json({ user });
  } catch (error) {
    res.status(500).send("internal server error", error);
  }
};

exports.loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Incorrect email or password");
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const saveToken = new Token({ userId: user._id, token });
    await saveToken.save();
    res.json({ token });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    console.log(error);
  }
};

exports.forgetPassword = async function (req, res) {
  try {
    const { email } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

   
    await ResetToken.deleteOne({ userId: user._id });

    
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    
    await new ResetToken({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

   
    const link = `${process.env.BASE_URL}/api/auth/password-reset?token=${resetToken}`;
    await sendEmail(user.email, "Password reset request", link);

    res.send("Password reset link sent to your email account");
  } catch (error) {
    
    console.error("Error processing password reset request:", error.message);
    console.error(error.stack);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

exports.resetPassword = async function (req, res) {
  try {
    const { token, id, password } = req.body;
    const passwordResetToken = await ResetToken.findOne({ userId: id });
    if (!passwordResetToken) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
    const isValidToken = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValidToken) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    const user = await User.findById(id);
    user.password = password;
    await user.save();
    await passwordResetToken.deleteOne();
    res
      .status(StatusCodes.OK)
      .send("Password reset successfully back to login");
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    console.log(error);
  }
};
