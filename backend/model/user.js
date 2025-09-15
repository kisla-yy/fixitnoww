// model/user.js (ESM)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: [true, "First name is required"] },
  lastname: { type: String },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
});

const User = mongoose.model("users", userSchema);
export default User; // default export
