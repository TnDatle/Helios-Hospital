import express from "express";
import { getDepartments } from "../controllers/department-controller.js";
import { noCache } from "../middlewares/no-cache.js";
const router = express.Router();

// GET /api/departments
router.get("/",noCache ,getDepartments);

export default router;
