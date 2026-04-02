"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CarFront, ShieldCheck, TimerReset, Users } from "lucide-react";
import toast from "react-hot-toast";
import { RepairProgress } from "@/components/repair-progress";
import { brand } from "@/lib/brand";
import { getUsers, sendSystemAlert } from "@/lib/app-data";
import { sendEmailNotification } from "@/lib/notifications";
import {
  fetchServerAppointments,
  fetchServerRepairs,
  fetchServerUsers,
  fetchServerVehicles,
  syncServerAppointments,
  syncServerRepairs,
  syncServerVehicles,
  updateServerVehicle,
} from "@/lib/server-data";
import { storage } from "@/lib/storage";

export default function AdminFleetPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [serviceData, setServiceData] = useState({
    nextServiceDate: "",
    serviceReminderNotes: "",
  });

  useEffect(() => {
    const loadFleet = async () => {
      const localVehicles = storage.getVehicles();
      const localAppointments = storage.getAppointments();
      const localRepairs = storage.getRepairs();
      const localUsers = getUsers().filter((user) => user.role !== "admin");

      setVehicles(localVehicles);
      setAppointments(localAppointments);
      setRepairs(localRepairs);
      setUsers(localUsers);

      try {
        await syncServerVehicles(localVehicles);
        await syncServerAppointments(localAppointments);
        await syncServerRepairs(localRepairs);
        const [serverVehicles, serverUsers, serverRepairs] = await Promise.all([
          fetchServerVehicles(),
          fetchServerUsers(),
          fetchServerRepairs(),
        ]);
        const serverAppointments = await fetchServerAppointments();
        setVehicles(serverVehicles);
        setAppointments(serverAppointments);
        setRepairs(serverRepairs);
        setUsers(serverUsers.filter((user: any) => user.role !== "admin"));
        storage.setVehicles(serverVehicles);
        storage.setAppointments(serverAppointments);
        storage.setRepairs(serverRepairs);
      } catch {
        setVehicles(localVehicles);
        setRepairs(localRepairs);
        setUsers(localUsers);
      }
    };

    loadFleet();
  }, []);

  const stats = useMemo(
    () => ({
      totalVehicles: vehicles.length,
      activeOwners: new Set(vehicles.map((vehicle) => vehicle.userId)).size,
      queuedServices: appointments.filter((entry) => entry.status !== "Completed" && entry.status !== "Cancelled").length,
      verifiedBookings: appointments.filter((entry) => entry.verifiedByAdmin).length,
    }),
    [vehicles, appointments]
  );

  const vehicleRows = useMemo(
    () =>
      vehicles.map((vehicle) => {
        const owner = users.find((user) => user.id === vehicle.userId);
        const serviceCount = appointments.filter((entry) => entry.vehicleId === vehicle.id).length;
        const latestRepair = repairs
          .filter((repair) => repair.vehicleId === vehicle.id)
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          )[0];
        return {
          ...vehicle,
          ownerName: owner?.name || "Unassigned owner",
          ownerPhone: owner?.phone || "No phone added yet",
          serviceCount,
          latestRepair,
        };
      }),
    [vehicles, users, appointments, repairs]
  );

  const filteredVehicleRows = useMemo(
    () =>
      vehicleRows.filter((vehicle) =>
        [
          vehicle.make,
          vehicle.model,
          vehicle.licensePlate,
          vehicle.ownerName,
          vehicle.ownerPhone,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [vehicleRows, query]
  );

  const startVehicleEdit = (vehicle: any) => {
    setEditingVehicleId(vehicle.id);
    setServiceData({
      nextServiceDate: vehicle.nextServiceDate || "",
      serviceReminderNotes: vehicle.serviceReminderNotes || "",
    });
  };

  const saveNextService = async (vehicle: any) => {
    const owner = users.find((user) => user.id === vehicle.userId);
    const nextVehicles = vehicles.map((entry) =>
      entry.id === vehicle.id
        ? {
            ...entry,
            nextServiceDate: serviceData.nextServiceDate,
            serviceReminderNotes: serviceData.serviceReminderNotes,
          }
        : entry
    );

    setVehicles(nextVehicles);
    storage.setVehicles(nextVehicles);
    try {
      const serverVehicle = await updateServerVehicle(vehicle.id, {
        nextServiceDate: serviceData.nextServiceDate,
        serviceReminderNotes: serviceData.serviceReminderNotes,
      });
      const mergedVehicles = nextVehicles.map((entry) =>
        entry.id === vehicle.id ? serverVehicle : entry
      );
      setVehicles(mergedVehicles);
      storage.setVehicles(mergedVehicles);
    } catch (error) {
      console.error(error);
    }

    const readableDate = serviceData.nextServiceDate
      ? new Date(serviceData.nextServiceDate).toLocaleDateString()
      : "not set";

    sendSystemAlert({
      recipientId: vehicle.userId,
      content: `${brand.shortName} scheduled your repair date for ${vehicle.year} ${vehicle.make} ${vehicle.model} on ${readableDate}.`,
    });

    if (owner?.email && serviceData.nextServiceDate) {
      try {
        await sendEmailNotification({
          to: owner.email,
          subject: `${brand.shortName}: repair date scheduled`,
          text: `Hello ${owner.name || "there"}, your repair date for ${vehicle.year} ${vehicle.make} ${vehicle.model} has been scheduled for ${readableDate}. ${serviceData.serviceReminderNotes || "Please keep this date available and contact us if you need to reschedule."}`,
        });
      } catch (error) {
        console.error(error);
      }
    }

    setEditingVehicleId(null);
    toast.success("Repair date scheduled");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_20%),radial-gradient(circle_at_top_right,#fee2e2,transparent_25%),var(--background)] text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/admin" className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Fleet Management</h1>
            <p className="text-sm text-[color:var(--muted)]">
              Review customer vehicles and let the workshop team schedule repair dates after the vehicle details have been submitted.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/90 p-8 shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4">What fleet management means here</h2>
          <p className="text-[color:var(--muted)] max-w-3xl leading-7">
            Fleet management helps the admin team keep an overview of all registered customer vehicles,
            ownership details, and workshop scheduling. Customers only submit their vehicle and contact
            details first. After review, the admin schedules the repair date and sends the update back
            to the customer by dashboard alert and email.
          </p>
        </motion.section>

        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
          {[
            { label: "Registered vehicles", value: stats.totalVehicles, icon: CarFront },
            { label: "Active owners", value: stats.activeOwners, icon: Users },
            { label: "Queued services", value: stats.queuedServices, icon: TimerReset },
            { label: "Admin verified", value: stats.verifiedBookings, icon: ShieldCheck },
          ].map(({ label, value, icon: Icon }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)]/90 p-6 shadow-lg"
            >
              <Icon className="w-8 h-8 text-red-500 mb-4" />
              <p className="text-sm text-[color:var(--muted)]">{label}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-8 rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)]/90 p-6 shadow-xl">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Vehicle overview</h2>
              <p className="text-sm text-[color:var(--muted)]">
                Every row shows the owner, contact number, the latest repair state, and the admin-only repair scheduling tools.
              </p>
            </div>
          </div>
          <div className="mb-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fleet by model, plate, owner, or phone"
              className="input-field"
            />
          </div>

          {filteredVehicleRows.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[color:var(--border)] p-12 text-center text-[color:var(--muted)]">
              No fleet data yet. Once customers add vehicles, they will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-sm text-[color:var(--muted)] border-b border-[color:var(--border)]">
                  <tr>
                    <th className="py-3 pr-4">Vehicle</th>
                    <th className="py-3 pr-4">Plate</th>
                    <th className="py-3 pr-4">Owner</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3 pr-4">Service count</th>
                    <th className="py-3 pr-4">Repair management</th>
                    <th className="py-3 pr-4">Repair date</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicleRows.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-[color:var(--border)]/70">
                      <td className="py-4 pr-4 font-semibold">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </td>
                      <td className="py-4 pr-4">{vehicle.licensePlate}</td>
                      <td className="py-4 pr-4">{vehicle.ownerName}</td>
                      <td className="py-4 pr-4">{users.find((user) => user.id === vehicle.userId)?.email || "No email"}</td>
                      <td className="py-4 pr-4">{vehicle.ownerPhone}</td>
                      <td className="py-4 pr-4">{vehicle.serviceCount}</td>
                      <td className="py-4 pr-4 min-w-[280px]">
                        {vehicle.latestRepair ? (
                          <div className="space-y-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-3">
                              <p className="font-semibold text-slate-900">
                                {vehicle.latestRepair.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Current stage: {vehicle.latestRepair.workflowStage || "Pending"}
                              </p>
                            </div>
                            <RepairProgress
                              currentStage={vehicle.latestRepair.workflowStage || "Pending"}
                            />
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                            No repair file yet for this vehicle.
                          </div>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        {editingVehicleId === vehicle.id ? (
                          <div className="space-y-2 min-w-[240px]">
                            <input
                              type="date"
                              value={serviceData.nextServiceDate}
                              onChange={(e) => setServiceData((current) => ({ ...current, nextServiceDate: e.target.value }))}
                              className="input-field"
                            />
                            <textarea
                              value={serviceData.serviceReminderNotes}
                              onChange={(e) =>
                                setServiceData((current) => ({
                                  ...current,
                                  serviceReminderNotes: e.target.value,
                                }))
                              }
                              className="input-field min-h-[88px]"
                              placeholder="Workshop note to include in the repair schedule email"
                            />
                          </div>
                        ) : vehicle.nextServiceDate ? (
                          <div>
                            <p className="font-semibold">
                              {new Date(vehicle.nextServiceDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-[color:var(--muted)]">
                              {vehicle.serviceReminderNotes || "Routine maintenance follow-up"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[color:var(--muted)]">Not scheduled</span>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        {editingVehicleId === vehicle.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveNextService(vehicle)}
                              className="btn-primary text-sm"
                            >
                              Save repair date
                            </button>
                            <button
                              onClick={() => setEditingVehicleId(null)}
                              className="btn-secondary text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => startVehicleEdit(vehicle)}
                              className="btn-secondary text-sm"
                            >
                              Schedule repair date
                            </button>
                            <Link
                              href={`/dashboard/admin/repairs?vehicleId=${encodeURIComponent(vehicle.id)}`}
                              className="btn-primary text-sm text-center"
                            >
                              Manage repair
                            </Link>
                            <Link
                              href={`/dashboard/admin/repairs/create?vehicleId=${encodeURIComponent(vehicle.id)}&userId=${encodeURIComponent(vehicle.userId)}`}
                              className="text-sm font-semibold text-red-600"
                            >
                              Create repair file
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
