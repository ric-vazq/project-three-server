const express = require("express");
const router = express.Router();
const transporter = require("../config/transporter.config");

// POST /send-email  - Send an email through the contact form
router.post("/send-email", async (req, res, next) => {
  try {
    const { email, subject, firstName, lastName, message } = req.body;

    // Check that all mandatory fields are filled in
    if (
      email === "" ||
      subject === "" ||
      firstName === "" ||
      lastName === "" ||
      message === ""
    ) {
      res.status(400).json({ message: "Please fill in all required fields!" });
      return;
    }
    //This regular expression check that the email is of a valid format
    const emailRegex = new RegExp(
      /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/
    );
    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ message: "Please provide a valid email address." });
      return;
    }

    // console.log("Sending email:", req.body);

    const confirmMail = await transporter.sendMail({
      from: "VegEase Planner",
      // to: "cabioch.brice@gmail.com", // For testing
      to: "veganease.planner@gmail.com",
      subject: subject,
      text: message,
    });

    // console.log("Email sent successfully:", confirmMail);

    res
      .status(200)
      .json({ message: "Email sent successfully to VegEase Planner." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
