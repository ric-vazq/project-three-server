const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;