"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import toast from "react-hot-toast";
import { VehicleVisual } from "@/components/vehicle-visual";
import { RepairProgress } from "@/components/repair-progress";
import { getUsers, sendSystemAlert } from "@/lib/app-data";
import { sendEmailNotification } from "@/lib/notifications";
import { brand } from "@/lib/brand";
import {
  fetchServerAppointments,
  syncServerAppointments,
  updateServerAppointment,
} from "@/lib/server-data";

export default function AdminBookingsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      const localAppointments = storage.getAppointments();
      setAppointments(localAppointments);
      setUsers(getUsers());
      try {
        await syncServerAppointments(localAppointments);
        const serverAppointments = await fetchServerAppointments();
        setAppointments(serverAppointments);
        storage.setAppointments(serverAppointments);
      } catch (error) {
        console.error(error);
      }
    };

    loadAppointments();
  }, []);

  const handleStatusChange = async () => {
    if (editingId && editData) {
      const updated = appointments.map((a) =>
        a.id === editingId
          ? { ...editData, verifiedByAdmin: editData.status !== "Pending" }
          : a
      );
      const vehicles = storage.getVehicles();
      const updatedVehicles = vehicles.map((vehicle: any) =>
        vehicle.id === editData.vehicleId && editData.vehicleImage
          ? { ...vehicle, image: editData.vehicleImage }
          : vehicle
      );
      setAppointments(updated);
      storage.setAppointments(updated);
      try {
        const serverAppointment = await updateServerAppointment(editingId, {
          ...editData,
          verifiedByAdmin: editData.status !== "Pending",
        });
        const merged = updated.map((entry) =>
          entry.id === editingId ? serverAppointment : entry
        );
        setAppointments(merged);
        storage.setAppointments(merged);
      } catch (error) {
        console.error(error);
      }
      storage.setVehicles(updatedVehicles);
      sendSystemAlert({
        recipientId: editData.userId,
        content: `Your booking for ${editData.serviceType} is now ${editData.status}. ${
          editData.status === "Confirmed"
            ? `Admin scheduled your vehicle intake for ${editData.appointmentDate ? new Date(editData.appointmentDate).toLocaleDateString() : "the agreed date"}${editData.appointmentTime ? ` at ${editData.appointmentTime}` : ""}.`
            : editData.status === "In Progress"
              ? "Your car is now being worked on."
              : editData.status === "Completed"
                ? "Your job is complete and ready for the next step."
                : editData.status === "Cancelled"
                  ? "Please contact admin for a new schedule."
                  : "We will keep you updated."
        }`,
      });
      const owner = users.find((user) => user.id === editData.userId);
      if (owner?.email && editData.status === "Confirmed" && editData.appointmentDate) {
        sendEmailNotification({
          to: owner.email,
          subject: `${brand.shortName}: vehicle intake date scheduled`,
          text: `Hello ${editData.customerName || owner.name || "there"}, your vehicle has been scheduled for workshop intake on ${new Date(editData.appointmentDate).toLocaleDateString()}${editData.appointmentTime ? ` at ${editData.appointmentTime}` : ""}. Please come with the vehicle registration details and be available on ${editData.customerPhone || "your registered phone number"}.`,
        }).catch(console.error);
      }
      setEditingId(null);
      setEditData(null);
      toast.success("Booking updated");
    }
  };

  const applyQuickStatus = async (appointment: any, status: "Confirmed" | "In Progress" | "Completed" | "Cancelled") => {
    const updated = appointments.map((entry) =>
      entry.id === appointment.id
        ? { ...entry, status, verifiedByAdmin: true }
        : entry
    );
    setAppointments(updated);
    storage.setAppointments(updated);
    try {
      const serverAppointment = await updateServerAppointment(appointment.id, {
        ...appointment,
        status,
        verifiedByAdmin: true,
      });
      const merged = updated.map((entry) =>
        entry.id === appointment.id ? serverAppointment : entry
      );
      setAppointments(merged);
      storage.setAppointments(merged);
    } catch (error) {
      console.error(error);
    }
    sendSystemAlert({
      recipientId: appointment.userId,
      content: `Booking ${appointment.id.slice(0, 8)} was marked ${status} by admin for ${appointment.serviceType}.`,
    });
    toast.success(`Booking marked ${status}`);
  };

  const handleVehicleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editData) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditData({ ...editData, vehicleImage: String(reader.result) });
      toast.success("Vehicle image ready to save");
    };
    reader.readAsDataURL(file);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments = appointments.filter((apt) =>
    [
      apt.id,
      apt.serviceType,
      apt.vehicleName,
      apt.vehicleId,
      apt.status,
      apt.customerName,
      apt.customerEmail,
      apt.customerPhone,
      apt.carRegNumber,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/admin" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Bookings Management</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by booking ID, service, vehicle, or status"
            className="input-field"
          />
        </div>
        {filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <p className="text-2xl font-bold mb-4">No bookings yet</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">ID</th>
                  <th className="px-6 py-3 text-left font-semibold">Service</th>
                  <th className="px-6 py-3 text-left font-semibold">Vehicle</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <motion.tr
                    key={apt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm">{apt.id.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{apt.serviceType}</td>
                    <td className="px-6 py-4 text-sm">{apt.vehicleName || apt.vehicleId}</td>
                    <td className="px-6 py-4 text-sm">
                      {apt.appointmentDate
                        ? new Date(apt.appointmentDate).toLocaleDateString()
                        : "Not scheduled"}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === apt.id ? (
                        <select
                          value={editData.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="input-field text-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      )}
                      <p className="mt-2 text-xs text-slate-500">
                        {apt.verifiedByAdmin ? "Approved by admin" : "Waiting for approval"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingId === apt.id ? (
                        <div className="space-y-3 min-w-[240px]">
                          <RepairProgress currentStage="Pending" />
                          <div className="grid gap-2">
                            <input
                              type="date"
                              value={editData.appointmentDate || ""}
                              onChange={(e) => setEditData({ ...editData, appointmentDate: e.target.value })}
                              className="input-field text-xs"
                            />
                            <input
                              type="time"
                              value={editData.appointmentTime || ""}
                              onChange={(e) => setEditData({ ...editData, appointmentTime: e.target.value })}
                              className="input-field text-xs"
                            />
                          </div>
                          <VehicleVisual
                            image={editData.vehicleImage}
                            label={editData.vehicleName || editData.vehicleId}
                            className="h-28"
                          />
                          <label className="block text-xs font-semibold text-slate-500">
                            Upload actual workshop image
                            <input
                              type="file"
                              accept="image/*"
                              className="input-field text-xs mt-1"
                              onChange={handleVehicleImageUpload}
                            />
                          </label>
                          <div className="flex gap-2">
                            <button
                              onClick={handleStatusChange}
                              className="btn-primary text-xs py-1 px-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditData(null);
                              }}
                              className="btn-secondary text-xs py-1 px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <RepairProgress currentStage="Pending" />
                          <VehicleVisual
                            image={apt.vehicleImage}
                            label={apt.vehicleName || apt.vehicleId}
                            className="h-24"
                          />
                          <button
                            onClick={() => {
                              setEditingId(apt.id);
                              setEditData(apt);
                            }}
                            className="btn-ghost text-xs"
                          >
                            Review
                          </button>
                          <div className="flex flex-wrap gap-2">
                            {apt.status === "Pending" ? (
                              <button
                                onClick={() => applyQuickStatus(apt, "Confirmed")}
                                className="btn-primary text-xs py-2 px-3"
                              >
                                Approve booking
                              </button>
                            ) : null}
                            {apt.status === "Confirmed" ? (
                              <button
                                onClick={() => applyQuickStatus(apt, "In Progress")}
                                className="btn-secondary text-xs py-2 px-3"
                              >
                                Start work
                              </button>
                            ) : null}
                            {apt.status === "In Progress" ? (
                              <button
                                onClick={() => applyQuickStatus(apt, "Completed")}
                                className="btn-secondary text-xs py-2 px-3"
                              >
                                Mark complete
                              </button>
                            ) : null}
                            {apt.status !== "Completed" && apt.status !== "Cancelled" ? (
                              <button
                                onClick={() => applyQuickStatus(apt, "Cancelled")}
                                className="text-xs font-semibold text-red-600 hover:text-red-700"
                              >
                                Cancel
                              </button>
                            ) : null}
                          </div>
                          {apt.damageAreas?.length ? (
                            <p className="text-xs text-slate-500">
                              Damage: {apt.damageAreas.join(", ")}
                            </p>
                          ) : null}
                          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                            <p><span className="font-semibold">Customer:</span> {apt.customerName || "Not added"}</p>
                            <p><span className="font-semibold">Email:</span> {apt.customerEmail || "Not added"}</p>
                            <p><span className="font-semibold">Phone:</span> {apt.customerPhone || "Not added"}</p>
                            <p><span className="font-semibold">Brought in by:</span> {apt.broughtInBy || "Customer"}</p>
                            <p><span className="font-semibold">Brought in by phone:</span> {apt.broughtInByPhone || "Not added"}</p>
                            <p><span className="font-semibold">Reg number:</span> {apt.carRegNumber || apt.vehicleId}</p>
                            <p><span className="font-semibold">VIN:</span> {apt.vinNumber || "Not added"}</p>
                            <p><span className="font-semibold">Car type:</span> {apt.carType || "Not added"}</p>
                            <p><span className="font-semibold">Car model:</span> {apt.carModel || apt.vehicleName || "Not added"}</p>
                            <p><span className="font-semibold">Car color:</span> {apt.carColor || "Not added"}</p>
                          </div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
