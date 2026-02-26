import express from "express";
import {
  createPatient,
  searchPatient
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/search", searchPatient);

export default router;