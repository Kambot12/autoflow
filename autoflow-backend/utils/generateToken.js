import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: "7d",
  });
};
