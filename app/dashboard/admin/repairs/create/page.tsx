"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import toast from "react-hot-toast";
import { createServerRepair, fetchServerUsers } from "@/lib/server-data";

export default function CreateRepairPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workflowStage: "Estimate Preparation In Progress",
    estimateItems: [{ part: "", price: 0 }],
    assignedBy: "Workshop Manager",
    partsBreakdown: "",
    workmanshipDetails: "",
    labourCost: 0,
    partsCost: 0,
    workmanshipFee: 0,
    notes: "",
    userId: "",
    vehicleId: "",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const partsTotal = formData.estimateItems.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  useEffect(() => {
    const loadUsers = async () => {
      const appointments = storage.getAppointments();
      const uniqueUsers = [...new Set(appointments.map((a: any) => a.userId))];
      setUsers(uniqueUsers as any);
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("userId") || "";
      const vehicleId = params.get("vehicleId") || "";
      if (userId || vehicleId) {
        setFormData((current) => ({
          ...current,
          userId: userId || current.userId,
          vehicleId: vehicleId || current.vehicleId,
        }));
      }
      try {
        const serverUsers = await fetchServerUsers();
        setUsers(serverUsers);
      } catch {
        setUsers(uniqueUsers as any);
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.labourCost) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const repair = {
        id: "repair_" + Math.random().toString(36).substr(2, 9),
        ...formData,
        partsCost: partsTotal,
        status: "Pending",
        images: [],
        createdAt: new Date().toISOString(),
      };

      const serverRepair = await createServerRepair(repair);
      const repairs = storage.getRepairs();
      repairs.push(serverRepair);
      storage.setRepairs(repairs);

      toast.success("Repair created successfully!");
      setTimeout(() => {
        window.location.href = "/dashboard/admin/repairs";
      }, 1000);
    } catch (error) {
      toast.error("Failed to create repair");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/admin/repairs" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Create New Repair</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Repair Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Engine Repair"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Repair details..."
                className="input-field resize-none h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Assigned By</label>
              <input
                type="text"
                value={formData.assignedBy}
                onChange={(e) => setFormData({ ...formData, assignedBy: e.target.value })}
                placeholder="Workshop Manager"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Parts To Be Used</label>
              <textarea
                value={formData.partsBreakdown}
                onChange={(e) => setFormData({ ...formData, partsBreakdown: e.target.value })}
                placeholder="List parts like battery terminal, brake pads, filter, plugs..."
                className="input-field resize-none h-24"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <label className="block text-sm font-semibold">Estimate line items</label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((current) => ({
                      ...current,
                      estimateItems: [...current.estimateItems, { part: "", price: 0 }],
                    }))
                  }
                  className="text-sm font-semibold text-red-600"
                >
                  Add part
                </button>
              </div>
              <div className="space-y-3">
                {formData.estimateItems.map((item, index) => (
                  <div key={index} className="grid md:grid-cols-[1fr,180px,auto] gap-3">
                    <input
                      type="text"
                      value={item.part}
                      onChange={(e) =>
                        setFormData((current) => ({
                          ...current,
                          estimateItems: current.estimateItems.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, part: e.target.value } : entry
                          ),
                        }))
                      }
                      placeholder="Part name"
                      className="input-field"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        setFormData((current) => ({
                          ...current,
                          estimateItems: current.estimateItems.map((entry, entryIndex) =>
                            entryIndex === index
                              ? { ...entry, price: Number(e.target.value) || 0 }
                              : entry
                          ),
                        }))
                      }
                      placeholder="Price"
                      className="input-field"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          estimateItems:
                            current.estimateItems.length === 1
                              ? current.estimateItems
                              : current.estimateItems.filter((_, entryIndex) => entryIndex !== index),
                        }))
                      }
                      className="btn-secondary"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Parts total: ₦{partsTotal.toLocaleString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Workmanship Details</label>
              <textarea
                value={formData.workmanshipDetails}
                onChange={(e) => setFormData({ ...formData, workmanshipDetails: e.target.value })}
                placeholder="Explain the labour involved, inspection, fitting, testing, alignment..."
                className="input-field resize-none h-24"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Workshop Labour / Diagnostics (₦) *</label>
                <input
                  type="number"
                  value={formData.labourCost}
                  onChange={(e) => setFormData({ ...formData, labourCost: parseFloat(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Parts Cost (Auto-calculated)</label>
                <input
                  type="number"
                  value={partsTotal}
                  readOnly
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Workmanship Fee (₦)</label>
              <input
                type="number"
                value={formData.workmanshipFee}
                onChange={(e) => setFormData({ ...formData, workmanshipFee: parseFloat(e.target.value) || 0 })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Admin Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Internal notes..."
                className="input-field resize-none h-24"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="flex-1 btn-primary">
                {loading ? "Creating..." : "Create Repair"}
              </button>
              <Link href="/dashboard/admin/repairs" className="flex-1">
                <button type="button" className="w-full btn-secondary">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
