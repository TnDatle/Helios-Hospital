import { auth, db } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

const STAFF_ROLES = ["RECEPTION", "ACCOUNTANT", "ADMIN_STAFF"];

/* =========================
   GET USERS
========================= */
export const getUsersService = async () => {
  const userSnap = await db.collection("Users").get();

  const users = await Promise.all(
    userSnap.docs.map(async (userDoc) => {
      const userData = userDoc.data();

      let doctorInfo = null;

      if (userData.role === "DOCTOR" && userData.doctorId) {
        const doctorSnap = await db
          .collection("Doctor")
          .doc(userData.doctorId)
          .get();

        if (doctorSnap.exists) {
          const doctor = doctorSnap.data();

          const depSnap = await db
            .collection("Departments")
            .doc(doctor.departmentId)
            .get();

          doctorInfo = {
            name: doctor.name,
            departmentName: depSnap.exists
              ? depSnap.data().name
              : "-",
          };
        }
      }

      return {
        id: userDoc.id,
        email: userData.email,
        role: userData.role,
        doctor: doctorInfo,
        office: userData.office || null,
        name: userData.name || null,
        isActive: userData.isActive ?? true,
        lastLoginAt: userData.lastLoginAt
          ? userData.lastLoginAt.toDate()
          : null,
      };
    })
  );

  return users;
};

/* =========================
   TOGGLE USER
========================= */
export const toggleUserStatusService = async (userId) => {
  const userRef = db.collection("Users").doc(userId);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new Error("USER_NOT_FOUND");
  }

  const userData = userSnap.data();
  const newStatus = !(userData.isActive ?? true);

  await userRef.update({
    isActive: newStatus,
  });

  // OPTIONAL: sync Firebase Auth
  // await auth.updateUser(userId, { disabled: !newStatus });

  return {
    id: userId,
    isActive: newStatus,
  };
};

/* =========================
   UPDATE LAST LOGIN
========================= */
export const updateLastLoginService = async (userId) => {
  await db.collection("Users").doc(userId).update({
    lastLoginAt: FieldValue.serverTimestamp(),
  });
};

/* =========================
   CREATE USER
========================= */
export const createUserService = async ({
  email,
  role,
  name,
  doctorId,
  office,
}) => {
  if (!email || !role) {
    throw new Error("INVALID_INPUT");
  }

  /* ===== VALIDATE ===== */
  if (role === "DOCTOR") {
    if (!doctorId) throw new Error("DOCTOR_ID_REQUIRED");

    const existed = await db
      .collection("Users")
      .where("doctorId", "==", doctorId)
      .limit(1)
      .get();

    if (!existed.empty) {
      throw new Error("DOCTOR_HAS_ACCOUNT");
    }

    const doctorSnap = await db
      .collection("Doctor")
      .doc(doctorId)
      .get();

    if (!doctorSnap.exists) {
      throw new Error("DOCTOR_NOT_FOUND");
    }
  }

  if (role === "ADMIN" && !name) {
    throw new Error("NAME_REQUIRED");
  }

  if (STAFF_ROLES.includes(role)) {
    if (!name) throw new Error("NAME_REQUIRED");
    if (!office) throw new Error("OFFICE_REQUIRED");
  }

  /* ===== CREATE AUTH ===== */
  let userRecord;
  try {
    userRecord = await auth.createUser({
      email,
      password: "123456",
    });
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      throw new Error("EMAIL_EXISTS");
    }
    throw err;
  }

  /* ===== BUILD DATA ===== */
  const baseData = {
    email,
    role,
    isActive: true,
    lastLoginAt: null,
    createdAt: FieldValue.serverTimestamp(),
  };

  const userData =
    role === "DOCTOR"
      ? {
          ...baseData,
          doctorId,
        }
      : {
          ...baseData,
          name,
          office: STAFF_ROLES.includes(role) ? office : null,
        };

  /* ===== SAVE FIRESTORE ===== */
  await db.collection("Users").doc(userRecord.uid).set(userData);

  return {
    uid: userRecord.uid,
    email,
    role,
  };
};