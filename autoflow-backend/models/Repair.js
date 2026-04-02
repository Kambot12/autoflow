import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    appointmentId: { type: String, default: "" },
    userId: { type: String, required: true, index: true },
    vehicleId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    workflowStage: {
      type: String,
      enum: [
        "Pending",
        "Estimate Preparation In Progress",
        "Awaiting Approval",
        "Awaiting Payment",
        "Workshop Repair In Progress",
        "Job Completed",
        "Awaiting Collection",
      ],
      default: "Pending",
    },
    estimateItems: {
      type: [
        {
          part: { type: String, default: "" },
          price: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    assignedBy: { type: String, default: "" },
    partsBreakdown: { type: String, default: "" },
    workmanshipDetails: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    labourCost: { type: Number, default: 0 },
    partsCost: { type: Number, default: 0 },
    workmanshipFee: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    depositAmount: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
    customerApproved: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    notes: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
    completedAt: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Repair || mongoose.model("Repair", repairSchema);
