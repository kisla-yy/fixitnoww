import express from "express";
import upload from "../middleware/upload.js";  // Cloudinary middleware
import { handleClassify } from "../controllers/classifyController.js";

const router = express.Router();

// POST /api/classify (text + optional image)
router.post("/", upload.single("image"), handleClassify);

export default router;
