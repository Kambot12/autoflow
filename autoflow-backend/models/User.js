import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  image: { type: String },
  otp: { type: Number },
  otpExpiry: { type: Date },
  role: { type: String, default: "user" },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
