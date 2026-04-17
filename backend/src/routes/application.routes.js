// routes/application.route.js
import express from "express";
import { createApplication } from "../controllers/application.controller.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/", upload.single("cv"), createApplication);

export default router;