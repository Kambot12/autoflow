"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getCurrentUser, getListings, saveListings } from "@/lib/app-data";
import { downloadMarketplaceReceipt } from "@/lib/receipts";

export default function UserMarketplacePage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState({
    title: "",
    price: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: "",
    fuel: "",
    location: "",
    description: "",
    faults: "",
    sellerPhone: "",
    images: [] as string[],
  });

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setListings(getListings());
  }, []);

  const approvedListings = useMemo(
    () =>
      listings.filter(
        (listing) =>
          listing.status === "approved" &&
          [
            listing.title,
            listing.make,
            listing.model,
            listing.location,
            listing.description,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [listings, query]
  );

  const myListings = useMemo(
    () => listings.filter((listing) => listing.userId === currentUser?.id),
    [listings, currentUser]
  );

  const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    Promise.all(
      files.slice(0, 4).map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(file);
          })
      )
    ).then((images) => setDraft((current) => ({ ...current, images })));
  };

  const submitListing = () => {
    if (!currentUser || !draft.title || !draft.price || draft.images.length === 0) {
      toast.error("Add title, price, and at least one image");
      return;
    }
    const nextListings = [
      ...listings,
      {
        id: `listing_${Math.random().toString(36).slice(2, 10)}`,
        userId: currentUser.id,
        sellerName: currentUser.name,
        sellerPhone: draft.sellerPhone,
        title: draft.title,
        price: Number(draft.price),
        make: draft.make,
        model: draft.model,
        year: Number(draft.year),
        mileage: Number(draft.mileage || 0),
        fuel: draft.fuel,
        location: draft.location,
        description: draft.description,
        faults: draft.faults,
        images: draft.images,
        verified: false,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ];
    setListings(nextListings);
    saveListings(nextListings);
    setShowForm(false);
    toast.success("Listing submitted for admin approval");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/user" className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
              <p className="text-sm text-slate-500">Browse approved vehicles and list yours for review.</p>
            </div>
          </div>
          <button onClick={() => setShowForm((value) => !value)} className="btn-primary">
            <Plus className="inline mr-2 w-4 h-4" />
            Sell your car
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
            <h2 className="text-2xl font-bold mb-6">Create marketplace listing</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {["title", "make", "model", "fuel", "location", "sellerPhone"].map((field) => (
                <input
                  key={field}
                  value={(draft as any)[field]}
                  onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  className="input-field"
                />
              ))}
              <input
                type="number"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                placeholder="Price"
                className="input-field"
              />
              <input
                type="number"
                value={draft.year}
                onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })}
                placeholder="Year"
                className="input-field"
              />
              <input
                type="number"
                value={draft.mileage}
                onChange={(e) => setDraft({ ...draft, mileage: e.target.value })}
                placeholder="Mileage"
                className="input-field"
              />
            </div>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="input-field mt-4 min-h-24"
              placeholder="Describe condition, papers, and maintenance history"
            />
            <textarea
              value={draft.faults}
              onChange={(e) => setDraft({ ...draft, faults: e.target.value })}
              className="input-field mt-4 min-h-20"
              placeholder="Known faults"
            />
            <label className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 cursor-pointer">
              <Camera className="w-4 h-4" />
              Upload up to 4 photos
              <input type="file" multiple accept="image/*" className="hidden" onChange={onImageUpload} />
            </label>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {draft.images.map((image) => (
                <img key={image} src={image} alt="Car upload preview" className="rounded-2xl h-28 w-full object-cover" />
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              <button onClick={submitListing} className="btn-primary">Submit for approval</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </motion.div>
        )}

        <section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold">Approved listings</h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cars, models, locations, or descriptions"
              className="input-field md:max-w-md"
            />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {approvedListings.map((listing) => (
              <div key={listing.id} className="card overflow-hidden">
                <img src={listing.images?.[0]} alt={listing.title} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">{listing.title}</h3>
                    <span className="text-red-600 font-bold">₦{listing.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{listing.location}</p>
                  <p className="text-sm text-slate-700 line-clamp-3">{listing.description}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => downloadMarketplaceReceipt(listing)}
                      className="btn-secondary text-sm"
                    >
                      Download Invoice
                    </button>
                    <button className="btn-primary text-sm">Contact Seller</button>
                    <button
                      onClick={() => toast("Marketplace payment is coming soon in test mode.")}
                      className="btn-secondary text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">My listings</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {myListings.map((listing) => (
              <div key={listing.id} className="card p-5">
                <img src={listing.images?.[0]} alt={listing.title} className="rounded-2xl h-44 w-full object-cover mb-4" />
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{listing.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    listing.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : listing.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
