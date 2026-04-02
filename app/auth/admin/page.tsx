"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { persistSession } from "@/lib/auth";
import { ADMIN_EMAIL, ensureAdminUser } from "@/lib/app-data";

const maskEmail = (email: string) =>
  email.replace(/^(.{3}).*(@.*)$/, "$1***$2");

export default function AdminAccessPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "change">("login");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginWithPassword = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login-password",
          email: ADMIN_EMAIL,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid admin password");
      }

      const admin = ensureAdminUser();
      persistSession(admin, data.token);
      toast.success("Admin login successful");
      router.replace("/dashboard/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request-password-change-otp",
          email: ADMIN_EMAIL,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to send OTP");
      }
      setOtpSent(true);
      toast.success("OTP sent to admin email");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-password",
          email: ADMIN_EMAIL,
          otp,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to change password");
      }
      toast.success("Admin password changed");
      setMode("login");
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
      setPassword("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fee2e2,transparent_35%),linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[28px] border border-red-100 bg-white/90 backdrop-blur-xl p-8 shadow-[0_25px_80px_rgba(220,38,38,0.12)]"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500 mb-4">
          Admin Access
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Secure admin sign-in
        </h1>
        <p className="text-slate-600 mb-8">
          Use the private admin password to sign in. Changing it requires OTP sent to the private inbox.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
            Verified inbox
          </p>
          <input
            value={maskEmail(ADMIN_EMAIL)}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700"
          />
        </div>

        <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("change")}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${
              mode === "change" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Change password
          </button>
        </div>

        {mode === "login" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Admin password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="input-field"
              />
            </div>

            <button
              onClick={loginWithPassword}
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 text-white py-3 font-semibold shadow-lg shadow-slate-950/10 inline-flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Please wait..." : "Login with password"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {!otpSent ? (
              <button
                onClick={requestPasswordOtp}
                disabled={loading}
                className="w-full rounded-xl bg-slate-950 text-white py-3 font-semibold shadow-lg shadow-slate-950/10 inline-flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Please wait..." : "Send OTP to email"}
              </button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit code"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="input-field"
                  />
                </div>
                <button
                  onClick={changePassword}
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-950 text-white py-3 font-semibold shadow-lg shadow-slate-950/10 inline-flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? "Please wait..." : "Change password"}
                </button>
              </>
            )}
          </div>
        )}

        <div className="mt-5 text-center text-sm">
          <Link href="/auth/login" className="text-red-600 hover:underline">
            Back to user login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
