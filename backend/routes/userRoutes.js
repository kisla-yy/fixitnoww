// routes/userRoutes.js
import express from "express";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();

// GET /api/me
router.get("/me", getProfile);

// GET /api/session-check
router.get("/session-check", (req, res) => {
  if (req.session?.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  return res.json({ loggedIn: false });
});

export default router;
