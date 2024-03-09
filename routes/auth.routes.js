const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

const transporter = require("../config/transporter.config");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, passVerify, firstName, lastName } = req.body;

    // Generate token for email confirmation
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    // Check that all mandatory fields are filled in
    if (
      email === "" ||
      password === "" ||
      firstName === "" ||
      lastName === "" ||
      passVerify === ""
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

    // This regular expression checks password for special characters and minimum length
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 8 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    if (password !== passVerify) {
      res.status(400).json({
        message: "Passwords did not match exactly. Please try again.",
      });
      return;
    }

    // Check the users collection if a user with the same email already exists
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(400).json({ message: "Email already in use." });
      return;
    }

    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      confirmationCode: token,
    });

    const confirmMail = await transporter.sendMail({
      from: "VegEase Planner",
      to: email,
      subject: "Confirm your new VegEase account.",
      text: `Welcome ${firstName} ${lastName}, please verify your email by clicking the link below.`,
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
      <h2>Click the link to activate your account</h2> 
      <a href="http://localhost:5005/auth/confirm/${createdUser.confirmationCode}">Verify Account</a>
      </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      </html>
      `,
    });

    const user = { email, firstName, lastName, _id: createdUser._id };
    //console.log("user", user);
    //console.log("mail sent successfully", confirmMail);
    return res.status(201).json({ user: user });
  } catch (error) {
    next(error);
  }
});
//Tested and working with Thunderclient; Verified with MongoDB Compass

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email or password are provided as empty string
    if (email === "" || password === "") {
      res.status(400).json({ message: "Please provide email and password." });
      return;
    }

    const foundUser = await User.findOne({ email });

    // Check the users collection if a user with the same email exists
    if (!foundUser) {
      res.status(401).json({ message: "User not found." });
      return;
    }
    if (foundUser.status === "Pending Confirmation") {
      res.status(400).json({ message: "User email not yet confirmed" });
      return;
    }

    const passwordCorrect = await bcrypt.compareSync(
      password,
      foundUser.password
    );

    if (passwordCorrect) {
      const { _id, firstName, lastName, status, role, profilePic } = foundUser;
      // Create an object that will be set as the token payload
      const payload = {
        _id,
        email,
        firstName,
        lastName,
        status,
        role,
        profilePic,
      };

      // Create a JSON Web Token and sign it
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      // Send the token as the response
      res.status(200).json({ authToken: authToken });
    } else {
      res.status(401).json({ message: "Unable to authenticate the user" });
      return;
    }
  } catch (error) {
    next(error);
  }
});

// GET /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, async (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

// GET /confirm/:confirmationCode - Used to accept user confirmation email
router.get("/confirm/:confirmationCode", async (req, res, next) => {
  try {
    const { confirmationCode } = req.params;
    // console.log(confirmationCode);
    const foundUser = await User.findOneAndUpdate(
      { confirmationCode: confirmationCode },
      { status: "Active" },
      { new: true }
    );

    if (!foundUser) {
      res
        .status(401)
        .json({ message: "Something went wrong, please try again." });
      return;
    }

    return res.status(200).json({ status: foundUser.status });
  } catch (error) {
    next(error);
  }
});
//Tested and working with Thunderclient; Verified with MongoDB Compass

module.exports = router;
