import express from "express";
import { requireFirebaseAuth } from "../middlewares/FirebaseAuth.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { login, getMe , getMeByToken } from "../controllers/auth.controller.js";

const router = express.Router();

/* ======================
   AUTH ROUTES
====================== */
router.post("/login", login);
router.get("/me-token", requireFirebaseAuth, getMeByToken);  //Auth route cho Bệnh nhận 
router.get("/me", requireAuth, getMe);  //Auth route cho staff (Admin , Doctor , Reception)

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("helios.sid");
    res.json({ ok: true });
  });
});

export default router;
