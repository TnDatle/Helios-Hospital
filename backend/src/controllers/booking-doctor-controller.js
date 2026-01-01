import {
  fetchDoctorsForBooking,
} from "../services/doctor-service.js";

export const findDoctorsForBooking = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const { departmentId } = req.query;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: "departmentId is required",
      });
    }

    const doctors = await fetchDoctorsForBooking(departmentId);

    res.json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    console.error("[findDoctorsForBooking]", err);
    res.status(500).json({ success: false });
  }
};
