import { db } from "../config/firebase.js";

/**
 * =====================================================
 * CONFIG CACHE (RAM)
 * =====================================================
 */
const CACHE_TTL = 10 * 1000; // 30 giây
export const doctorListCache = new Map();
export const doctorDetailCache = new Map();


/**
 * =====================================================
 * HELPER: MAP DOCTOR
 * =====================================================
 */
const mapDoctor = (doc, department) => {
  const d = doc.data();

  return {
    id: doc.id,
    name: d.DocName || "",
    specialty: d.specialty || "",
    role: d.role || "",
    room: d.room || "",
    weekday: d.weekday || "",
    shiftmorning: d.shiftmorning || "",
    shiftafternoon: d.shiftafternoon || "",
    department,
  };
};

/**
 * =====================================================
 * LIST BÁC SĨ
 * GET /api/doctors?department=xxx (optional)
 * =====================================================
 */
export const findDoctors = async (req, res) => {
  const { department } = req.query;
  const cacheKey = department || "__ALL__";

  // ===== CACHE HIT =====
  const cached = doctorListCache.get(cacheKey);
  if (cached && cached.expire > Date.now()) {
    return res.json({
      success: true,
      total: cached.data.length,
      data: cached.data,
      cached: true,
    });
  }

  try {
    const depDocRef = db.collection("Doctor").doc("Departments");
    let doctors = [];

    /**
     * ===========================
     * CASE 1: THEO KHOA
     * ===========================
     */
    if (department) {
      const snapshot = await depDocRef
        .collection(department)
        .get();

      doctors = snapshot.docs.map((doc) =>
        mapDoctor(doc, department)
      );
    }

    /**
     * ===========================
     * CASE 2: TẤT CẢ KHOA
     * ===========================
     */
    else {
      const departments = await depDocRef.listCollections();

      // SONG SONG TUYỆT ĐỐI
      const snapshots = await Promise.all(
        departments.map((dep) => dep.get())
      );

      doctors = snapshots.flatMap((snap, index) =>
        snap.docs.map((doc) =>
          mapDoctor(doc, departments[index].id)
        )
      );
    }

    // ===== SET CACHE =====
    doctorListCache.set(cacheKey, {
      expire: Date.now() + CACHE_TTL,
      data: doctors,
    });

    return res.json({
      success: true,
      total: doctors.length,
      data: doctors,
    });
  } catch (err) {
    console.error("[findDoctors]", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * =====================================================
 * CHI TIẾT BÁC SĨ
 * GET /api/doctors/:department/:id
 * =====================================================
 */
export const getDoctorDetail = async (req, res) => {
  const { department, id } = req.params;
  const cacheKey = `${department}_${id}`;

  // ===== VALIDATION =====
  if (!department || !id) {
    return res.status(400).json({
      success: false,
      message: "department and id are required",
    });
  }

  // ===== CACHE HIT =====
  const cached = doctorDetailCache.get(cacheKey);
  if (cached && cached.expire > Date.now()) {
    return res.json({
      success: true,
      data: cached.data,
      cached: true,
    });
  }

  try {
    const snapshot = await db
      .collection("Doctor")
      .doc("Departments")
      .collection(department)
      .doc(id)
      .get();

    if (!snapshot.exists) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const d = snapshot.data();

    const time = [d.shiftmorning, d.shiftafternoon]
      .filter(Boolean)
      .join(" | ");

    const result = {
      name: d.DocName || "",
      specialty: d.specialty || "",
      role: d.role || "",
      schedule: {
        day: d.weekday || "",
        time,
        room: d.room || "",
        location: "Khu Khám bệnh Trụ sở chính",
      },
    };

    // ===== SET CACHE =====
    doctorDetailCache.set(cacheKey, {
      expire: Date.now() + CACHE_TTL,
      data: result,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[getDoctorDetail]", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
