import { admin, db } from "../config/firebase.js";

/* ======================
   VERIFY + LOAD USER
====================== */
export const verifyAndLoadUser = async (idToken) => {
  const decoded = await admin.auth().verifyIdToken(idToken);

  const userSnap = await db.collection("Users").doc(decoded.uid).get();
  if (!userSnap.exists) {
    throw new Error("USER_NOT_FOUND");
  }

  return {
    uid: decoded.uid,
    email: decoded.email,
    ...userSnap.data(),
  };
};

/* ======================
   HYDRATE AUTH USER
====================== */
export const hydrateAuthUser = async (user) => {
  if (user.role === "DOCTOR" && user.doctorId) {
    const doctorSnap = await db
      .collection("Doctor")
      .doc(user.doctorId)
      .get();
    if (doctorSnap.exists) {
      const doctor = doctorSnap.data();
      user.name = doctor.name || doctor.fullName;
    }
  }
  return user;
};


export const getUserByUid = async (uid) => {
  const snap = await db.collection("Users").doc(uid).get();
  if (!snap.exists) return null;
  return snap.data();
};
