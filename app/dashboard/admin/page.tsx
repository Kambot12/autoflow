"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CarFront, ClipboardCheck, LogOut, MessageSquare, ShoppingBag, Users, Wrench } from "lucide-react";
import toast from "react-hot-toast";
import { getCurrentUser } from "@/lib/app-data";
import { getListings, getMessages } from "@/lib/app-data";
import { brand } from "@/lib/brand";
import { NotificationCenter } from "@/components/notification-center";
import { storage } from "@/lib/storage";
import { ADMIN_USER_ID } from "@/lib/app-data";
import { fetchServerAppointments, syncServerAppointments } from "@/lib/server-data";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const syncDashboard = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.role !== "admin") {
        window.location.href = "/auth/admin";
        return;
      }
      const localAppointments = storage.getAppointments();
      setAppointments(localAppointments);
      setRepairs(storage.getRepairs());
      setListings(getListings());
      setMessages(getMessages());
      try {
        await syncServerAppointments(localAppointments);
        const serverAppointments = await fetchServerAppointments();
        setAppointments(serverAppointments);
        storage.setAppointments(serverAppointments);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    syncDashboard();

    const onStorage = () => {
      void syncDashboard();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const stats = useMemo(
    () => [
      { label: "Pending bookings", value: appointments.filter((entry) => entry.status === "Pending").length, icon: ClipboardCheck },
      { label: "Active repairs", value: repairs.filter((entry) => entry.status !== "Completed").length, icon: Wrench },
      { label: "Pending listings", value: listings.filter((entry) => entry.status === "pending").length, icon: ShoppingBag },
      { label: "Unread messages", value: messages.filter((entry) => entry.recipientId === "admin-autoflow" && !entry.read).length, icon: MessageSquare },
    ],
    [appointments, repairs, listings, messages]
  );

  const handleLogout = () => {
    storage.clearUser();
    window.location.href = "/";
  };

  const managementLinks = [
    { href: "/dashboard/admin/bookings", label: "Review bookings", icon: ClipboardCheck },
    { href: "/dashboard/admin/repairs", label: "Manage repairs", icon: Wrench },
    { href: "/dashboard/admin/marketplace", label: "Marketplace approvals", icon: ShoppingBag },
    { href: "/dashboard/admin/messages", label: "Customer inbox", icon: MessageSquare },
    { href: "/dashboard/admin/customers", label: "Customer records", icon: Users },
    { href: "/dashboard/admin/fleet", label: "Fleet management", icon: CarFront },
  ];

  const alerts = [
    {
      label: "Pending booking approvals",
      count: appointments.filter((entry) => entry.status === "Pending").length,
      href: "/dashboard/admin/bookings",
      action: "Open approval queue",
    },
    {
      label: "Listings waiting review",
      count: listings.filter((entry) => entry.status === "pending").length,
      href: "/dashboard/admin/marketplace",
      action: "Review marketplace",
    },
    {
      label: "Unread customer messages",
      count: messages.filter((entry) => entry.recipientId === "admin-autoflow" && !entry.read).length,
      href: "/dashboard/admin/messages",
      action: "Reply now",
    },
  ];

  return (
    <div className="admin-shell min-h-screen">
      <header className="admin-header border-b backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-red-500 font-semibold">Admin Control</p>
            <h1 className="text-2xl font-bold">{brand.operationsName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter recipientId={ADMIN_USER_ID} />
            <button onClick={handleLogout} className="flex items-center gap-2 text-[color:var(--muted)] hover:text-[color:var(--foreground)]">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <section className="grid lg:grid-cols-[1.15fr,0.85fr] gap-8">
            <div className="admin-hero rounded-[32px] p-8 shadow-2xl min-h-[220px] animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="admin-stat rounded-[28px] p-5 min-h-[130px] animate-pulse" />
              ))}
            </div>
          </section>
        ) : null}

        {!loading ? (
          <>
        <section className="grid lg:grid-cols-[1.15fr,0.85fr] gap-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="admin-hero rounded-[32px] p-8 shadow-2xl">
            <h2 className="text-4xl font-bold max-w-2xl">Approve bookings, verify listings, and keep the customer experience tight.</h2>
            <p className="mt-4 text-[color:var(--muted)] max-w-2xl">
              This console stays intentionally minimal so the important actions stand out.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ label, value, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="admin-stat rounded-[28px] p-5"
              >
                <Icon className="w-7 h-7 text-red-500 mb-4" />
                <p className="text-sm text-[color:var(--muted)]">{label}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-8 admin-link-card rounded-[28px] p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-[color:var(--muted)]">Live alert center</p>
              <h3 className="text-2xl font-bold mt-1">Items that need admin attention</h3>
            </div>
            <span className="inline-flex items-center rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
              {alerts.reduce((sum, entry) => sum + entry.count, 0)} open alerts
            </span>
          </div>
          <div className="mt-5 grid md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div key={alert.label} className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
                <p className="text-sm text-[color:var(--muted)]">{alert.label}</p>
                <p className="mt-2 text-3xl font-bold">{alert.count}</p>
                <div className="mt-4 flex gap-3">
                  <Link href={alert.href} className="btn-primary inline-flex items-center">
                    {alert.action}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toast.success(alert.count ? `${alert.count} item(s) need your attention` : "Everything is up to date")}
                    className="btn-secondary"
                  >
                    Alert status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {managementLinks.map(({ href, label, icon: Icon }, index) => (
            <Link key={href} href={href}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.05 }}
                whileHover={{ y: -4 }}
                className="admin-link-card rounded-[28px] p-6 h-full"
              >
                <Icon className="w-8 h-8 text-red-500 mb-4" />
                <p className="text-xl font-semibold">{label}</p>
              </motion.div>
            </Link>
          ))}
        </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
