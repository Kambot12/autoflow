import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { ADMIN_EMAIL } from "@/lib/app-data";

const otpStore: Record<
  string,
  { otp: string; expiresAt: number; attempts: number; purpose: "change-password" }
> = {};
const envPath = path.join(process.cwd(), "autoflow-backend", ".env");
let transporter: nodemailer.Transporter | null = null;

function readBackendEnv() {
  try {
    const file = fs.readFileSync(envPath, "utf8");
    return file
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .reduce<Record<string, string>>((acc, line) => {
        const [key, ...rest] = line.split("=");
        acc[key.trim()] = rest.join("=").trim();
        return acc;
      }, {});
  } catch {
    return {};
  }
}

function updateBackendEnv(key: string, value: string) {
  const file = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const lines = file ? file.split("\n") : [];
  const nextLine = `${key}=${value}`;
  const existingIndex = lines.findIndex((line) => line.startsWith(`${key}=`));

  if (existingIndex >= 0) {
    lines[existingIndex] = nextLine;
  } else {
    lines.push(nextLine);
  }

  fs.writeFileSync(envPath, lines.join("\n"));
}

function getAdminCredentials() {
  const backendEnv = readBackendEnv();
  return {
    adminEmail: process.env.ADMIN_EMAIL || backendEnv.ADMIN_EMAIL || ADMIN_EMAIL,
    adminEmailPassword:
      process.env.ADMIN_EMAIL_PASSWORD || backendEnv.ADMIN_EMAIL_PASSWORD,
    adminPanelPassword:
      process.env.ADMIN_PANEL_PASSWORD ||
      backendEnv.ADMIN_PANEL_PASSWORD ||
      "123456789",
  };
}

async function sendAdminEmail(to: string, subject: string, text: string) {
  const { adminEmail, adminEmailPassword } = getAdminCredentials();

  if (!adminEmail || !adminEmailPassword) {
    console.log("Admin email credentials missing. Email payload:", {
      to,
      subject,
      text,
    });
    return;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminEmail,
        pass: adminEmailPassword,
      },
    });
  }

  await transporter.sendMail({
    from: adminEmail,
    to,
    subject,
    text,
  });
}

function sendAdminEmailInBackground(to: string, subject: string, text: string) {
  Promise.resolve(sendAdminEmail(to, subject, text)).catch((error) => {
    console.error("Admin email failed:", error?.message || error);
  });
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { action, email, otp, password, newPassword } = await request.json();
    const { adminEmail, adminPanelPassword } = getAdminCredentials();

    if (action === "login-password") {
      if (email !== adminEmail) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      if (!password || password !== adminPanelPassword) {
        return NextResponse.json(
          { error: "Invalid admin password" },
          { status: 400 }
        );
      }

      sendAdminEmailInBackground(
        adminEmail,
        "Admin login alert",
        "Your admin dashboard was accessed successfully. If this was not you, change the password immediately."
      );

      return NextResponse.json({
        success: true,
        token: generateToken(),
        message: "Admin login successful",
      });
    }

    if (action === "request-password-change-otp") {
      if (email !== adminEmail) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      const generatedOtp = generateOTP();
      otpStore[email] = {
        otp: generatedOtp,
        expiresAt: Date.now() + 10 * 60 * 1000,
        attempts: 0,
        purpose: "change-password",
      };

      sendAdminEmailInBackground(
        email,
        "Admin password change OTP",
        `Your OTP is ${generatedOtp}. Use it to change the admin password. It expires in 10 minutes.`
      );

      return NextResponse.json({
        success: true,
        message: "OTP sent for password change",
      });
    }

    if (action === "change-password") {
      const storedData = otpStore[email];

      if (!storedData || storedData.purpose !== "change-password") {
        return NextResponse.json(
          { error: "OTP expired or not found" },
          { status: 400 }
        );
      }

      if (Date.now() > storedData.expiresAt) {
        delete otpStore[email];
        return NextResponse.json({ error: "OTP expired" }, { status: 400 });
      }

      if (storedData.otp !== otp) {
        storedData.attempts += 1;
        if (storedData.attempts > 3) {
          delete otpStore[email];
          return NextResponse.json(
            { error: "Too many attempts. Request a new OTP" },
            { status: 400 }
          );
        }
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      updateBackendEnv("ADMIN_PANEL_PASSWORD", newPassword);
      delete otpStore[email];

      sendAdminEmailInBackground(
        email,
        "Admin password changed",
        "Your admin password was changed successfully. Use the new password for your next login."
      );

      return NextResponse.json({
        success: true,
        message: "Admin password updated successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
