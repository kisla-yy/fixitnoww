// backend/routes/classifyRouter.js
import express from "express";
import multer from "multer";
import { handleClassify } from "../controllers/classifyController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/classify  (form-data: text (string), image (file) optional)
router.post("/", upload.single("image"), handleClassify);

export default router;
