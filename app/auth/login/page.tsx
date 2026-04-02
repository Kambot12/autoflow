"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { BACKEND_URL, getDashboardRoute, persistSession } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/app-data";
import { brand } from "@/lib/brand";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "google_auth_failed") {
      toast.error("Google login failed. Please try again.");
    }

    const remembered = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("savedEmail") || "";
    if (remembered && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    router.prefetch("/dashboard/user");
    router.prefetch("/dashboard/admin");
    router.prefetch("/auth/signup");
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        persistSession(data.user, data.token);
        localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("savedEmail");
        }
        toast.success("Login successful!");
        router.replace(getDashboardRoute(data.user?.role));
      } else {
        if (cardRef.current) {
          cardRef.current.classList.add("shake");
          window.setTimeout(() => cardRef.current?.classList.remove("shake"), 500);
        }
        toast.error(data.error || data.message || "Invalid credentials");
      }
    } catch {
      toast.error("Unable to reach the server");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-zinc-900">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1610903816217-f4f4ebe7d1dc?auto=format&fit=crop&w=1600&q=80')",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.24),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.20),transparent_30%)]" />

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white/95 shadow-2xl backdrop-blur-lg lg:grid lg:grid-cols-2"
      >
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-8 text-white flex flex-col justify-center">
          <div className="text-5xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="mt-2 opacity-90">{`Login to your ${brand.shortName} account`}</p>

          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
            <p className="font-semibold mb-2">Admin access is private</p>
            <p className="opacity-90 mb-4">
              OTP sign-in is only sent to the secured admin inbox.
            </p>
            <Link
              href="/auth/admin"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Admin Access
            </Link>
            <p className="mt-3 text-xs opacity-80">
              Secure inbox: {ADMIN_EMAIL.replace(/(.{3}).+(@.+)/, "$1***$2")}
            </p>
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mb-4 w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-red-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Remember me
            </label>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 py-3 text-gray-900 hover:border-red-600 disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.6-5.4 3.6-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.5H12Z"/>
                <path fill="#4285F4" d="M3.7 7.6 6.9 10c.8-2.3 2.9-4 5.1-4 1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.4 14.6 2.5 12 2.5c-3.6 0-6.8 2-8.3 5.1Z"/>
                <path fill="#FBBC05" d="M2.6 12c0 1.5.4 2.9 1.1 4.1l3.7-2.8c-.2-.4-.3-.8-.3-1.3 0-.4.1-.9.3-1.3L3.7 7.9C3 9.1 2.6 10.5 2.6 12Z"/>
                <path fill="#34A853" d="M12 21.5c2.5 0 4.7-.8 6.2-2.3l-3-2.4c-.8.6-1.9 1-3.2 1-2.2 0-4.2-1.5-5-3.6l-3.6 2.8c1.5 2.9 4.5 4.5 8.6 4.5Z"/>
              </svg>
              Login with Google
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <Link href="/auth/forgot-password" className="text-red-600 hover:underline">
              Forgot password?
            </Link>
            <Link href="/auth/signup" className="text-gray-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shake {
          animation: shake 0.5s;
        }
        @keyframes shake {
          0% { transform: translateX(0px); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
          100% { transform: translateX(0px); }
        }
      `}</style>
    </div>
  );
}
