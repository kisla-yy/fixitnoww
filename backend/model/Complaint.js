import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    category: { type: String, required: true },
    confidence: { type: Number, required: true },
    textHints: { type: [String], default: [] },
    imageHints: { type: [String], default: [] },
    imagePath: { type: String },   // ✅ will now store Cloudinary secure URL
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", ComplaintSchema);
