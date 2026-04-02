"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { carMakes, carModels } from "@/lib/constants";
import { VehicleVisual } from "@/components/vehicle-visual";

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    color: "",
  });

  useEffect(() => {
    setVehicles(storage.getVehicles());
  }, []);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.licensePlate) {
      return;
    }

    const newVehicle = {
      id: "vehicle_" + Math.random().toString(36).substr(2, 9),
      userId: storage.getUser().id,
      ...formData,
      serviceHistory: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    storage.setVehicles(updated);
    
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      color: "",
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/user" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold">My Vehicles</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Make</label>
                  <select
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value, model: "" })}
                    className="input-field"
                    required
                  >
                    <option value="">Select make</option>
                    {carMakes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Model</label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    disabled={!formData.make}
                    className="input-field disabled:opacity-50"
                    required
                  >
                    <option value="">Select model</option>
                    {formData.make && carModels[formData.make]?.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">License Plate</label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                    placeholder="LSD 123 ABC"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Red, Blue"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 btn-primary">
                  Add Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Vehicles List */}
        {vehicles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <p className="text-2xl font-bold mb-4">No vehicles yet</p>
            <p className="text-gray-600 mb-6">Add your first vehicle to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-block"
            >
              <Plus className="inline mr-2 w-5 h-5" />
              Add Vehicle
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {vehicles.map((vehicle, idx) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100"
              >
                <VehicleVisual
                  image={vehicle.image}
                  label={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="mb-4"
                />
                <div className="mb-4">
                  <h3 className="text-xl font-bold">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-gray-600 font-mono">{vehicle.licensePlate}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-semibold">{vehicle.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services:</span>
                    <span className="font-semibold">{vehicle.serviceHistory?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Workshop image:</span>
                    <span className="font-semibold">{vehicle.image ? "Uploaded" : "Animated placeholder"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Repair date:</span>
                    <span className="font-semibold text-right">
                      {vehicle.nextServiceDate
                        ? new Date(vehicle.nextServiceDate).toLocaleDateString()
                        : "Set by admin after review"}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-gray-600">
                  You only add your vehicle details here. The workshop admin schedules the repair date
                  after reviewing the booking.
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
