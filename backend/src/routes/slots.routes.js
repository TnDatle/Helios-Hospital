import express from "express";
import { getTodaySlots } from "../controllers/slots.controller.js";

const router = express.Router();

router.get("/today", getTodaySlots);

export default router;