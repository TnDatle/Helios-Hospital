import { db } from "../config/firebase.js";

/**
 * Lấy lịch làm việc theo bác sĩ
 * @param {string} doctorId
 */
export const fetchSchedulesByDoctor = async (doctorId) => {
  if (!doctorId) return [];

  const snapshot = await db
    .collection("DoctorWeeklySchedules")
    .where("doctorId", "==", doctorId)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
