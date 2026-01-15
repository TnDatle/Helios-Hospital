import { admin } from "../config/firebase.js";

export const requireFirebaseAuth = async (req, res, next) => {
  console.log("FirebaseAuth middleware hit");

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    console.warn("FirebaseAuth: missing Bearer token");
    return res.status(401).json({ message: "NO_TOKEN" });
  }

  try {
    const idToken = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    console.log("FirebaseAuth OK, uid:", decoded.uid);

    req.firebaseUser = decoded;
    next();
  } catch (err) {
    console.error(" FirebaseAuth invalid token:", err.message);
    return res.status(401).json({ message: "INVALID_TOKEN" });
  }
};
