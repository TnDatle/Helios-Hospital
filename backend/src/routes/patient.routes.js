import express from "express";
import {
  createPatient,
  searchPatient
} from "../controllers/patient.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", requireAuth, createPatient);
router.get("/search", requireAuth, searchPatient);

export default router;