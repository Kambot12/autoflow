import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true },
    color: { type: String, default: "" },
    image: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
    serviceHistory: { type: Array, default: [] },
    nextServiceDate: { type: String, default: "" },
    serviceReminderNotes: { type: String, default: "" },
    estimatedCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
