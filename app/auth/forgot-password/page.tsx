"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { BACKEND_URL } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to send OTP");
      }

      toast.success("OTP sent to your email");
      setStep("reset");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to reset password");
      }

      toast.success("Password updated. Please log in.");
      router.push("/auth/login");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 text-gray-900 shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
        <p className="text-gray-600 mb-6">
          {step === "request"
            ? "Enter the email tied to your account and we will send you an OTP."
            : "Enter the OTP from your email and choose a new password."}
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {step === "reset" && (
            <>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </>
          )}

          <button
            onClick={step === "request" ? requestOtp : resetPassword}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            {loading
              ? "Please wait..."
              : step === "request"
              ? "Send OTP"
              : "Reset Password"}
          </button>
        </div>

        <div className="mt-6 text-sm text-center">
          <Link href="/auth/login" className="text-red-600 hover:underline">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
