"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { storage } from "@/lib/storage";

interface CustomerData {
  id: string;
  email: string;
  name: string;
  bookingCount: number;
  repairCount: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Get unique customers from appointments
    const appointments = storage.getAppointments();
    const customerMap = new Map<string, CustomerData>();

    appointments.forEach((apt: any) => {
      if (!customerMap.has(apt.userId)) {
        customerMap.set(apt.userId, {
          id: apt.userId,
          email: `user_${apt.userId}@example.com`,
          name: `Customer ${apt.userId.substring(0, 8)}`,
          bookingCount: 0,
          repairCount: 0,
        });
      }
      const customer = customerMap.get(apt.userId)!;
      customer.bookingCount++;
    });

    // Add repair counts
    const repairs = storage.getRepairs();
    repairs.forEach((repair: any) => {
      if (customerMap.has(repair.userId)) {
        customerMap.get(repair.userId)!.repairCount++;
      }
    });

    setCustomers(Array.from(customerMap.values()));
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.email, customer.id]
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
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers by name, email, or ID"
            className="input-field"
          />
        </div>
        {filteredCustomers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <p className="text-2xl font-bold mb-4">No customers yet</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCustomers.map((customer, idx) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold mb-2">{customer.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{customer.email}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-600 text-xs">Bookings</p>
                    <p className="text-2xl font-bold text-blue-600">{customer.bookingCount}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-gray-600 text-xs">Repairs</p>
                    <p className="text-2xl font-bold text-green-600">{customer.repairCount}</p>
                  </div>
                </div>

                <button className="w-full btn-ghost">View Details</button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
