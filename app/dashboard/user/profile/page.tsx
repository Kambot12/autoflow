"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCcw, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { createAvatar, getCurrentUser, getVehiclesForUser, upsertUser } from "@/lib/app-data";
import { storage } from "@/lib/storage";

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    primaryVehicleId: "",
    avatar: "",
  });
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = "/auth/login";
      return;
    }
    setUser(currentUser);
    setVehicles(getVehiclesForUser(currentUser.id));
    setFormData({
      name: currentUser.name || "",
      phone: currentUser.phone || "",
      bio: currentUser.bio || "",
      primaryVehicleId: currentUser.primaryVehicleId || "",
      avatar: currentUser.avatar || currentUser.image || createAvatar(currentUser.name),
    });
  }, []);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, avatar: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    if (!user) return;
    setLoading(true);
    const updated = upsertUser({
      ...user,
      ...formData,
      image: formData.avatar,
      avatar: formData.avatar,
    });
    storage.setUser(updated);
    setUser(updated);
    toast.success("Profile updated");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_25%),radial-gradient(circle_at_top_right,#fee2e2,transparent_25%),#f8fafc]">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/user" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <p className="text-sm text-slate-500">Keep your account sharp and trusted.</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-[320px,1fr] gap-8">
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/60"
        >
          <img
            src={formData.avatar}
            alt="Profile avatar"
            className="w-28 h-28 rounded-3xl object-cover shadow-lg"
          />
          <h2 className="mt-4 text-xl font-bold text-slate-900">{formData.name || "Driver profile"}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>

          <div className="mt-6 space-y-3">
            <label className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer hover:border-red-300 transition-colors">
              <Upload className="w-4 h-4" />
              Upload profile image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <button
              onClick={() =>
                setFormData((current) => ({
                  ...current,
                  avatar: createAvatar(current.name || user?.name || user?.email),
                }))
              }
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-950 text-white px-4 py-3 font-semibold"
            >
              <RefreshCcw className="w-4 h-4" />
              Generate random avatar
            </button>
          </div>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-xl shadow-slate-200/60"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Full name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone number</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="+234..."
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">About you</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input-field min-h-28"
              placeholder="Tell the workshop a little about your driving needs."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">Primary vehicle</label>
            <select
              value={formData.primaryVehicleId}
              onChange={(e) => setFormData({ ...formData, primaryVehicleId: e.target.value })}
              className="input-field"
            >
              <option value="">Select your main car</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 flex gap-4">
            <button onClick={saveProfile} disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save profile"}
            </button>
            <Link href="/dashboard/user/vehicles" className="btn-secondary">
              Manage vehicles
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
