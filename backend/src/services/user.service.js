import { auth, db } from "../config/firebase.js";

const STAFF_ROLES = ["RECEPTION", "ACCOUNTANT", "ADMIN_STAFF"];



export const getUsersService = async () => {
  const userSnap = await db.collection("Users").get();

  const users = [];

  for (const userDoc of userSnap.docs) {
    const userData = userDoc.data();

    // DEFAULT
    let doctorInfo = null;

    if (userData.role === "DOCTOR" && userData.doctorId) {
      // 1. get Doctor
      const doctorSnap = await db
        .collection("Doctor")
        .doc(userData.doctorId)
        .get();

      if (doctorSnap.exists) {
        const doctor = doctorSnap.data();

        // 2. get Department
        const depSnap = await db
          .collection("Departments")
          .doc(doctor.departmentId)
          .get();

        doctorInfo = {
          name: doctor.name,
          departmentName: depSnap.exists ? depSnap.data().name : "-",
        };
      }
    }

    users.push({
      id: userDoc.id,
      email: userData.email,
      role: userData.role,
      doctor: doctorInfo, 
      office: userData.office || null,
      name: userData.name || null,
    });
  }

  return users;
};


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

  /* ===== DOCTOR ===== */
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

    const doctorSnap = await db.collection("Doctor").doc(doctorId).get();
    if (!doctorSnap.exists) {
      throw new Error("DOCTOR_NOT_FOUND");
    }
  }

  /* ===== ADMIN ===== */
  if (role === "ADMIN" && !name) {
    throw new Error("NAME_REQUIRED");
  }

  /* ===== STAFF ROLES ===== */
  if (STAFF_ROLES.includes(role)) {
    if (!name) throw new Error("NAME_REQUIRED");
    if (!office) throw new Error("OFFICE_REQUIRED");
  }

  /* ===== CREATE AUTH ===== */
  const userRecord = await auth.createUser({
    email,
    password: "123456",
  });

  /* ===== SAVE FIRESTORE ===== */
  const userData =
    role === "DOCTOR"
      ? {
          email,
          role,
          doctorId,
          createdAt: new Date(),
        }
      : {
          email,
          role,
          name,
          office: STAFF_ROLES.includes(role) ? office : null,
          createdAt: new Date(),
        };

  await db.collection("Users").doc(userRecord.uid).set(userData);

  return {
    uid: userRecord.uid,
    email,
    role,
  };
};
