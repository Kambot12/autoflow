"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { getListings, saveListings, sendSystemAlert } from "@/lib/app-data";

export default function AdminMarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    setListings(getListings());
  }, []);

  const updateStatus = (listingId: string, status: "approved" | "rejected") => {
    const changed = listings.find((listing) => listing.id === listingId);
    const nextListings = listings.map((listing) =>
      listing.id === listingId
        ? {
            ...listing,
            status,
            verified: status === "approved",
          }
        : listing
    );
    setListings(nextListings);
    saveListings(nextListings);
    if (changed) {
      sendSystemAlert({
        recipientId: changed.userId,
        content: `Your marketplace listing "${changed.title}" was ${status} by admin.`,
      });
    }
    toast.success(`Listing ${status}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/admin" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Marketplace approvals</h1>
            <p className="text-sm text-slate-500">Review new listings before they go live.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
        {listings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="card p-5"
          >
            <img src={listing.images?.[0]} alt={listing.title} className="h-56 w-full rounded-3xl object-cover mb-4" />
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">{listing.title}</h2>
              <span className="text-red-600 font-bold">₦{Number(listing.price).toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              {listing.sellerName} • {listing.location}
            </p>
            <p className="text-slate-700 mb-4">{listing.description}</p>
            <div className="flex gap-3">
              <button onClick={() => updateStatus(listing.id, "approved")} className="btn-primary">
                <Check className="inline mr-2 w-4 h-4" />
                Approve
              </button>
              <button onClick={() => updateStatus(listing.id, "rejected")} className="btn-secondary">
                <X className="inline mr-2 w-4 h-4" />
                Reject
              </button>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
