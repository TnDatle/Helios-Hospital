import { db } from "../config/firebase.js";

export const getMe = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db.collection("Users").doc(uid).get();

    if (!snap.exists) {
      return res.status(403).json({ message: "User not found" });
    }

    res.json({
      uid,
      ...snap.data(), // email, role, status
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
