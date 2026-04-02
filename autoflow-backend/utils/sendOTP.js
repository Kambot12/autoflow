import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPEmail = async (otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.JWT_SECRET, // can also use app password
    },
  });

  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "Your Admin OTP",
    text: `Your OTP is: ${otp}`,
  });
};