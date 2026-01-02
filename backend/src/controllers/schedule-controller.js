import {
  fetchPublicScheduleGrouped,
  fetchSchedulesByDoctor,
} from "../services/schedule-service.js";

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
