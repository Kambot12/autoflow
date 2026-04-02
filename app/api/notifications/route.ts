import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { brand } from "@/lib/brand";

const envPath = path.join(process.cwd(), "autoflow-backend", ".env");

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

async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: { filename: string; content: string; encoding?: string; contentType?: string }[]
) {
  const backendEnv = readBackendEnv();
  const sender = process.env.ADMIN_EMAIL || backendEnv.ADMIN_EMAIL;
  const password =
    process.env.ADMIN_EMAIL_PASSWORD || backendEnv.ADMIN_EMAIL_PASSWORD;

  if (!sender || !password) {
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: sender,
      pass: password,
    },
  });

  await transporter.sendMail({
    from: `${brand.name} <${sender}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text, html, attachments } = await request.json();

    if (!to || !subject || !text) {
      return NextResponse.json(
        { success: false, error: "to, subject, and text are required" },
        { status: 400 }
      );
    }

    await sendEmail(to, subject, text, html, attachments);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
