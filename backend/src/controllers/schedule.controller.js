import {
  fetchPublicScheduleGrouped,
  fetchSchedulesByDoctor,
  getSchedulesService,
  createBulkScheduleService,
  deleteScheduleService,

} from "../services/schedule.service.js";

export const getDoctorSchedules = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const { doctorId } = req.params;
    const schedules = await fetchSchedulesByDoctor(doctorId);

    res.json({
      success: true,
      data: schedules,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};


export const getPublicSchedules = async (req, res) => {
  try {
    const data = await fetchPublicScheduleGrouped();
    res.json({ success: true, data });
  } catch (err) {
    console.error("[getPublicSchedules]", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


//CRUD Schedule for Admin

/* ================= GET ================= */
export const getSchedulesController = async (req, res) => {
  try {
    console.log("[API] query:", req.query);

    const { departmentId } = req.query;
    const data = await getSchedulesService({ departmentId });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};


/* ================= CREATE BULK ================= */
export const createBulkScheduleController = async (req, res) => {
  const { doctorId, room, slots } = req.body;

  if (!doctorId || !room || !Array.isArray(slots)) {
    return res.status(400).json({
      success: false,
      message: "Thiếu dữ liệu",
    });
  }

  try {
    await createBulkScheduleService({ doctorId, room, slots });
    res.json({ success: true });
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteScheduleController = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteScheduleService(id);
    res.json({ success: true });
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};
