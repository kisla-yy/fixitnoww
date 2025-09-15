import express from "express";
import Complaint from "../model/Complaint.js";

const router = express.Router();

// GET all complaints (main admin view)
router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET complaints by category (department wise)
router.get("/complaints/:category", async (req, res) => {
  try {
    const complaints = await Complaint.find({
      category: req.params.category,
    }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH complaint status
router.patch("/complaints/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "in-progress", "fulfilled", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    console.error("Error updating complaint status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
