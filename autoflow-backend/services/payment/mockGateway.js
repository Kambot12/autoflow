import crypto from "crypto";

export async function simulateMockPayment({
  repairJobId,
  amount,
  method,
}) {
  return {
    repairJobId,
    amount,
    method,
    status: "success",
    reference: `mock_${crypto.randomBytes(6).toString("hex")}`,
    paidAt: new Date().toISOString(),
  };
}
