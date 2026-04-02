"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { downloadRepairInvoice, generateRepairInvoiceBase64 } from "@/lib/receipts";
import { getUsers, sendNotification } from "@/lib/app-data";
import { sendEmailNotification } from "@/lib/notifications";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { repairWorkflowStages } from "@/lib/constants";
import { RepairProgress } from "@/components/repair-progress";
import { fetchServerRepairs, fetchServerUsers, syncServerRepairs, updateServerRepair } from "@/lib/server-data";

export default function AdminRepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [vehicleFilter, setVehicleFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVehicleFilter(params.get("vehicleId") || "");

    const loadData = async () => {
      const localRepairs = storage.getRepairs();
      const localUsers = getUsers();
      setRepairs(localRepairs);
      setUsers(localUsers);

      try {
        await syncServerRepairs(localRepairs);
        const [serverRepairs, serverUsers] = await Promise.all([
          fetchServerRepairs(),
          fetchServerUsers(),
        ]);
        setRepairs(serverRepairs);
        setUsers(serverUsers.length ? serverUsers : localUsers);
        storage.setRepairs(serverRepairs);
      } catch {
        setRepairs(localRepairs);
        setUsers(localUsers);
      }
    };

    loadData();
  }, []);

  const visibleRepairs = vehicleFilter
    ? repairs.filter((repair) => repair.vehicleId === vehicleFilter)
    : repairs;

  const sendInvoiceToCustomer = async (repair: any) => {
    try {
      const pdfBase64 = generateRepairInvoiceBase64(repair);
      await fetch(`${BACKEND_URL}/api/data/repairs/${repair.id}/send-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64 }),
      });
      toast.success("Repair invoice sent to customer by email.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to send invoice email at the moment.");
    }
  };

  const handleSaveEdit = async () => {
    if (editingId && editData) {
      const previousRepair = repairs.find((repair) => repair.id === editingId);
      const updatedRepair = {
        ...editData,
        workflowStage: editData.workflowStage || "Awaiting Approval",
        status: editData.status || "Pending",
        completedAt:
          editData.status === "Completed"
            ? editData.completedAt || new Date().toISOString()
            : editData.completedAt || "",
      };
      const updated = repairs.map((r) =>
        r.id === editingId ? editData : r
      );
      const nextRepairs = repairs.map((r) =>
        r.id === editingId ? updatedRepair : r
      );
      setRepairs(nextRepairs);
      storage.setRepairs(nextRepairs);
      try {
        const serverRepair = await updateServerRepair(editingId, updatedRepair);
        const mergedRepairs = repairs.map((r) =>
          r.id === editingId ? serverRepair : r
        );
        setRepairs(mergedRepairs);
        storage.setRepairs(mergedRepairs);

        if (updatedRepair.workflowStage === "Awaiting Approval") {
          await sendInvoiceToCustomer(serverRepair);
        }
      } catch (error) {
        console.error(error);
      }
      sendNotification({
        recipientId: updatedRepair.userId,
        title: "Repair update",
        content: `Repair update: ${updatedRepair.title} is now ${updatedRepair.status}. Current total is ₦${(
          Number(updatedRepair.labourCost || 0) +
          Number(updatedRepair.partsCost || 0) +
          Number(updatedRepair.workmanshipFee || 0)
        ).toLocaleString()}.`,
        category: "repair",
      });

      const owner = users.find((user) => user.id === updatedRepair.userId);
      const estimateLines = Array.isArray(updatedRepair.estimateItems)
        ? updatedRepair.estimateItems
            .filter((item: any) => item?.part)
            .map((item: any) => `- ${item.part}: N${Number(item.price || 0).toLocaleString()}`)
            .join("\n")
        : "No estimate items added yet.";
      const total = (
        Number(updatedRepair.labourCost || 0) +
        Number(updatedRepair.partsCost || 0) +
        Number(updatedRepair.workmanshipFee || 0)
      ).toLocaleString();
      const depositAmount = Number(
        updatedRepair.depositAmount || Math.ceil(Number(updatedRepair.totalAmount || 0) * 0.7)
      ).toLocaleString();
      const amountPaid = Number(updatedRepair.amountPaid || 0).toLocaleString();
      const balanceDue = Number(
        updatedRepair.balanceDue ?? updatedRepair.totalAmount ?? 0
      ).toLocaleString();

      if (
        owner?.email &&
        (
          previousRepair?.status !== updatedRepair.status ||
          previousRepair?.workflowStage !== updatedRepair.workflowStage
        ) &&
        (
          updatedRepair.status === "In Progress" ||
          updatedRepair.status === "Completed" ||
          updatedRepair.workflowStage === "Awaiting Approval"
        )
      ) {
        const subject =
          updatedRepair.workflowStage === "Awaiting Approval"
            ? `${brand.shortName}: company repair estimate ready`
            : updatedRepair.status === "Completed"
            ? `${brand.shortName}: your repair is finished`
            : `${brand.shortName}: your repair is now in progress`;
        const text =
          updatedRepair.workflowStage === "Awaiting Approval"
            ? `Hello ${owner.name || "there"}, your company repair estimate for ${updatedRepair.title} is ready.\n\nAssigned by: ${updatedRepair.assignedBy || "Workshop Manager"}\n\nEstimate breakdown:\n${estimateLines}\n\nWorkshop labour/diagnostics: N${Number(updatedRepair.labourCost || 0).toLocaleString()}\nWorkmanship: N${Number(updatedRepair.workmanshipFee || 0).toLocaleString()}\nTotal: N${total}\n\n70% deposit required to start repair: N${depositAmount}\nWorkshop account details: Company Test Account / 0123456789 / Test Bank\n\nYou can approve from your dashboard to move this job to awaiting payment, or reply directly to this email.`
            : updatedRepair.status === "Completed"
            ? `Hello ${owner.name || "there"}, your repair for ${updatedRepair.title} has been completed. Total workshop cost is N${total}. The professional invoice includes the 70% deposit benchmark of N${depositAmount}, the amount you have paid so far of N${amountPaid}, and the remaining balance of N${balanceDue}. Parts listed: ${updatedRepair.partsBreakdown || "No parts list added yet"}. Workmanship details: ${updatedRepair.workmanshipDetails || "No workmanship details added yet"}. Please log in to your dashboard for the full invoice and next steps.`
            : `Hello ${owner.name || "there"}, your vehicle repair for ${updatedRepair.title} is now in progress at ${brand.name}. Current workshop total is N${total}. The required 70% deposit for this repair is N${depositAmount}, the amount received so far is N${amountPaid}, and the current balance is N${balanceDue}. Parts listed: ${updatedRepair.partsBreakdown || "No parts list added yet"}. Workmanship details: ${updatedRepair.workmanshipDetails || "No workmanship details added yet"}. We will notify you again when the work is completed.`;

        try {
          await sendEmailNotification({
            to: owner.email,
            subject,
            text,
          });
        } catch (error) {
          console.error(error);
        }
      }
      setEditingId(null);
      setEditData(null);
    }
  };

  const startWork = async (repair: any) => {
    try {
      const updated = await updateServerRepair(repair.id, {
        status: "In Progress",
        workflowStage: "Workshop Repair In Progress",
      });
      setRepairs((prev) => prev.map((r) => (r.id === repair.id ? updated : r)));
      storage.setRepairs(repairs.map((r) => (r.id === repair.id ? updated : r)));
      toast.success("Repair started. Progress bar updated.");
      sendNotification({
        recipientId: repair.userId,
        title: "Repair started",
        content: `Repair ${repair.title} has been marked as in progress.`,
        category: "repair",
      });
    } catch (err) {
      console.error(err);
      toast.error("Unable to start work right now");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">Repairs Management</h1>
          </div>
          <Link href="/dashboard/admin/repairs/create">
            <button className="flex items-center gap-2 btn-primary">
              <Plus className="w-5 h-5" />
              Create Repair
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {visibleRepairs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <p className="text-2xl font-bold mb-4">
              {vehicleFilter ? "No repairs for this vehicle yet" : "No repairs yet"}
            </p>
            <Link href="/dashboard/admin/repairs/create">
              <button className="btn-primary">Create First Repair</button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {visibleRepairs.map((repair, idx) => (
              <motion.div
                key={repair.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6"
              >
                {editingId === repair.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Workflow Stage</label>
                      <select
                        value={editData.workflowStage || "Pending"}
                        onChange={(e) => setEditData({ ...editData, workflowStage: e.target.value })}
                        className="input-field"
                      >
                        {repairWorkflowStages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Assigned By</label>
                      <input
                        type="text"
                        value={editData.assignedBy || ""}
                        onChange={(e) => setEditData({ ...editData, assignedBy: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Status</label>
                      <select
                        value={editData.status}
                        onChange={(e) => {
                          const nextStatus = e.target.value;
                          if (
                            nextStatus === "In Progress" &&
                            !["partial", "paid"].includes(editData.paymentStatus || "pending")
                          ) {
                            return;
                          }
                          setEditData({ ...editData, status: nextStatus });
                        }}
                        className="input-field"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Estimate line items</label>
                      <div className="space-y-3">
                        {(editData.estimateItems || []).map((item: any, index: number) => (
                          <div key={index} className="grid md:grid-cols-[1fr,180px,auto] gap-3">
                            <input
                              type="text"
                              value={item.part || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  estimateItems: (editData.estimateItems || []).map((entry: any, entryIndex: number) =>
                                    entryIndex === index ? { ...entry, part: e.target.value } : entry
                                  ),
                                })
                              }
                              className="input-field"
                              placeholder="Part name"
                            />
                            <input
                              type="number"
                              value={item.price || 0}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  estimateItems: (editData.estimateItems || []).map((entry: any, entryIndex: number) =>
                                    entryIndex === index
                                      ? { ...entry, price: Number(e.target.value) || 0 }
                                      : entry
                                  ),
                                })
                              }
                              className="input-field"
                              placeholder="Price"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setEditData({
                                  ...editData,
                                  estimateItems:
                                    (editData.estimateItems || []).length === 1
                                      ? editData.estimateItems
                                      : (editData.estimateItems || []).filter((_: any, entryIndex: number) => entryIndex !== index),
                                })
                              }
                              className="btn-secondary"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEditData({
                            ...editData,
                            estimateItems: [...(editData.estimateItems || []), { part: "", price: 0 }],
                          })
                        }
                        className="mt-3 text-sm font-semibold text-red-600"
                      >
                        Add estimate item
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Parts To Be Used</label>
                      <textarea
                        value={editData.partsBreakdown || ""}
                        onChange={(e) => setEditData({ ...editData, partsBreakdown: e.target.value })}
                        className="input-field resize-none h-24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Workmanship Details</label>
                      <textarea
                        value={editData.workmanshipDetails || ""}
                        onChange={(e) => setEditData({ ...editData, workmanshipDetails: e.target.value })}
                        className="input-field resize-none h-24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Labour Cost</label>
                      <input
                        type="number"
                        value={editData.labourCost}
                        onChange={(e) => setEditData({ ...editData, labourCost: parseFloat(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Parts Cost</label>
                      <input
                        type="number"
                        value={editData.partsCost}
                        onChange={(e) => setEditData({ ...editData, partsCost: parseFloat(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Workmanship Fee</label>
                      <input
                        type="number"
                        value={editData.workmanshipFee || 0}
                        onChange={(e) => setEditData({ ...editData, workmanshipFee: parseFloat(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Payment status</label>
                      <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getPaymentBadge(editData.paymentStatus || "pending")}`}>
                        {editData.paymentStatus || "pending"}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Deposit must be paid before repair can start.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Notes</label>
                      <textarea
                        value={editData.notes}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        className="input-field resize-none h-24"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button onClick={handleSaveEdit} className="flex-1 btn-primary">
                        {editData.workflowStage === "Awaiting Approval"
                          ? "Save & Approve by Company"
                          : "Save Changes"}
                      </button>
                      <button
                        onClick={async () => {
                          if (!editingId || !editData) return;
                          const updated = {
                            ...editData,
                            workflowStage: "Awaiting Approval",
                            status: "Pending",
                          };
                          await updateServerRepair(editingId, updated);
                          await sendInvoiceToCustomer(updated);
                          setRepairs((prev) =>
                            prev.map((r) => (r.id === editingId ? updated : r))
                          );
                          storage.setRepairs(
                            repairs.map((r) => (r.id === editingId ? updated : r))
                          );
                          setEditingId(null);
                          setEditData(null);
                        }}
                        className="flex-1 btn-secondary"
                      >
                        Save & Send Invoice
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditData(null);
                        }}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{repair.title}</h3>
                        <p className="text-gray-600">ID: {repair.id}</p>
                        <p className="text-gray-500 text-sm">
                          {users.find((user) => user.id === repair.userId)?.email || "No user email found"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(repair.status)}`}>
                          {repair.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(repair.paymentStatus || "pending")}`}>
                          Payment: {repair.paymentStatus || "pending"}
                        </span>
                      </div>
                    </div>

                    <RepairProgress currentStage={repair.workflowStage || "Pending"} />

                    {(repair.partsBreakdown || repair.workmanshipDetails) && (
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-sm font-semibold text-slate-500 mb-2">Parts list</p>
                          <p className="text-sm text-slate-700 whitespace-pre-line">
                            {repair.partsBreakdown || "No parts listed yet"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-sm font-semibold text-slate-500 mb-2">Workmanship</p>
                          <p className="text-sm text-slate-700 whitespace-pre-line">
                            {repair.workmanshipDetails || "No workmanship details yet"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-gray-600">Labour Cost</p>
                        <p className="font-semibold">₦{repair.labourCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Parts Cost</p>
                        <p className="font-semibold">₦{repair.partsCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Workmanship</p>
                        <p className="font-semibold">₦{Number(repair.workmanshipFee || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-semibold text-lg">
                          ₦{Number(repair.totalAmount || (repair.labourCost + repair.partsCost + Number(repair.workmanshipFee || 0))).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount Paid</p>
                        <p className="font-semibold">
                          ₦{Number(repair.amountPaid || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Balance Due</p>
                        <p className="font-semibold">
                          ₦{Number(repair.balanceDue || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {repair.estimateItems?.length ? (
                      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-500 mb-3">Estimate items</p>
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
                      </div>
                    ) : null}

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(repair.id);
                          setEditData(repair);
                        }}
                        className="btn-ghost"
                      >
                        Edit Repair
                      </button>
                      <button
                        onClick={() => downloadRepairInvoice(repair)}
                        className="btn-secondary"
                      >
                        Download Invoice
                      </button>
                      {repair.workflowStage === "Awaiting Payment" && repair.paymentStatus === "paid" && (
                        <button
                          onClick={() => startWork(repair)}
                          className="btn-primary"
                        >
                          Start Work
                        </button>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
