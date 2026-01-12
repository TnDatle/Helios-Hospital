import { db ,FieldValue} from "../config/firebase.js";

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



/* =====================================================
   GET – JOIN Doctor + Department + Schedule
===================================================== */
export const getSchedulesService = async () => {
  const [scheduleSnap, doctorSnap, deptSnap] = await Promise.all([
    db.collection("DoctorWeeklySchedules").get(),
    db.collection("Doctor").get(),
    db.collection("Departments").get(),
  ]);

  const doctorMap = {};
  doctorSnap.forEach((d) => {
    doctorMap[d.id] = { id: d.id, ...d.data() };
  });

  const deptMap = {};
  deptSnap.forEach((d) => {
    deptMap[d.id] = { id: d.id, ...d.data() };
  });

  const result = {};

  scheduleSnap.forEach((doc) => {
    const s = doc.data();
    const doctor = doctorMap[s.doctorId];
    if (!doctor) return;

    const deptId = doctor.departmentId;
    const dept = deptMap[deptId];

    if (!result[deptId]) {
      result[deptId] = {
        departmentId: deptId,
        departmentName: dept?.name || "Chưa xác định",
        doctors: {},
      };
    }

    if (!result[deptId].doctors[s.doctorId]) {
      result[deptId].doctors[s.doctorId] = {
        doctorId: s.doctorId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        room: s.room,
        schedule: {},
        scheduleMap: {},
      };
    }

    if (!result[deptId].doctors[s.doctorId].schedule[s.weekday]) {
      result[deptId].doctors[s.doctorId].schedule[s.weekday] = [];
    }

    result[deptId].doctors[s.doctorId].schedule[s.weekday].push(
      s.shiftId
    );

    result[deptId].doctors[s.doctorId].scheduleMap[
      `${s.weekday}_${s.shiftId}`
    ] = doc.id;
  });

  return Object.values(result).map((dept) => ({
    ...dept,
    doctors: Object.values(dept.doctors),
  }));
};

/* =====================================================
   CREATE BULK – TRANSACTION CHECK TRÙNG
===================================================== */
export const createBulkScheduleService = async ({
  doctorId,
  room,
  slots,
}) => {
  await db.runTransaction(async (tx) => {
    // 1. Check trùng
    for (const slot of slots) {
      const q = db
        .collection("DoctorWeeklySchedules")
        .where("doctorId", "==", doctorId)
        .where("weekday", "==", slot.weekday)
        .where("shiftId", "==", slot.shift);

      const snap = await tx.get(q);
      if (!snap.empty) {
        throw new Error(
          `Trùng lịch: Thứ ${slot.weekday} - ${slot.shift}`
        );
      }
    }

    // 2. Create
    slots.forEach((slot) => {
      const ref = db.collection("DoctorWeeklySchedules").doc();
      tx.set(ref, {
        doctorId,
        weekday: slot.weekday,
        shiftId: slot.shift,
        room,
        createdAt: FieldValue.serverTimestamp(),
      });
    });
  });
};

/* =====================================================
   DELETE – CHECK APPOINTMENT
===================================================== */
export const deleteScheduleService = async (scheduleId) => {
  const apptSnap = await db
    .collection("Appointments")
    .where("scheduleId", "==", scheduleId)
    .limit(1)
    .get();

  if (!apptSnap.empty) {
    throw new Error("Không thể xoá lịch đã có bệnh nhân đặt");
  }

  await db
    .collection("DoctorWeeklySchedules")
    .doc(scheduleId)
    .delete();
};