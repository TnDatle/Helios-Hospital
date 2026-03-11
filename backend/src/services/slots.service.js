import { db } from "../config/firebase.js";

export const getTodaySlotsByDepartment = async (departmentId) => {

  const today = new Date().getDay();

  // 1lấy schedule hôm nay
  const scheduleSnapshot = await db
    .collection("DoctorWeeklySchedules")
    .where("weekday", "==", today)
    .get();

  const schedules = scheduleSnapshot.docs.map(doc => doc.data());

  //  lấy toàn bộ doctor của khoa (1 query)
  const doctorSnapshot = await db
    .collection("Doctor")
    .where("departmentId", "==", departmentId)
    .get();

  const doctors = {};

  doctorSnapshot.docs.forEach(doc => {
    doctors[doc.id] = doc.data();
  });

  // 3map schedule với doctor
  const result = schedules
    .filter(s => doctors[s.doctorId])
    .map(s => ({
      doctorId: s.doctorId,
      doctorName: doctors[s.doctorId].name,
      specialty: doctors[s.doctorId].specialty,
      room: s.room,
      shiftId: s.shiftId
    }));

  return result;

};