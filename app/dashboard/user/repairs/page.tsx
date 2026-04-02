"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { PaymentModal } from "@/components/payment-modal";
import { RepairProgress } from "@/components/repair-progress";
import { storage } from "@/lib/storage";
import { downloadRepairInvoice } from "@/lib/receipts";
import { ADMIN_USER_ID, sendNotification } from "@/lib/app-data";
import { sendEmailNotification } from "@/lib/notifications";
import { ADMIN_EMAIL } from "@/lib/app-data";
import { brand } from "@/lib/brand";
import { fetchServerRepairs, syncServerRepairs, updateServerRepair } from "@/lib/server-data";

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [activeRepair, setActiveRepair] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [approvedEstimateIds, setApprovedEstimateIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepairs = async () => {
      const user = storage.getUser();
      const localRepairs = storage.getRepairs();
      setRepairs(localRepairs.filter((repair: any) => repair.userId === user?.id));
      try {
        await syncServerRepairs(localRepairs);
        const serverRepairs = await fetchServerRepairs();
        storage.setRepairs(serverRepairs);
        setRepairs(serverRepairs.filter((repair: any) => repair.userId === user?.id));
      } catch {
        setRepairs(localRepairs.filter((repair: any) => repair.userId === user?.id));
      } finally {
        setLoading(false);
      }
    };

    loadRepairs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "partial":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const openPayment = (repair: any, mode: "deposit" | "full") => {
    setActiveRepair({
      ...repair,
      paymentMode: mode,
    });
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (result: any) => {
    const nextRepairs = repairs.map((repair) =>
      repair.id === result.repair.id ? { ...repair, ...result.repair } : repair
    );
    setRepairs(nextRepairs);
    storage.setRepairs(nextRepairs);
    sendNotification({
      recipientId: ADMIN_USER_ID,
      title: "Deposit received",
      content: `${result.repair.id} received a ${result.repair.paymentStatus === "paid" ? "full" : "70% deposit"} payment and can move into workshop repair in progress.`,
      category: "repair",
    });
    toast.success("Mock payment completed successfully");
  };

  const canShowEstimate = (repair: any) =>
    ["Awaiting Approval", "Awaiting Payment", "Workshop Repair In Progress", "Job Completed", "Awaiting Collection"].includes(
      repair.workflowStage || "Pending"
    );

  const approveEstimate = async (repair: any) => {
    try {
      const updatedRepair = await updateServerRepair(repair.id, {
        workflowStage: "Awaiting Payment",
        customerApproved: true,
      });
      const nextRepairs = repairs.map((entry) =>
        entry.id === repair.id ? { ...entry, ...updatedRepair } : entry
      );
      setRepairs(nextRepairs);
      storage.setRepairs(nextRepairs);
      sendNotification({
        recipientId: "admin-autoflow",
        title: "Estimate approved by customer",
        content: `${repair.title} was approved by the customer and is now awaiting payment.`,
        category: "repair",
      });
      const currentUser = storage.getUser();
      if (currentUser?.email) {
        await sendEmailNotification({
          to: ADMIN_EMAIL,
          subject: `${brand.shortName}: customer approved estimate`,
          text: `${currentUser.name || "A customer"} approved the repair estimate for ${repair.title}. The job is now awaiting payment.`,
        });
      }
      toast.success("Estimate approved. Awaiting payment now.");
    } catch {
      toast.error("Unable to approve estimate right now");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/user" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">My Repairs</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="card p-6 animate-pulse">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-3">
                    <div className="h-6 w-48 rounded bg-slate-200" />
                    <div className="h-4 w-28 rounded bg-slate-100" />
                  </div>
                  <div className="h-8 w-24 rounded-full bg-slate-200" />
                </div>
                <div className="h-4 w-full rounded bg-slate-100 mb-5" />
                <div className="grid md:grid-cols-4 gap-4 mb-5">
                  {[1, 2, 3, 4].map((cell) => (
                    <div key={cell} className="rounded-lg bg-slate-100 p-4">
                      <div className="h-3 w-20 rounded bg-slate-200 mb-3" />
                      <div className="h-5 w-24 rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : repairs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <p className="text-2xl font-bold mb-4">No repairs yet</p>
            <p className="text-gray-600">Your repairs will show up here</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {repairs.map((repair, idx) => (
              <motion.div
                key={repair.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6"
              >
                <RepairProgress currentStage={repair.workflowStage || "Pending"} />

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{repair.title}</h3>
                    <p className="text-gray-600">ID: {repair.id}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(repair.status)}`}>
                      {repair.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(repair.paymentStatus || "pending")}`}>
                      Payment: {repair.paymentStatus || "pending"}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{repair.description}</p>

                {(repair.partsBreakdown || repair.workmanshipDetails) && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-500 mb-2">Parts listed by workshop</p>
                      <p className="text-sm text-slate-700 whitespace-pre-line">
                        {repair.partsBreakdown || "Workshop has not listed parts yet"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold text-slate-500 mb-2">Workmanship details</p>
                      <p className="text-sm text-slate-700 whitespace-pre-line">
                        {repair.workmanshipDetails || "Workshop has not added workmanship details yet"}
                      </p>
                    </div>
                  </div>
                )}

                {canShowEstimate(repair) ? (
                  <>
                    <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-gray-600">Labour Cost</p>
                        <p className="font-semibold">₦{Number(repair.labourCost || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Parts Cost</p>
                        <p className="font-semibold">₦{Number(repair.partsCost || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Workmanship</p>
                        <p className="font-semibold">₦{Number(repair.workmanshipFee || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-semibold text-lg text-red-600">
                          ₦{Number(repair.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {repair.estimateItems?.length ? (
                      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-500 mb-3">Company estimate breakdown</p>
                        <div className="space-y-2">
                          {repair.estimateItems.map((item: any, index: number) => (
                            <div key={`${repair.id}-${index}`} className="flex items-center justify-between gap-4 text-sm">
                              <span className="text-slate-700">{item.part}</span>
                              <span className="font-semibold text-slate-900">
                                ₦{Number(item.price || 0).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-sm text-slate-500">
                          Assigned by: <span className="font-semibold text-slate-800">{repair.assignedBy || "Workshop Manager"}</span>
                        </p>
                      </div>
                    ) : null}

                    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Deposit required before repair starts</p>
                          <p className="font-semibold text-slate-900 mt-1">
                            ₦{Number(repair.depositAmount || Math.ceil(Number(repair.totalAmount || 0) * 0.7)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Amount paid</p>
                          <p className="font-semibold text-slate-900 mt-1">
                            ₦{Number(repair.amountPaid || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Balance due</p>
                          <p className="font-semibold text-slate-900 mt-1">
                            ₦{Number(repair.balanceDue ?? repair.totalAmount ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((Number(repair.amountPaid || 0) / Math.max(Number(repair.totalAmount || 1), 1)) * 100)
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mb-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    The workshop is still preparing your official estimate. Pricing will appear here
                    after the company approves and sends the quotation.
                  </div>
                )}

                {repair.notes && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">Admin Notes:</p>
                    <p className="text-gray-700">{repair.notes}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {repair.workflowStage === "Awaiting Approval" ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <label className="inline-flex items-center gap-2 text-sm text-amber-900">
                        <input
                          type="checkbox"
                          checked={approvedEstimateIds.includes(repair.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApprovedEstimateIds((prev) => [...prev, repair.id]);
                            } else {
                              setApprovedEstimateIds((prev) => prev.filter((id) => id !== repair.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                        />
                        I approve the estimate and confirm 70% deposit to start work
                      </label>
                      <button
                        onClick={() => approveEstimate(repair)}
                        disabled={!approvedEstimateIds.includes(repair.id)}
                        className="mt-3 btn-primary text-sm disabled:opacity-50"
                      >
                        Approve & Continue to Payment
                      </button>
                    </div>
                  ) : null}
                  {repair.workflowStage === "Awaiting Payment" &&
                  repair.paymentStatus !== "partial" && repair.paymentStatus !== "paid" ? (
                    <button
                      onClick={() => openPayment(repair, "deposit")}
                      className="btn-primary text-sm"
                    >
                      Pay 70% Deposit
                    </button>
                  ) : null}
                  {repair.workflowStage === "Awaiting Payment" && repair.paymentStatus !== "paid" ? (
                    <button
                      onClick={() => openPayment(repair, "full")}
                      className="btn-secondary text-sm"
                    >
                      {repair.paymentStatus === "partial" ? "Pay Balance" : "Full Payment"}
                    </button>
                  ) : null}
                  {repair.status === "Completed" ? (
                    <button
                      onClick={() => downloadRepairInvoice(repair)}
                      className="btn-primary text-sm"
                    >
                      Download Receipt
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <PaymentModal
        isOpen={paymentModalOpen}
        repair={activeRepair}
        onClose={() => {
          setPaymentModalOpen(false);
          setActiveRepair(null);
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
