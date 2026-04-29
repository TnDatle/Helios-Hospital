// routes/application.route.js
import express from "express";
import { createApplication ,getApplications, updateStatus  } from "../controllers/application.controller.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/", upload.single("cv"), createApplication);
router.get("/", getApplications);
router.put("/:id", updateStatus);
export default router;