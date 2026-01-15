import { admin, db } from "../config/firebase.js";
export const requireAuth = (req, res, next) => {
  // 🔥 SESSION MODE
  if (!req.session || !req.session.user) {
    console.log("❌ NO SESSION");
    return res.status(401).json({ message: "NO_SESSION" });
  }

  console.log("✅ SESSION USER:", req.session.user);

  req.user = req.session.user;
  next();
};

