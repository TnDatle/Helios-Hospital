import { auth, db } from "../config/firebase.js";
import { FieldValue } from "firebase-admin/firestore";

const STAFF_ROLES = ["RECEPTION", "ACCOUNTANT", "ADMIN_STAFF"];

/* =========================
   GET USERS
========================= */
export const getUsersService = async () => {
  const userSnap = await db.collection("Users").get();

  const usersRaw = userSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 1. Lấy tất cả doctorId từ users
  const doctorIds = [
    ...new Set(
      usersRaw
        .filter((u) => u.role === "DOCTOR" && u.doctorId)
        .map((u) => u.doctorId)
    ),
  ];

  // 2. Query tất cả doctors (batch)
  const doctorSnaps = await Promise.all(
    doctorIds.map((id) => db.collection("Doctor").doc(id).get())
  );

  const doctorMap = {};
  const departmentIds = new Set();

  doctorSnaps.forEach((snap) => {
    if (snap.exists) {
      const data = snap.data();
      doctorMap[snap.id] = data;
      if (data.departmentId) {
        departmentIds.add(data.departmentId);
      }
    }
  });

  // 3. Query tất cả departments (batch)
  const depSnaps = await Promise.all(
    [...departmentIds].map((id) =>
      db.collection("Departments").doc(id).get()
    )
  );

  const depMap = {};
  depSnaps.forEach((snap) => {
    if (snap.exists) {
      depMap[snap.id] = snap.data();
    }
  });

  // 4. Build response
  const users = usersRaw.map((user) => {
    let doctorInfo = null;

    if (user.role === "DOCTOR" && user.doctorId) {
      const doctor = doctorMap[user.doctorId];

      if (doctor) {
        const department = depMap[doctor.departmentId];

        doctorInfo = {
          name: doctor.name,
          departmentName: department?.name || "-",
        };
      }
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      doctor: doctorInfo,
      office: user.office || null,
      name: user.name || null,
      isActive: user.isActive ?? true,
      lastLoginAt: user.lastLoginAt
        ? user.lastLoginAt.toDate()
        : null,
    };
  });

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