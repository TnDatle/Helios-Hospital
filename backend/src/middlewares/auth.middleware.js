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
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "NO_TOKEN" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("VERIFY TOKEN ERROR:", error);
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }
};
