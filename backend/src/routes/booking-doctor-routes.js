// booking-doctor-routes.js
import express from "express";
import { findDoctorsForBooking } from "../controllers/booking-doctor-controller.js";
import { noCache } from "../middlewares/no-cache.js";
const router = express.Router();

// GET /api/booking/doctors?departmentId=dep02
router.get("/doctors",noCache ,findDoctorsForBooking);

export default router;
