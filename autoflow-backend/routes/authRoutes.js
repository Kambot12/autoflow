import express from "express";
import passport from "passport";
import {
  forgotPassword,
  googleAuth,
  login,
  resetPassword,
  signup,
  verifyOTP,
} from "../controllers/authController.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/auth/login?error=google_auth_failed`,
    session: false,
  }),
  (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const token = generateToken(req.user);
    const userPayload = encodeURIComponent(
      JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        image: req.user.image || "",
      })
    );

    res.redirect(
      `${frontendUrl}/oauth-success?token=${encodeURIComponent(
        token
      )}&user=${userPayload}`
    );
  }
);

export default router;
