import express from "express";
import {createDepartment, getDepartments } from "../controllers/department-controller.js";
import { noCache } from "../middlewares/no-cache.js";
const router = express.Router();

// GET /api/departments
router.get("/",noCache ,getDepartments);
router.post("/", createDepartment);   
// router.put("/:id", updateDepartment);
// router.delete("/:id", deleteDepartment);
export default router;
