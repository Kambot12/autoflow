"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ClipboardList, Mail, Wrench } from "lucide-react";

export default function EstimateRepairPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_18%),radial-gradient(circle_at_top_right,#fee2e2,transparent_20%),#f8fafc]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/user" className="text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Workshop Pricing</h1>
            <p className="text-sm text-slate-500">
              Repair pricing now comes directly from the workshop team.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">
            Updated workflow
          </p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            The smart estimator has been removed.
          </h2>
          <p className="mt-4 text-slate-600 leading-7 max-w-3xl">
            After you book a service, the workshop admin reviews your vehicle, lists the parts to
            be used, adds workmanship details, and sets the official repair price. That same
            pricing breakdown is shown in your repair screen and sent to your email.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-5">
              <ClipboardList className="w-8 h-8 text-red-500 mb-4" />
              <p className="font-semibold text-slate-900">Book your service</p>
              <p className="mt-2 text-sm text-slate-600">
                Submit the fault and your preferred booking time.
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-5">
              <Wrench className="w-8 h-8 text-red-500 mb-4" />
              <p className="font-semibold text-slate-900">Admin prepares quote</p>
              <p className="mt-2 text-sm text-slate-600">
                Parts, workmanship, and workshop pricing are entered by the admin.
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-5">
              <Mail className="w-8 h-8 text-red-500 mb-4" />
              <p className="font-semibold text-slate-900">You get notified</p>
              <p className="mt-2 text-sm text-slate-600">
                The official repair breakdown is sent to your email and dashboard.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard/user/book-service" className="btn-primary">
              Book service
            </Link>
            <Link href="/dashboard/user/repairs" className="btn-secondary">
              View repair quotes
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
