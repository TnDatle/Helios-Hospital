import express from "express";
import {
  findDoctors,
  getDoctorDetail,
} from "../controllers/doctor-controller.js";

const router = express.Router();

router.get("/", findDoctors);
router.get("/:department/:id", getDoctorDetail);

export default router;
