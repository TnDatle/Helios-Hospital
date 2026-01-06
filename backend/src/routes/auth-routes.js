import express from "express";
import { getMe } from "../controllers/auth-controller.js";
import { requireAuth } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);

export default router;
