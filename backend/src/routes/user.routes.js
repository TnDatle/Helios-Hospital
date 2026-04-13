import express from "express";
import {getUsers, createUser , toggleUser} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/:id/toggle", toggleUser);

export default router;
