"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Car,
  LogOut,
  MessageSquare,
  ShoppingBag,
  Sparkles,
  UserCircle2,
  Wrench,
} from "lucide-react";
import { getCurrentUser, getListings, getNotificationsForUser, getVehiclesForUser } from "@/lib/app-data";
import { brand } from "@/lib/brand";
import { NotificationCenter } from "@/components/notification-center";
import { storage } from "@/lib/storage";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const syncDashboard = () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        window.location.href = "/auth/login";
        return;
      }
      setUser(currentUser);
      setAppointments(storage.getAppointments().filter((entry: any) => entry.userId === currentUser.id));
      setRepairs(storage.getRepairs().filter((entry: any) => entry.userId === currentUser.id));
      setNotifications(getNotificationsForUser(currentUser.id));
      setVehicles(getVehiclesForUser(currentUser.id));
      setListings(getListings().filter((entry) => entry.userId === currentUser.id));
      setLoading(false);
    };

    syncDashboard();
    const onStorage = () => syncDashboard();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const stats = useMemo(
    () => [
      { label: "Bookings", value: appointments.length, accent: "from-red-500 to-orange-500" },
      { label: "Repairs", value: repairs.length, accent: "from-blue-500 to-cyan-500" },
      { label: "Alerts", value: notifications.filter((entry) => !entry.read).length, accent: "from-slate-900 to-slate-700" },
      { label: "Listings", value: listings.length, accent: "from-emerald-500 to-teal-500" },
    ],
    [appointments.length, notifications, repairs.length, listings.length]
  );

  const handleLogout = () => {
    storage.clearUser();
    window.location.href = "/";
  };

  const quickActions = [
    { href: "/dashboard/user/book-service", label: "Book service", icon: Calendar },
    { href: "/dashboard/user/repairs", label: "View repair quotes", icon: Wrench },
    { href: "/dashboard/user/profile", label: "Edit profile", icon: UserCircle2 },
    { href: "/dashboard/user/messages", label: "Message admin", icon: MessageSquare },
    { href: "/dashboard/user/marketplace", label: "Marketplace", icon: ShoppingBag },
  ];

  const alerts = useMemo(
    () => {
      return notifications.slice(0, 4);
    },
    [notifications]
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fee2e2,transparent_18%),radial-gradient(circle_at_top_right,#dbeafe,transparent_22%),#f8fafc]">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-red-500 font-semibold">{brand.name}</p>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            {user ? <NotificationCenter recipientId={user.id} /> : null}
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-slate-900">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-8">
            <div className="rounded-[32px] bg-slate-200/70 h-[220px] animate-pulse" />
            <div className="grid lg:grid-cols-[1.3fr,0.7fr] gap-8">
              <div className="card p-8 min-h-[280px] animate-pulse" />
              <div className="card p-8 min-h-[280px] animate-pulse" />
            </div>
          </div>
        ) : null}

        {!loading ? (
          <>
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] bg-slate-950 text-white p-8 shadow-2xl shadow-slate-300/40">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
                <Sparkles className="w-4 h-4" />
                Premium garage experience
              </p>
              <h2 className="mt-5 text-4xl font-bold max-w-2xl">
                Track approvals, service jobs, and marketplace activity from one clean dashboard.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className={`rounded-3xl bg-gradient-to-br ${stat.accent} px-5 py-4 min-w-36`}>
                  <p className="text-sm text-white/80">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="mt-8 card p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-slate-500">Alerts</p>
              <h3 className="text-2xl font-bold mt-1">Recent updates from {brand.shortName}</h3>
            </div>
            <Link href="/dashboard/user/messages" className="btn-primary">
              Open messages
            </Link>
          </div>
          <div className="mt-5 grid gap-4">
            {alerts.length ? (
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-slate-900">
                  {alert.title}
                    </p>
                    <span className="text-xs text-slate-500">
                      {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600">{alert.content}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 p-5 text-slate-500">
                No fresh alerts yet. Booking, repair, and marketplace updates will show here.
              </div>
            )}
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.3fr,0.7fr] gap-8 mt-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card p-8">
            <h3 className="text-xl font-bold mb-4">Quick actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {quickActions.map(({ href, label, icon: Icon }, index) => (
                <Link key={href} href={href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.12 + index * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 h-full"
                  >
                    <Icon className="w-8 h-8 text-red-500 mb-4" />
                    <p className="font-semibold text-lg">{label}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="card p-8">
            <h3 className="text-xl font-bold mb-4">At a glance</h3>
            <div className="space-y-4">
              <div className="rounded-3xl bg-red-50 p-4">
                <p className="text-sm text-slate-500">Vehicles on file</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{vehicles.length}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                  <Car className="w-4 h-4" />
                  {vehicles[0]?.make ? `${vehicles[0].make} ${vehicles[0].model}` : "No primary car yet"}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Latest booking status</p>
                <p className="text-xl font-bold mt-1">{appointments[0]?.status || "No bookings yet"}</p>
                <p className="text-sm text-slate-500 mt-2">
                  {appointments[0]?.verifiedByAdmin ? `${brand.shortName} confirmed` : `Waiting for ${brand.shortName} review`}
                </p>
              </div>
              <div className="rounded-3xl bg-emerald-50 p-4">
                <p className="text-sm text-slate-500">Marketplace visibility</p>
                <p className="text-xl font-bold mt-1">
                  {listings.filter((entry) => entry.status === "approved").length} approved
                </p>
              </div>
            </div>
          </motion.div>
        </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
