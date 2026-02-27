import {
  fetchPublicScheduleGrouped,
  fetchSchedulesByDoctor,
  getSchedulesService,
  createBulkScheduleService,
  deleteScheduleService,
  getScheduleByIdService, 
} from "../services/schedule.service.js";

/* =====================================================
   GET – LỊCH THEO BÁC SĨ (BOOKING)
===================================================== */
export const getDoctorSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu doctorId",
      });
    }

    res.set("Cache-Control", "no-store");

    const data = await fetchSchedulesByDoctor(doctorId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[getDoctorSchedules]", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =====================================================
   GET – SCHEDULE BY ID
===================================================== */
export const getScheduleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu scheduleId",
      });
    }

    const data = await getScheduleByIdService(id);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[getScheduleById]", error);

    return res.status(404).json({
      success: false,
      message: error.message || "Schedule not found",
    });
  }
};

/* =====================================================
   GET – PUBLIC SCHEDULE
===================================================== */
export const getPublicSchedules = async (req, res) => {
  try {
    const data = await fetchPublicScheduleGrouped();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[getPublicSchedules]", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =====================================================
   GET – ADMIN LIST
===================================================== */
export const getSchedulesController = async (req, res) => {
  try {
    const { departmentId } = req.query;

    const data = await getSchedulesService({ departmentId });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[getSchedulesController]", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =====================================================
   CREATE BULK
===================================================== */
export const createBulkScheduleController = async (req, res) => {
  try {
    const { doctorId, room, slots } = req.body;

    if (!doctorId || !room || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu đầu vào",
      });
    }

    await createBulkScheduleService({ doctorId, room, slots });

    return res.status(201).json({
      success: true,
      message: "Tạo lịch thành công",
    });
  } catch (error) {
    console.error("[createBulkSchedule]", error);

    return res.status(409).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   DELETE
===================================================== */
export const deleteScheduleController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu scheduleId",
      });
    }

    await deleteScheduleService(id);

    return res.status(200).json({
      success: true,
      message: "Xóa lịch thành công",
    });
  } catch (error) {
    console.error("[deleteSchedule]", error);

    return res.status(409).json({
      success: false,
      message: error.message,
    });
  }
};