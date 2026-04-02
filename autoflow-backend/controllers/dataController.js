import Appointment from "../models/Appointment.js";
import Repair from "../models/Repair.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

const normalizeVehicle = (vehicle) => ({
  id: vehicle.id,
  userId: vehicle.userId,
  make: vehicle.make,
  model: vehicle.model,
  year: vehicle.year,
  licensePlate: vehicle.licensePlate,
  color: vehicle.color || "",
  image: vehicle.image || "",
  createdAt: vehicle.createdAt,
  serviceHistory: vehicle.serviceHistory || [],
  nextServiceDate: vehicle.nextServiceDate || "",
  serviceReminderNotes: vehicle.serviceReminderNotes || "",
  estimatedCost: vehicle.estimatedCost || 0,
});

const normalizeAppointment = (appointment) => ({
  id: appointment.id,
  userId: appointment.userId,
  vehicleId: appointment.vehicleId,
  vehicleName: appointment.vehicleName || "",
  vehicleImage: appointment.vehicleImage || "",
  customerName: appointment.customerName || "",
  customerAddress: appointment.customerAddress || "",
  customerEmail: appointment.customerEmail || "",
  customerPhone: appointment.customerPhone || "",
  broughtInBy: appointment.broughtInBy || "",
  broughtInByPhone: appointment.broughtInByPhone || "",
  carRegNumber: appointment.carRegNumber || "",
  vinNumber: appointment.vinNumber || "",
  carType: appointment.carType || "",
  carModel: appointment.carModel || "",
  carColor: appointment.carColor || "",
  serviceType: appointment.serviceType || "",
  description: appointment.description || "",
  damageAreas: appointment.damageAreas || [],
  bookingDate: appointment.bookingDate || "",
  appointmentDate: appointment.appointmentDate || "",
  appointmentTime: appointment.appointmentTime || "",
  status: appointment.status || "Pending",
  notes: appointment.notes || "",
  verifiedByAdmin: Boolean(appointment.verifiedByAdmin),
  createdAt: appointment.createdAt,
});

const normalizeRepair = (repair) => ({
  id: repair.id,
  appointmentId: repair.appointmentId || "",
  userId: repair.userId,
  vehicleId: repair.vehicleId,
  title: repair.title,
  description: repair.description || "",
  workflowStage: repair.workflowStage || "Pending",
  estimateItems: (repair.estimateItems || []).map((item) => ({
    part: item.part || "",
    price: Number(item.price || 0),
  })),
  assignedBy: repair.assignedBy || "",
  partsBreakdown: repair.partsBreakdown || "",
  workmanshipDetails: repair.workmanshipDetails || "",
  status: repair.status,
  labourCost: Number(repair.labourCost || 0),
  partsCost: Number(repair.partsCost || 0),
  workmanshipFee: Number(repair.workmanshipFee || 0),
  totalAmount: Number(repair.totalAmount || 0),
  depositAmount: Number(repair.depositAmount || 0),
  amountPaid: Number(repair.amountPaid || 0),
  balanceDue: Number(repair.balanceDue || 0),
  paymentStatus: repair.paymentStatus || "pending",
  customerApproved: Boolean(repair.customerApproved),
  images: repair.images || [],
  notes: repair.notes || "",
  createdAt: repair.createdAt,
  completedAt: repair.completedAt || "",
});

export const listUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        image: user.image || "",
        phone: user.phone || "",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const listAppointments = async (_req, res) => {
  try {
    const appointments = await Appointment.find().sort({ updatedAt: -1 });
    return res.json({
      success: true,
      appointments: appointments.map(normalizeAppointment),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const syncAppointments = async (req, res) => {
  try {
    const appointments = Array.isArray(req.body?.appointments)
      ? req.body.appointments
      : [];
    for (const appointment of appointments) {
      if (!appointment?.id || !appointment?.userId || !appointment?.vehicleId) continue;
      await Appointment.findOneAndUpdate(
        { id: appointment.id },
        { ...appointment },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const nextAppointments = await Appointment.find().sort({ updatedAt: -1 });
    return res.json({
      success: true,
      appointments: nextAppointments.map(normalizeAppointment),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    return res.status(201).json({
      success: true,
      appointment: normalizeAppointment(appointment),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findOneAndUpdate(
      { id },
      { ...req.body },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, error: "Appointment not found" });
    }

    return res.json({
      success: true,
      appointment: normalizeAppointment(appointment),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const listVehicles = async (_req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ updatedAt: -1 });
    return res.json({
      success: true,
      vehicles: vehicles.map(normalizeVehicle),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const syncVehicles = async (req, res) => {
  try {
    const vehicles = Array.isArray(req.body?.vehicles) ? req.body.vehicles : [];
    for (const vehicle of vehicles) {
      if (!vehicle?.id || !vehicle?.userId) continue;
      await Vehicle.findOneAndUpdate(
        { id: vehicle.id },
        { ...vehicle },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const nextVehicles = await Vehicle.find().sort({ updatedAt: -1 });
    return res.json({
      success: true,
      vehicles: nextVehicles.map(normalizeVehicle),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOneAndUpdate(
      { id },
      { ...req.body },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, error: "Vehicle not found" });
    }

    return res.json({
      success: true,
      vehicle: normalizeVehicle(vehicle),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const listRepairs = async (_req, res) => {
  try {
    const repairs = await Repair.find().sort({ updatedAt: -1 });
    return res.json({
      success: true,
      repairs: repairs.map(normalizeRepair),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const sendRepairInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ success: false, error: "PDF content required" });
    }

    const repair = await Repair.findOne({ id });
    if (!repair) {
      return res.status(404).json({ success: false, error: "Repair not found" });
    }

    const user = await User.findOne({ id: repair.userId });
    if (!user || !user.email) {
      return res.status(404).json({ success: false, error: "User not found for repair" });
    }

    await sendEmail(
      user.email,
      `AutoFlow: Repair estimate invoice`,
      `Hello ${user.name || "Customer"},\n\nYour repair invoice for ${repair.title} is attached. Please review and send 70% deposit before repair start.\n\nBest regards,\nAutoFlow Workshop`,
      [
        {
          filename: `repair-invoice-${repair.id}.pdf`,
          content: pdfBase64,
          encoding: "base64",
        },
      ]
    );

    repair.workflowStage = "Awaiting Approval";
    await repair.save();

    return res.json({ success: true, repair: normalizeRepair(repair) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const syncRepairs = async (req, res) => {
  try {
    const repairs = Array.isArray(req.body?.repairs) ? req.body.repairs : [];
    for (const repair of repairs) {
      if (!repair?.id || !repair?.userId || !repair?.vehicleId) continue;
      await Repair.findOneAndUpdate(
        { id: repair.id },
        { ...repair },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const nextRepairs = await Repair.find().sort({ updatedAt: -1 });
    return res.json({
      success: true,
      repairs: nextRepairs.map(normalizeRepair),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createRepair = async (req, res) => {
  try {
    const estimateItems = Array.isArray(req.body.estimateItems)
      ? req.body.estimateItems
          .filter((item) => item?.part)
          .map((item) => ({
            part: item.part,
            price: Number(item.price || 0),
          }))
      : [];
    const derivedPartsCost = estimateItems.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
    const totalAmount =
      Number(req.body.labourCost || 0) +
      Number(req.body.partsCost !== undefined ? req.body.partsCost : derivedPartsCost) +
      Number(req.body.workmanshipFee || 0);
    const depositAmount = Math.ceil(totalAmount * 0.7);
    const repair = await Repair.create({
      ...req.body,
      estimateItems,
      partsCost:
        req.body.partsCost !== undefined
          ? Number(req.body.partsCost)
          : derivedPartsCost,
      totalAmount,
      depositAmount,
      amountPaid: Number(req.body.amountPaid || 0),
      balanceDue:
        req.body.balanceDue !== undefined
          ? Number(req.body.balanceDue)
          : totalAmount,
      paymentStatus: req.body.paymentStatus || "pending",
    });
    return res.status(201).json({
      success: true,
      repair: normalizeRepair(repair),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Repair.findOne({ id });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Repair not found" });
    }

    const nextPayload = { ...req.body };
    const estimateItems = Array.isArray(nextPayload.estimateItems)
      ? nextPayload.estimateItems
          .filter((item) => item?.part)
          .map((item) => ({
            part: item.part,
            price: Number(item.price || 0),
          }))
      : Array.isArray(existing.estimateItems)
        ? existing.estimateItems.map((item) => ({
            part: item.part || "",
            price: Number(item.price || 0),
          }))
        : [];
    const derivedPartsCost = estimateItems.reduce(
      (sum, item) => sum + Number(item.price || 0),
      0
    );
    const labourCost =
      nextPayload.labourCost !== undefined
        ? Number(nextPayload.labourCost)
        : Number(existing.labourCost || 0);
    const partsCost =
      nextPayload.partsCost !== undefined
        ? Number(nextPayload.partsCost)
        : derivedPartsCost || Number(existing.partsCost || 0);
    const workmanshipFee =
      nextPayload.workmanshipFee !== undefined
        ? Number(nextPayload.workmanshipFee)
        : Number(existing.workmanshipFee || 0);
    const totalAmount = labourCost + partsCost + workmanshipFee;
    const amountPaid =
      nextPayload.amountPaid !== undefined
        ? Number(nextPayload.amountPaid)
        : Number(existing.amountPaid || 0);
    nextPayload.totalAmount = totalAmount;
    nextPayload.depositAmount = Math.ceil(totalAmount * 0.7);
    nextPayload.balanceDue = Math.max(totalAmount - amountPaid, 0);
    nextPayload.estimateItems = estimateItems;
    nextPayload.partsCost = partsCost;

    const repair = await Repair.findOneAndUpdate(
      { id },
      nextPayload,
      { new: true }
    );

    return res.json({
      success: true,
      repair: normalizeRepair(repair),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
