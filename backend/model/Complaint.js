import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    category: { type: String, required: true },
    confidence: { type: Number, required: true },
    textHints: { type: [String], default: [] },
    imageHints: { type: [String], default: [] },
    
    // ✅ Store Cloudinary URL here
    imageUrl: { type: String },

    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "fulfilled", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Middleware: auto-update `updatedAt` on status change
ComplaintSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.updatedAt = Date.now();
  }
  next();
});

export default mongoose.model("Complaint", ComplaintSchema);
