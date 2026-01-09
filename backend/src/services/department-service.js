import { db } from "../config/firebase.js";
import { slugify } from "../utils/slugify.js";

/* ======================
   FETCH DEPARTMENTS
====================== */
export const fetchDepartments = async () => {
  const snapshot = await db
    .collection("Departments")
    .where("isActive", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id, // slug
    name: doc.data().name,
    isActive: doc.data().isActive,
  }));
};

/* ======================
   CREATE DEPARTMENT
====================== */
export const createDepartment = async ({ name }) => {
  if (!name || !name.trim()) {
    const err = new Error("Tên khoa không hợp lệ");
    err.statusCode = 400;
    throw err;
  }

  const slug = slugify(name);

  const ref = db.collection("Departments").doc(slug);
  const snapshot = await ref.get();

  if (snapshot.exists) {
    const err = new Error("Khoa đã tồn tại");
    err.statusCode = 400;
    throw err;
  }

  await ref.set({
    name: name.trim(),
    isActive: true,
  });

  return {
    id: slug,
    name: name.trim(),
    isActive: true,
  };
};

/* ======================
   UPDATE DEPARTMENT
   (đổi tên + đổi luôn id)
====================== */
export const updateDepartment = async (oldSlug, { name }) => {
  if (!oldSlug || !name || !name.trim()) {
    const err = new Error("Dữ liệu không hợp lệ");
    err.statusCode = 400;
    throw err;
  }

  const newSlug = slugify(name);

  const oldRef = db.collection("Departments").doc(oldSlug);
  const newRef = db.collection("Departments").doc(newSlug);

  const oldSnap = await oldRef.get();
  if (!oldSnap.exists) {
    const err = new Error("Khoa không tồn tại");
    err.statusCode = 404;
    throw err;
  }

  /* slug không đổi → chỉ update name */
  if (oldSlug === newSlug) {
    await oldRef.update({ name: name.trim() });

    return {
      id: oldSlug,
      name: name.trim(),
      isActive: oldSnap.data().isActive,
    };
  }

  /* slug mới đã tồn tại → chặn */
  const newSnap = await newRef.get();
  if (newSnap.exists) {
    const err = new Error("Tên khoa đã tồn tại");
    err.statusCode = 400;
    throw err;
  }

  /* 🔥 TRANSACTION */
  await db.runTransaction(async (tx) => {
    // 1️⃣ READ TẤT CẢ TRƯỚC
    const doctorQuery = db
      .collection("Doctor")
      .where("departmentId", "==", oldSlug);

    const doctorSnap = await tx.get(doctorQuery);

    // 2️⃣ WRITE SAU
    tx.set(newRef, {
      name: name.trim(),
      isActive: oldSnap.data().isActive,
    });

    doctorSnap.docs.forEach((doc) => {
      tx.update(doc.ref, { departmentId: newSlug });
    });

    tx.delete(oldRef);
  });

  return {
    oldId: oldSlug,
    id: newSlug,
    name: name.trim(),
    isActive: oldSnap.data().isActive,
  };
};

/* ======================z`
   DELETE DEPARTMENT
   (soft delete)
====================== */
export const deleteDepartment = async (slug) => {
  if (!slug) {
    const err = new Error("ID khoa không hợp lệ");
    err.statusCode = 400;
    throw err;
  }

  const ref = db.collection("Departments").doc(slug);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    const err = new Error("Khoa không tồn tại");
    err.statusCode = 404;
    throw err;
  }

  // CHẶN XOÁ NẾU CÒN BÁC SĨ
  const doctorSnap = await db
    .collection("Doctor")
    .where("departmentId", "==", slug)
    .limit(1)
    .get();

  if (!doctorSnap.empty) {
    const err = new Error("Không thể xoá khoa vì vẫn còn bác sĩ");
    err.statusCode = 400;
    throw err;
  }

  // XOÁ HẲN
  await ref.delete();
};
