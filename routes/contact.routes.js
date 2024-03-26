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
      html: `
      <html>
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
      </head>
      <body>
      <div class="container text-center">
      <p>${message}</p></div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      </html>
      `,
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
