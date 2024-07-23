const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({ from: process.env.EMAIL, to, subject, text });
    console.log(`email sent to ${to}`);
  } catch (error) {
    console.log(`error sending mail to ${to}`, error);
  }
}

module.exports = { sendEmail };
