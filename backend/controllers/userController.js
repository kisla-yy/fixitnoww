// controllers/userController.js
import User from "../model/user.js";

export const getProfile = async (req, res) => {
  try {
    // prefer req.user (attached in middleware)
    if (req.user) {
      return res.json({
        name: [req.user.firstname, req.user.lastname].filter(Boolean).join(" "),
        email: req.user.email,
      });
    }

    // fallback: req.session.user
    if (req.session?.user) {
      const dbUser = await User.findById(req.session.user._id).select("firstname lastname email");
      if (dbUser) {
        return res.json({
          name: [dbUser.firstname, dbUser.lastname].filter(Boolean).join(" "),
          email: dbUser.email,
        });
      }
    }

    return res.status(401).json({ error: "Not authenticated" });
  } catch (err) {
    console.error("❌ getProfile error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
