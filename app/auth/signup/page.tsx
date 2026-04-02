"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { BACKEND_URL, getDashboardRoute, persistSession } from "@/lib/auth";
import { brand } from "@/lib/brand";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState("Very weak");
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    router.prefetch("/dashboard/user");
    router.prefetch("/auth/login");
  }, [router]);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        persistSession(data.user, data.token);
        toast.success("Signup successful!");
        router.replace(getDashboardRoute(data.user?.role));
      } else {
        if (cardRef.current) {
          cardRef.current.classList.add("shake");
          window.setTimeout(() => cardRef.current?.classList.remove("shake"), 500);
        }
        toast.error(data.error || data.message || "Signup failed");
      }
    } catch {
      toast.error("Unable to reach the server");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const evaluatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    setPasswordStrength(score);

    if (score <= 1) setPasswordStrengthText("Very weak");
    else if (score === 2) setPasswordStrengthText("Weak");
    else if (score === 3) setPasswordStrengthText("Fair");
    else if (score === 4) setPasswordStrengthText("Good");
    else setPasswordStrengthText("Strong");
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-zinc-900">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1470214304380-aadaedcfff47?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.18),transparent_26%)]" />
      <div className="absolute top-16 left-10 h-36 w-36 rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute bottom-16 right-8 h-44 w-44 rounded-full bg-orange-400/10 blur-3xl" />

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid lg:grid-cols-2"
      >
        <div className="bg-red-600 p-8 text-white flex flex-col justify-center">
          <div className="text-5xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold">{`Join ${brand.shortName}`}</h2>
          <p className="mt-2 opacity-90">Create your account</p>
        </div>

        <div className="p-8 flex flex-col justify-center">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field mb-4 w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  evaluatePasswordStrength(e.target.value);
                }}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-red-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="mb-3 rounded-lg border p-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Password strength</span>
                <span className="font-semibold text-slate-800">{passwordStrengthText}</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${
                    passwordStrength >= 4
                      ? "bg-emerald-500"
                      : passwordStrength === 3
                      ? "bg-amber-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 py-3 text-gray-900 hover:border-red-600 disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.6-5.4 3.6-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.5H12Z"/>
                <path fill="#4285F4" d="M3.7 7.6 6.9 10c.8-2.3 2.9-4 5.1-4 1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3.4 14.6 2.5 12 2.5c-3.6 0-6.8 2-8.3 5.1Z"/>
                <path fill="#FBBC05" d="M2.6 12c0 1.5.4 2.9 1.1 4.1l3.7-2.8c-.2-.4-.3-.8-.3-1.3 0-.4.1-.9.3-1.3L3.7 7.9C3 9.1 2.6 10.5 2.6 12Z"/>
                <path fill="#34A853" d="M12 21.5c2.5 0 4.7-.8 6.2-2.3l-3-2.4c-.8.6-1.9 1-3.2 1-2.2 0-4.2-1.5-5-3.6l-3.6 2.8c1.5 2.9 4.5 4.5 8.6 4.5Z"/>
              </svg>
              Sign Up with Google
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <Link href="/auth/login" className="text-red-600 hover:underline">
              Already have an account? Login
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
