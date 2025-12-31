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
 * Cache – tạm để trống cho khỏi crash
 */
export const warmUpDoctorCache = async () => {};
