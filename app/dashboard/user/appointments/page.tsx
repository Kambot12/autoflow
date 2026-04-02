"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { downloadBookingReceipt } from "@/lib/receipts";
import { VehicleVisual } from "@/components/vehicle-visual";
import { RepairProgress } from "@/components/repair-progress";
import { fetchServerAppointments, syncServerAppointments, updateServerAppointment } from "@/lib/server-data";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      const user = storage.getUser();
      const localAppointments = storage.getAppointments();
      setAppointments(localAppointments.filter((apt: any) => apt.userId === user?.id));
      try {
        await syncServerAppointments(localAppointments);
        const serverAppointments = await fetchServerAppointments();
        storage.setAppointments(serverAppointments);
        setAppointments(serverAppointments.filter((apt: any) => apt.userId === user?.id));
      } catch (error) {
        console.error(error);
      }
    };

    loadAppointments();
  }, []);

  const handleCancel = async (appointmentId: string) => {
    const updated = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt
    );
    setAppointments(updated);
    const allAppointments = storage.getAppointments().map((apt: any) =>
      apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt
    );
    storage.setAppointments(allAppointments);
    try {
      await updateServerAppointment(appointmentId, { status: "Cancelled" });
    } catch (error) {
      console.error(error);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/user" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">My Appointments</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <p className="text-2xl font-bold mb-4">No appointments yet</p>
            <p className="text-gray-600 mb-6">Book your first service today</p>
            <Link href="/dashboard/user/book-service" className="btn-primary inline-block">
              Book a Service
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt, idx) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6"
              >
                <RepairProgress currentStage="Pending" />
                <VehicleVisual
                  image={apt.vehicleImage}
                  label={apt.vehicleName || apt.vehicleId}
                  className="mb-4"
                />
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{apt.serviceType}</h3>
                    <p className="text-gray-600">ID: {apt.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-semibold">
                      {apt.appointmentDate
                        ? new Date(apt.appointmentDate).toLocaleDateString()
                        : "Admin will schedule"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-semibold">{apt.appointmentTime || "Pending"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booked</p>
                    <p className="font-semibold">{new Date(apt.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{apt.description}</p>
                <div className="mb-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                  <p><span className="font-semibold">Customer email:</span> {apt.customerEmail || "Not added"}</p>
                  <p><span className="font-semibold">Phone / WhatsApp:</span> {apt.customerPhone || "Not added"}</p>
                  <p><span className="font-semibold">Vehicle brought in by:</span> {apt.broughtInBy || "Customer"}</p>
                  <p><span className="font-semibold">Reg number:</span> {apt.carRegNumber || "Not added"}</p>
                  <p><span className="font-semibold">VIN:</span> {apt.vinNumber || "Not added"}</p>
                </div>
                {apt.damageAreas?.length ? (
                  <p className="text-sm text-slate-500 mb-4">
                    Damage focus: {apt.damageAreas.join(", ")}
                  </p>
                ) : null}
                <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  {apt.verifiedByAdmin
                    ? "Admin has reviewed and verified this booking."
                    : "Awaiting admin verification."}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => downloadBookingReceipt(apt)}
                    className="btn-secondary text-sm"
                  >
                    Download Booking Receipt
                  </button>
                  {apt.status === "Pending" && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
