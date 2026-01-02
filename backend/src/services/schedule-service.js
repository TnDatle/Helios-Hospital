import { db } from "../config/firebase.js";

/**
 * Lấy lịch làm việc theo bác sĩ
 * @param {string} doctorId
 */

/**
 * ============================
 * LỊCH TỔNG – PUBLIC SCHEDULE
 * ============================
 */
const SHIFT_ORDER = {
  MORNING: 1,
  AFTERNOON: 2,
};

/**
 * Parse thứ tự phòng: TN-001 → 1
 */
const getRoomOrder = (room = "") => {
  const num = Number(room.replace(/\D/g, ""));
  return isNaN(num) ? 9999 : num;
};

/**
 * =====================================
 * PUBLIC SCHEDULE – GOM + SORT TỐI ƯU
 * =====================================
 */
export const fetchPublicScheduleGrouped = async () => {
  /**
   * 1️⃣ QUERY FIRESTORE – MỖI COLLECTION 1 LẦN
   */
  const [scheduleSnap, doctorSnap, departmentSnap] = await Promise.all([
    db.collection("DoctorWeeklySchedules").get(),
    db.collection("Doctor").get(),
    db.collection("Departments").get(),
  ]);

  /**
   * 2️⃣ BUILD MAP – LOOKUP O(1)
   */
  const doctorMap = {};
  doctorSnap.docs.forEach((doc) => {
    doctorMap[doc.id] = doc.data();
  });

  const departmentMap = {};
  departmentSnap.docs.forEach((doc) => {
    departmentMap[doc.id] = doc.data();
  });

  /**
   * 3️⃣ GOM LỊCH THEO doctorId (1 BÁC SĨ = 1 RECORD)
   */
  const resultMap = {};

  scheduleSnap.docs.forEach((doc) => {
    const s = doc.data();
    const doctor = doctorMap[s.doctorId];
    if (!doctor) return;

    const department = departmentMap[doctor.departmentId];
    const doctorId = s.doctorId;

    // INIT 1 LẦN DUY NHẤT
    if (!resultMap[doctorId]) {
      resultMap[doctorId] = {
        doctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        room: s.room,

        departmentId: doctor.departmentId,
        departmentName: department?.name || "",

        // weekday -> [shiftId]
        schedule: {},
      };
    }

    // CHỈ ADD NGÀY CÓ LỊCH
    if (!resultMap[doctorId].schedule[s.weekday]) {
      resultMap[doctorId].schedule[s.weekday] = [];
    }

    // TRÁNH TRÙNG CA
    if (
      !resultMap[doctorId].schedule[s.weekday].includes(
        s.shiftId
      )
    ) {
      resultMap[doctorId].schedule[s.weekday].push(s.shiftId);
    }
  });

  /**
   * 4️⃣ SORT:
   * - BÁC SĨ: THEO PHÒNG TN-001 → TN-002
   * - NGÀY: THỨ 2 → CN
   * - CA: SÁNG → CHIỀU
   */
  return Object.values(resultMap)
    .sort(
      (a, b) =>
        getRoomOrder(a.room) - getRoomOrder(b.room)
    )
    .map((doctor) => {
      const sortedSchedule = {};

      Object.keys(doctor.schedule)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((weekday) => {
          sortedSchedule[weekday] = doctor.schedule[
            weekday
          ].sort(
            (a, b) =>
              SHIFT_ORDER[a] - SHIFT_ORDER[b]
          );
        });

      return {
        ...doctor,
        schedule: sortedSchedule,
      };
    });
};


/**
 * ============================
 * LỊCH THEO BÁC SĨ (BOOKING)
 * ============================
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
