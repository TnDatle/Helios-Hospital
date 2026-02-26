import express from "express";
import {
  createPatient,
  searchPatient
} from "../controllers/patient.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",verifyToken ,createPatient);
router.get("/search", searchPatient);

export default router;