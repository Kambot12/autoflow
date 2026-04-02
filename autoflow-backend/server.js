import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";
import "./config/passport.js";

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "autoflow-session",
    keys: [process.env.JWT_SECRET || "autoflow-dev-key"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/payment", paymentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Backend running", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
