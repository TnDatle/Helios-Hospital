import express from "express";
import { createNews , getAllNews , getNewsDetail , deleteNews} from "../controllers/news.controller.js";

const router = express.Router();

/* ADMIN */
router.post("/", createNews);
router.get("/", getAllNews);
router.get("/:slug", getNewsDetail);
router.delete("/:id", deleteNews);
// router.update("/:id", updateNews);

export default router;
