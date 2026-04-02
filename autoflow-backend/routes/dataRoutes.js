import express from "express";
import {
  createAppointment,
  createRepair,
  listAppointments,
  listRepairs,
  listUsers,
  listVehicles,
  syncAppointments,
  syncRepairs,
  updateAppointment,
  syncVehicles,
  updateRepair,
  updateVehicle,
  sendRepairInvoice,
} from "../controllers/dataController.js";

const router = express.Router();

router.get("/users", listUsers);
router.get("/appointments", listAppointments);
router.post("/appointments/sync", syncAppointments);
router.post("/appointments", createAppointment);
router.patch("/appointments/:id", updateAppointment);
router.get("/vehicles", listVehicles);
router.post("/vehicles/sync", syncVehicles);
router.patch("/vehicles/:id", updateVehicle);
router.get("/repairs", listRepairs);
router.post("/repairs/sync", syncRepairs);
router.post("/repairs", createRepair);
router.patch("/repairs/:id", updateRepair);
router.post("/repairs/:id/send-invoice", sendRepairInvoice);

export default router;
