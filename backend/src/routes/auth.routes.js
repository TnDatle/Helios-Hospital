import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { login, getMe } from "../controllers/auth.controller.js";

const router = express.Router();

/* ======================
   AUTH ROUTES
====================== */
router.post("/login", login);
router.get("/me", requireAuth, getMe);

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("helios.sid");
    res.json({ ok: true });
  });
});

export default router;
