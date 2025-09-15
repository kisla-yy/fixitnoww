import { classifyMultimodal } from "../services/multimodal.js";
import Complaint from "../model/Complaint.js";

export async function handleClassify(req, res) {
  try {
    const { text, lat, lng } = req.body;

    // ✅ Cloudinary returns `secure_url`, fallback to `path` if local upload
    const imageUrl = req.file ? (req.file.secure_url || req.file.path) : null;

    if (!text && !imageUrl) {
      return res
        .status(400)
        .json({ error: "Provide text or image for classification" });
    }

    // Run multimodal classification
    const result = await classifyMultimodal({
      text,
      // image classification can be added later
    });

    // Always trust text classification if available
    let finalCategory = result.parts?.text?.label || result.label;
    let finalConfidence = result.parts?.text?.confidence || result.confidence;

    // Save to MongoDB
    const complaint = await Complaint.create({
      text,
      category: finalCategory,
      confidence: finalConfidence,
      textHints: result.parts?.text?.hints || [],
      imageHints: result.parts?.image?.hints || [],
      imageUrl, // ✅ matches schema field
      location: lat && lng ? { lat, lng } : undefined,
    });

    return res.json({
      ok: true,
      saved: complaint,
      result,
      cloudinaryImage: imageUrl || null, // helpful for frontend
    });
  } catch (err) {
    console.error("handleClassify error:", err);
    return res.status(500).json({
      error: "Classification failed",
      message: err.message,
      stack: err.stack?.split("\n").slice(0, 5),
    });
  }
}
