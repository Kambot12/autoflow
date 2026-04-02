import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    vehicleId: { type: String, required: true, index: true },
    vehicleName: { type: String, default: "" },
    vehicleImage: { type: String, default: "" },
    customerName: { type: String, default: "" },
    customerAddress: { type: String, default: "" },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    broughtInBy: { type: String, default: "" },
    broughtInByPhone: { type: String, default: "" },
    carRegNumber: { type: String, default: "" },
    vinNumber: { type: String, default: "" },
    carType: { type: String, default: "" },
    carModel: { type: String, default: "" },
    carColor: { type: String, default: "" },
    serviceType: { type: String, required: true },
    description: { type: String, default: "" },
    damageAreas: { type: [String], default: [] },
    bookingDate: { type: String, default: "" },
    appointmentDate: { type: String, default: "" },
    appointmentTime: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: { type: String, default: "" },
    verifiedByAdmin: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
