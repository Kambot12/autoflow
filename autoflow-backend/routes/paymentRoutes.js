import express from "express";
import { listPayments, mockPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/mock", mockPayment);
router.get("/", listPayments);

export default router;
