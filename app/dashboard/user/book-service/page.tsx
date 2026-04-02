"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { carMakes, carModels, serviceTypes } from "@/lib/constants";
import {
  ADMIN_USER_ID,
  getCurrentUser,
  getVehiclesForUser,
  saveVehicleForUser,
  sendNotification,
} from "@/lib/app-data";
import { createServerAppointment, syncServerAppointments } from "@/lib/server-data";
import { storage } from "@/lib/storage";

const damageOptions = [
  "Front bumper",
  "Bonnet",
  "Windshield",
  "Rear bumper",
  "Driver side",
  "Passenger side",
  "Engine bay",
];

export default function BookServicePage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    customerPhone: "",
    broughtInBy: "",
    broughtInByPhone: "",
    serviceType: "",
    description: "",
    vehicleOption: "existing",
    vehicleId: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    vinNumber: "",
    carType: "",
    color: "",
    damageAreas: [] as string[],
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = "/auth/login";
      return;
    }
    const currentVehicles = getVehiclesForUser(currentUser.id);
    const params = new URLSearchParams(window.location.search);
    setVehicles(currentVehicles);
    setFormData((current) => ({
      ...current,
      customerName: currentUser.name || current.customerName,
      customerEmail: currentUser.email || current.customerEmail,
      customerPhone: currentUser.phone || current.customerPhone,
      vehicleOption: currentVehicles.length ? "existing" : "new",
      vehicleId: currentVehicles[0]?.id || "",
      serviceType: params.get("serviceType") || current.serviceType,
      description: params.get("description") || current.description,
    }));
  }, []);

  const toggleDamageArea = (area: string) => {
    setFormData((current) => ({
      ...current,
      damageAreas: current.damageAreas.includes(area)
        ? current.damageAreas.filter((item) => item !== area)
        : [...current.damageAreas, area],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.serviceType ||
      !formData.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    let vehicleId = formData.vehicleId;
    let vehicleName = "";
    let appointmentRegNumber = formData.licensePlate;
    let appointmentColor = formData.color;
    let appointmentCarType = formData.carType;
    let appointmentCarModel = formData.model;

    if (formData.vehicleOption === "new") {
      if (!formData.make || !formData.model || !formData.licensePlate) {
        toast.error("Add full vehicle details");
        setLoading(false);
        return;
      }
      const newVehicle = {
        id: `vehicle_${Math.random().toString(36).slice(2, 10)}`,
        userId: user.id,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        licensePlate: formData.licensePlate,
        color: formData.color,
        serviceHistory: [],
        createdAt: new Date().toISOString(),
      };
      saveVehicleForUser(newVehicle);
      vehicleId = newVehicle.id;
      vehicleName = `${newVehicle.year} ${newVehicle.make} ${newVehicle.model}`;
      appointmentRegNumber = newVehicle.licensePlate;
      appointmentColor = newVehicle.color;
      appointmentCarType = formData.carType || newVehicle.make;
      appointmentCarModel = newVehicle.model;
    } else {
      const vehicle = vehicles.find((entry) => entry.id === formData.vehicleId);
      vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "";
      appointmentRegNumber = formData.licensePlate || vehicle?.licensePlate || "";
      appointmentColor = formData.color || vehicle?.color || "";
      appointmentCarType = formData.carType || vehicle?.make || "";
      appointmentCarModel = formData.model || vehicle?.model || "";
    }

    const appointments = storage.getAppointments();
    const appointment = {
      id: `apt_${Math.random().toString(36).slice(2, 10)}`,
      userId: user.id,
      vehicleId,
      vehicleName,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      broughtInBy: formData.broughtInBy,
      broughtInByPhone: formData.broughtInByPhone,
      carRegNumber: appointmentRegNumber,
      vinNumber: formData.vinNumber,
      carType: appointmentCarType || formData.make,
      carModel: appointmentCarModel,
      carColor: appointmentColor,
      serviceType: formData.serviceType,
      description: formData.description,
      damageAreas: formData.damageAreas,
      bookingDate: new Date().toISOString(),
      appointmentDate: "",
      appointmentTime: "",
      status: "Pending",
      verifiedByAdmin: false,
      notes: "",
      createdAt: new Date().toISOString(),
    };
    const nextAppointments = [...appointments, appointment];
    storage.setAppointments(nextAppointments);
    try {
      await syncServerAppointments(appointments);
      const serverAppointment = await createServerAppointment(appointment);
      storage.setAppointments([
        ...appointments.filter((entry: any) => entry.id !== serverAppointment.id),
        serverAppointment,
      ]);
    } catch (error) {
      console.error(error);
    }
    sendNotification({
      recipientId: ADMIN_USER_ID,
      title: "New booking request",
      content: `${user.name} submitted a ${formData.serviceType} booking with full vehicle intake details.`,
      category: "booking",
    });
    toast.success("Booking submitted. Admin will schedule your repair date.");
    window.setTimeout(() => {
      window.location.href = "/dashboard/user/appointments";
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fee2e2,transparent_25%),#f8fafc]">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/user" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Book a Service</h1>
            <p className="text-sm text-slate-500">
              Submit your intake details first. The workshop admin will schedule the repair date after review.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name *</label>
                    <input
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <input
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone / WhatsApp *</label>
                    <input
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Vehicle brought in by</label>
                    <input
                      value={formData.broughtInBy}
                      onChange={(e) => setFormData({ ...formData, broughtInBy: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Vehicle brought in by phone number</label>
                    <input
                      value={formData.broughtInByPhone}
                      onChange={(e) => setFormData({ ...formData, broughtInByPhone: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Repair Type *</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select service</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Describe the issue *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-36"
                    placeholder="Noise, warning lights, rough idle, overheating..."
                  />
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  The admin will set the workshop date and time for vehicle drop-off after reviewing this request.
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 mb-4">
                  Intake notes
                </p>
                <div className="relative mx-auto h-72 max-w-xs rounded-[32px] bg-gradient-to-b from-slate-900 to-slate-700 p-6 text-white shadow-2xl">
                  <div className="absolute inset-x-10 top-8 h-14 rounded-[40px] border border-white/20 bg-white/10" />
                  <div className="absolute inset-x-6 top-20 h-28 rounded-[26px] border border-white/20 bg-white/5" />
                  <div className="absolute inset-x-12 bottom-10 h-20 rounded-[18px] border border-white/20 bg-white/5" />
                  <div className="absolute left-3 top-24 h-20 w-6 rounded-full border border-white/20 bg-white/10" />
                  <div className="absolute right-3 top-24 h-20 w-6 rounded-full border border-white/20 bg-white/10" />
                  <div className="absolute bottom-4 left-10 h-10 w-12 rounded-full border border-white/20 bg-black/30" />
                  <div className="absolute bottom-4 right-10 h-10 w-12 rounded-full border border-white/20 bg-black/30" />
                  <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-2 p-6">
                    {damageOptions.map((area) => (
                      <button
                        type="button"
                        key={area}
                        onClick={() => toggleDamageArea(area)}
                        className={`rounded-full px-3 py-2 text-xs font-semibold backdrop-blur transition-all ${
                          formData.damageAreas.includes(area)
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                            : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 p-6">
              <p className="font-semibold mb-4">Vehicle details</p>
              <div className="flex gap-4 mb-5">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="existing"
                    checked={formData.vehicleOption === "existing"}
                    onChange={(e) => setFormData({ ...formData, vehicleOption: e.target.value })}
                  />
                  Existing vehicle
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="new"
                    checked={formData.vehicleOption === "new"}
                    onChange={(e) => setFormData({ ...formData, vehicleOption: e.target.value })}
                  />
                  Add new vehicle
                </label>
              </div>

              {formData.vehicleOption === "existing" && vehicles.length > 0 ? (
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="input-field"
                >
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value, model: "" })}
                    className="input-field"
                  >
                    <option value="">Select make</option>
                    {carMakes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select model</option>
                    {(carModels[formData.make] || []).map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="input-field"
                    placeholder="Year"
                  />
                  <input
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                    className="input-field"
                    placeholder="Car reg number"
                  />
                  <input
                    value={formData.vinNumber}
                    onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value.toUpperCase() })}
                    className="input-field"
                    placeholder="Car VIN number"
                  />
                  <input
                    value={formData.carType}
                    onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                    className="input-field"
                    placeholder="Car type"
                  />
                  <input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="input-field md:col-span-2"
                    placeholder="Car color"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Submitting..." : "Submit booking"}
              </button>
              <Link href="/dashboard/user/appointments" className="btn-secondary">
                View bookings
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
