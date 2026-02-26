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

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }

  try {
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;   //  gắn user vào request
    next();
  } catch (error) {
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }
};
