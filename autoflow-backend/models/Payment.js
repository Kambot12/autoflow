import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    repairJobId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["mock-paystack", "mock-transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    reference: { type: String, required: true, unique: true },
    paidAt: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
