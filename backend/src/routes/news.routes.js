import express from "express";
import { createNews , getAllNews , getNewsDetail} from "../controllers/news.controller.js";

const router = express.Router();

/* ADMIN */
router.post("/", createNews);
router.get("/", getAllNews);
router.get("/:slug", getNewsDetail);

export default router;
