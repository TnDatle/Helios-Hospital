import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import { DoctorModel } from "../models/doctor-model.js";

// FE gửi tên khoa → map sang departmentId DB
const departmentMap = {
  "Ngoai Tong Quat": "ngoai-tong-quat",
  "Ngoai Tiet Nieu": "ngoai-tiet-nieu",
  "Tim Mach": "tim-mach",
};

/**
 * Lấy danh sách bác sĩ
 * FE KHÔNG đổi gì
 */
export const fetchDoctors = async (departmentFromFE) => {
  console.log("[Service] departmentFromFE:", departmentFromFE);

  let query = db.collection("Doctor");

  if (departmentFromFE) {
    const departmentId =
      departmentMap[departmentFromFE] || departmentFromFE;

    console.log("[Service] mapped departmentId:", departmentId);

    query = query.where("departmentId", "==", departmentId);
  }

  const snapshot = await query.get();

  console.log("[Service] snapshot size:", snapshot.size);

  return snapshot.docs.map((doc) =>
    DoctorModel.fromFirestore(doc, departmentFromFE)
  );
};


/**
 * Lấy chi tiết 1 bác sĩ
 */
export const fetchDoctorDetail = async (doctorId) => {
  const docRef = db.collection("Doctor").doc(doctorId);
  const snap = await docRef.get();

  if (!snap.exists) return null;

  return DoctorModel.fromFirestore(snap);
};

/**
 * Lấy thông tin bác sĩ trong phần Booking
 */
export const fetchDoctorsForBooking = async (departmentId) => {
  if (!departmentId) return [];

  const snapshot = await db
    .collection("Doctor")
    .where("departmentId", "==", departmentId)
    .where("isActive", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    specialty: doc.data().specialty,
    role: doc.data().role,
  }));
};

export const DoctorService = {
  async updateDoctor(id, data) {
    if (!id) {
      throw new Error("Doctor ID is required");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("Không có dữ liệu để cập nhật");
    }

    /* ======================
       LOAD CURRENT DOCTOR
    ====================== */
    const ref = db.collection("Doctor").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new Error("Bác sĩ không tồn tại");
    }

    const currentDoctor = snap.data();
    const currentRole = currentDoctor.role ?? null;
    const newRole =
      "role" in data ? data.role ?? null : currentRole;

    /* ======================
       ROLE TRANSITION CHECK
    ====================== */
    if (newRole !== currentRole) {
      this._validateRoleTransition(currentRole, newRole);
    }

    /* ======================
       BUILD UPDATE DATA
    ====================== */
    const updateData = this._buildUpdateData(data, newRole);

    if (Object.keys(updateData).length === 0) {
      throw new Error("Không có dữ liệu hợp lệ để cập nhật");
    }

    await DoctorModel.update(id, updateData);
  },

  /* ======================
     PRIVATE HELPERS
  ====================== */

  _validateRoleTransition(currentRole, newRole) {
    // Trưởng khoa không được về bác sĩ thường
    if (currentRole === "Trưởng khoa" && newRole === null) {
      throw new Error(
        "Trưởng khoa không thể hạ trực tiếp xuống bác sĩ thường"
      );
    }

    // Trưởng khoa chỉ được về phó khoa
    if (
      currentRole === "Trưởng khoa" &&
      newRole &&
      newRole !== "Phó khoa"
    ) {
      throw new Error("Luồng vai trò không hợp lệ");
    }

    // validate role hợp lệ
    if (
      newRole &&
      !["Trưởng khoa", "Phó khoa"].includes(newRole)
    ) {
      throw new Error("Vai trò bác sĩ không hợp lệ");
    }
  },

  _buildUpdateData(data, newRole) {
    const updateData = {};

    if ("name" in data) {
      if (!data.name?.trim()) {
        throw new Error("Tên bác sĩ không được để trống");
      }
      updateData.name = data.name.trim();
    }

    if ("specialty" in data) {
      updateData.specialty = data.specialty;
    }

    if ("departmentId" in data) {
      updateData.departmentId = data.departmentId;
    }

    if ("isActive" in data) {
      updateData.isActive = Boolean(data.isActive);
    }

    if ("role" in data) {
      updateData.role =
        newRole === null
          ? admin.firestore.FieldValue.delete()
          : newRole;
    }

    return updateData;
  },

  //Hàm tạo bác sĩ mới 
  async createDoctor(data) {
  const { name, specialty, departmentId, role } = data;

  if (!name?.trim()) {
    throw new Error("Tên bác sĩ không được để trống");
  }

  if (!departmentId) {
    throw new Error("Khoa là bắt buộc");
  }

  const doctorData = {
    name: name.trim(),
    specialty: specialty || "",
    departmentId,
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // chỉ lưu role nếu không phải bác sĩ thường
  if (role && role !== "Bác sĩ") {
    doctorData.role = role;
  }

  const ref = await db.collection("Doctor").add(doctorData);
  const snap = await ref.get();

  return {
    id: ref.id,
    ...snap.data(),
  };
},
  async deleteDoctor(id) {
    if (!id) throw new Error("Doctor ID is required");

    const ref = db.collection("Doctor").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      throw new Error("Bác sĩ không tồn tại");
    }

    await ref.delete();
  }
};


/**
 * Cache – tạm để trống cho khỏi crash
 */
export const warmUpDoctorCache = async () => {};



