"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Wallet } from "lucide-react";
import { createMockPayment } from "@/lib/server-data";

type PaymentMode = "deposit" | "full";
type PaymentMethod = "mock-paystack" | "mock-transfer";

export function PaymentModal({
  isOpen,
  repair,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  repair: any;
  onClose: () => void;
  onSuccess: (payload: any) => void;
}) {
  const [loadingMethod, setLoadingMethod] = useState<PaymentMethod | null>(null);
  const [successPayload, setSuccessPayload] = useState<any>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("deposit");

  useEffect(() => {
    if (!repair) return;
    setPaymentMode(repair.paymentMode === "full" ? "full" : "deposit");
    setSuccessPayload(null);
    setLoadingMethod(null);
  }, [repair]);

  const totalAmount = useMemo(
    () =>
      Number(repair?.totalAmount || 0) ||
      Number(repair?.labourCost || 0) +
        Number(repair?.partsCost || 0) +
        Number(repair?.workmanshipFee || 0),
    [repair]
  );
  const depositAmount = useMemo(
    () => Number(repair?.depositAmount || Math.ceil(totalAmount * 0.7)),
    [repair, totalAmount]
  );
  const balanceDue = useMemo(
    () => Math.max(Number(repair?.balanceDue ?? totalAmount), 0),
    [repair, totalAmount]
  );
  const payAmount = paymentMode === "deposit" ? depositAmount : balanceDue || totalAmount;

  if (!isOpen || !repair) return null;

  const simulatePayment = async (method: PaymentMethod) => {
    setLoadingMethod(method);
    setSuccessPayload(null);
    await new Promise((resolve) => setTimeout(resolve, 2400));
    try {
      const result = await createMockPayment({
        repairJobId: repair.id,
        amount: payAmount,
        method,
      });
      setSuccessPayload(result);
      onSuccess(result);
    } finally {
      setLoadingMethod(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-[28px] bg-white shadow-2xl overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-red-500 font-semibold">
              Test Payment
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {successPayload ? "Payment successful" : "Complete mock payment"}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            Close
          </button>
        </div>

        {!successPayload ? (
          <div className="p-6 space-y-6">
            <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Repair job</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{repair.title}</p>
              <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
                <button
                  onClick={() => setPaymentMode("deposit")}
                  className={`rounded-2xl border px-4 py-3 text-left ${
                    paymentMode === "deposit"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <p className="font-semibold">Pay 70% Deposit</p>
                  <p className="mt-1">₦{depositAmount.toLocaleString()}</p>
                </button>
                <button
                  onClick={() => setPaymentMode("full")}
                  className={`rounded-2xl border px-4 py-3 text-left ${
                    paymentMode === "full"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <p className="font-semibold">{balanceDue && balanceDue < totalAmount ? "Pay Balance" : "Full Payment"}</p>
                  <p className="mt-1">₦{(paymentMode === "full" ? payAmount : totalAmount).toLocaleString()}</p>
                </button>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="font-semibold text-slate-700">Current status</p>
                  <p className="mt-1 text-slate-500 capitalize">{repair.paymentStatus || "pending"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 p-5">
              <div className="mb-5 rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-5 text-white shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/60">Secure Test Checkout</p>
                    <p className="mt-3 text-xl font-semibold">AutoFlow Payment Auth</p>
                    <p className="mt-1 text-sm text-white/70">
                      This is a realistic payment simulation. No real money will be charged.
                    </p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                    TEST MODE
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-white/60">Amount</p>
                    <p className="mt-1 font-semibold">₦{payAmount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-white/60">Auth Mode</p>
                    <p className="mt-1 font-semibold">Secure mock auth</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-3">
                    <p className="text-white/60">Status</p>
                    <p className="mt-1 font-semibold">Awaiting payment</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-4">Choose a fake payment option</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    method: "mock-paystack" as const,
                    title: "Simulate Paystack Payment",
                    subtitle: "Card-style checkout simulation",
                  },
                  {
                    method: "mock-transfer" as const,
                    title: "Simulate Bank Transfer",
                    subtitle: "Transfer confirmation simulation",
                  },
                ].map((option) => (
                  <button
                    key={option.method}
                    onClick={() => simulatePayment(option.method)}
                    disabled={!!loadingMethod}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-5 text-left hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-70"
                  >
                    <Wallet className="w-6 h-6 text-red-500 mb-4" />
                    <p className="font-semibold text-slate-900">{option.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{option.subtitle}</p>
                    <p className="text-sm font-semibold text-red-600 mt-4">
                      ₦{payAmount.toLocaleString()}
                    </p>
                    {loadingMethod === option.method ? (
                      <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing test payment...
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900">Payment marked successful</h3>
            <p className="text-slate-600 mt-3">
              Reference: <span className="font-semibold">{successPayload.payment.reference}</span>
            </p>
            <p className="text-slate-600 mt-2">
              Amount: ₦{Number(successPayload.payment.amount).toLocaleString()}
            </p>
            <button onClick={onClose} className="btn-primary mt-6">
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
