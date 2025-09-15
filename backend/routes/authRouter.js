// routes/authRouter.js
import express from "express";
import { postsignup, postsignin, getsignout, postAdminSignin } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/userSignup", postsignup);
authRouter.post("/userSignin", postsignin);
authRouter.get("/userSignout", getsignout);
authRouter.get("/session-check", (req, res) => {
  if (req.session?.user) return res.json({ loggedIn: true, user: req.session.user });
  res.json({ loggedIn: false });
});
authRouter.post("/adminSignin", postAdminSignin);

export default authRouter;
