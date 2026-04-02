"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getDashboardRoute, persistSession } from "@/lib/auth";
import { brand } from "@/lib/brand";

export default function OAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userParam = params.get("user");

    if (!token || !userParam) {
      toast.error("Authentication failed. Please try again.");
      router.replace("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userParam);
      persistSession(user, token);
      toast.success("Signed in successfully");
      router.replace(getDashboardRoute(user.role));
    } catch {
      toast.error("Unable to complete sign-in.");
      router.replace("/auth/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-8 text-center"
      >
        <div className="text-4xl mb-4">Signing you in...</div>
        <p className="text-white/80">
          {`We are finishing your ${brand.shortName} authentication and sending you to your dashboard.`}
        </p>
      </motion.div>
    </div>
  );
}
