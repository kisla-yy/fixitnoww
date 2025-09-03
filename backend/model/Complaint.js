import mongoose from "mongoose";


const ComplaintSchema = new mongoose.Schema(
{
text: { type: String, default: "" },
category: { type: String, required: true },
confidence: { type: Number, required: true },
imageHints: { type: [String], default: [] },
textHints: { type: [String], default: [] }
},
{ timestamps: true }
);


export default mongoose.model("Complaint", ComplaintSchema);