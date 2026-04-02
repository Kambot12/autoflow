import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateToken } from "../utils/generateToken.js";

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image || "",
});

const sendEmailInBackground = (to, subject, text) => {
  Promise.resolve(sendEmail(to, subject, text)).catch((error) => {
    console.error("Background email failed:", error.message);
  });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      verified: true,
    });

    const token = generateToken(user);

    sendEmailInBackground(
      normalizedEmail,
      "Welcome to AutoFlow Pro",
      `Hi ${user.name}, your AutoFlow account is ready. You can now book services, track repairs, and manage your vehicles.`
    );

    return res.status(201).json({
      success: true,
      user: buildUserResponse(user),
      token,
      message: "Signup successful",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.password) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid email or password" });
    }

    const token = generateToken(user);

    sendEmailInBackground(
      normalizedEmail,
      "AutoFlow login alert",
      `Hi ${user.name}, your AutoFlow account just signed in successfully. If this was not you, please reset your password immediately.`
    );

    return res.json({
      success: true,
      user: buildUserResponse(user),
      token,
      message: "Login successful",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const googleAuth = async (req, res) => {
  const { email, name, googleId, image } = req.body;

  if (!email || !name || !googleId) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid Google data" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        name: name.trim(),
        googleId,
        image: image || "",
        role:
          normalizedEmail === process.env.ADMIN_EMAIL?.toLowerCase()
            ? "admin"
            : "user",
        verified: true,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (image && !user.image) {
        user.image = image;
      }
      await user.save();
    }

    const token = generateToken(user);

    sendEmailInBackground(
      normalizedEmail,
      "AutoFlow Google sign-in alert",
      `Hi ${user.name}, your AutoFlow account just signed in with Google successfully.`
    );

    return res.json({
      success: true,
      user: buildUserResponse(user),
      token,
      message: "Google authentication successful",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "Email is required" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendEmail(
      normalizedEmail,
      "Your AutoFlow password reset code",
      `Your OTP is: ${otp}. It expires in 15 minutes.`
    );

    return res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      error: "Email and OTP are required",
    });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, error: "OTP not requested" });
    }

    if (user.otp !== Number(otp) || new Date() > user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP" });
    }

    return res.json({
      success: true,
      message: "OTP verified",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Email, OTP, and new password are required",
    });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, error: "OTP not requested" });
    }

    if (user.otp !== Number(otp) || new Date() > user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    user.verified = true;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
