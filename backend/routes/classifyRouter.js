// backend/routes/classifyRouter.js
import express from "express";
import multer from "multer";
import { classifyMultimodal } from "../services/multimodal.js";
import { trainTextClassifier } from "../services/textClassifier.js";
import Complaint from "../model/complaint.js";   // ✅ use import, not require

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Train once on boot
await trainTextClassifier();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { text = "" } = req.body;
    const imageBuffer = req.file?.buffer || null;

    const result = await classifyMultimodal({ text, imageBuffer });

    const allowSave =
      (process.env.ALLOW_SAVE || "false").toLowerCase() === "true";

    if (allowSave && result?.label) {
      await Complaint.create({
        text,
        category: result.label,
        confidence: result.confidence,
        imageHints: result.parts?.image?.hints || [],
        textHints: result.parts?.text?.hints || [],
      });
    }

    res.json({ ok: true, result });
  } catch (err) {
    console.error("/classify error", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
