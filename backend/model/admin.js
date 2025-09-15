// model/admin.js (ESM)
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  firstname: { type: String, required: [true, "First name is required"] },
  lastname: { type: String },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
});

const Admin = mongoose.model("admin", adminSchema);
export default Admin; // default export
