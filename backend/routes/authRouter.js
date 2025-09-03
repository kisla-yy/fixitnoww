const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");

authRouter.post("/signup", authController.postsignup);
authRouter.post("/signin", authController.postsignin);
authRouter.get("/signout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid"); // clear session cookie
      res.status(200).json({ message: "Logout successful" });
    });
  } else {
    res.status(200).json({ message: "No active session" });
  }
});

// GET /session-check
authRouter.get("/session-check", (req, res) => {
  console.log("Session data:", req.session);
  if (req.session?.user) {
    return res.json({
      loggedIn: true,
      user: req.session.user,
    });
  }
  res.json({ loggedIn: false });
});


module.exports = authRouter;
