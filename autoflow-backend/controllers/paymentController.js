import Payment from "../models/Payment.js";
import Repair from "../models/Repair.js";
import { processMockPayment } from "../services/payment/gatewayRegistry.js";

const normalizePayment = (payment) => ({
  id: payment._id.toString(),
  repairJobId: payment.repairJobId,
  userId: payment.userId,
  amount: Number(payment.amount || 0),
  method: payment.method,
  status: payment.status,
  paymentStatus: payment.paymentStatus,
  reference: payment.reference,
  paidAt: payment.paidAt || "",
  createdAt: payment.createdAt,
});

export const mockPayment = async (req, res) => {
  try {
    const { repairJobId, amount, method } = req.body;

    if (!repairJobId || !amount || !method) {
      return res.status(400).json({
        success: false,
        error: "repairJobId, amount, and method are required",
      });
    }

    const repair = await Repair.findOne({ id: repairJobId });
    if (!repair) {
      return res.status(404).json({ success: false, error: "Repair job not found" });
    }

    const gatewayResult = await processMockPayment({
      repairJobId,
      amount: Number(amount),
      method,
    });

    const totalAmount =
      Number(repair.totalAmount || 0) ||
      Number(repair.labourCost || 0) +
        Number(repair.partsCost || 0) +
        Number(repair.workmanshipFee || 0);
    const depositAmount =
      Number(repair.depositAmount || 0) || Math.ceil(totalAmount * 0.7);
    const nextAmountPaid = Number(repair.amountPaid || 0) + Number(amount);
    const nextPaymentStatus = nextAmountPaid >= totalAmount ? "paid" : "partial";

    const payment = await Payment.create({
      repairJobId,
      userId: repair.userId,
      amount: Number(amount),
      method,
      status: gatewayResult.status,
      paymentStatus: nextPaymentStatus,
      reference: gatewayResult.reference,
      paidAt: gatewayResult.paidAt,
      createdAt: new Date().toISOString(),
    });

    repair.totalAmount = totalAmount;
    repair.depositAmount = depositAmount;
    repair.amountPaid = nextAmountPaid;
    repair.balanceDue = Math.max(totalAmount - nextAmountPaid, 0);
    repair.paymentStatus = nextPaymentStatus;

    if (nextAmountPaid >= depositAmount && repair.status === "Pending") {
      repair.status = "In Progress";
      repair.workflowStage = "Workshop Repair In Progress";
    }

    await repair.save();

    return res.json({
      success: true,
      payment: normalizePayment(payment),
      repair: {
        id: repair.id,
        status: repair.status,
        paymentStatus: repair.paymentStatus,
        amountPaid: repair.amountPaid,
        totalAmount: repair.totalAmount,
        depositAmount: repair.depositAmount,
        balanceDue: repair.balanceDue,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const listPayments = async (req, res) => {
  try {
    const { repairJobId, userId } = req.query;
    const filter = {};
    if (repairJobId) filter.repairJobId = repairJobId;
    if (userId) filter.userId = userId;

    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    return res.json({
      success: true,
      payments: payments.map(normalizePayment),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
