import express from "express";
import {createDepartment, getDepartments , updateDepartment , deleteDepartment } from "../controllers/department.controller.js";
import { noCache } from "../middlewares/no-cache.js";
const router = express.Router();

// GET /api/departments
router.get("/",noCache ,getDepartments);
router.post("/", createDepartment);   
router.put("/:slug", updateDepartment);
router.delete("/:slug", deleteDepartment);
export default router;
