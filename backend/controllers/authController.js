const { check, validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");

// POST /signup
exports.postsignup = [
  check("firstname")
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name should contain only alphabets."),

  check("lastname")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name should contain only alphabets"),

  check("email")
    .isEmail()
    .trim()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 5 })
    .withMessage("Password should be atleast 5 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    .matches(/[~!@#$%^&*(){}`,./';'\":\|=+-_]/)
    .withMessage("Password should contain atleast one special character")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map((err) => err.msg),
        oldInput: { firstname, lastname, email },
      });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({
          errors: ["Email already exists"],
          oldInput: { firstname, lastname, email },
        });
      }

      const hashed = await bcrypt.hash(password, 11);
      const user = new User({ firstname, lastname, email, password: hashed });
      await user.save();

      // ✅ Return user object too
      return res.status(201).json({
        message: "Signup successful!",
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      });
    } catch (err) {
      return res.status(500).json({
        errors: [err.message],
        oldInput: { firstname, lastname, email },
      });
    }
  },
];


// POST /signin
exports.postsignin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(422).json({
      errors: ["User does not exist"],
      oldInput: { email },
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).json({
      errors: ["Wrong Password"],
      oldInput: { email },
    });
  }
      req.session.isLoggedIn = true;
      req.session.user = user;
      await req.session.save();

  return res.json({
    message: "Login successful!",
    user: { id: user._id, email: user.email },
  });
};

// GET /signout
exports.getsignout =  (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid"); // clear session cookie
      res.status(200).json({ message: "Logout successful" });
    });
  } else {
    res.status(200).json({ message: "No active session" });
  }
};
