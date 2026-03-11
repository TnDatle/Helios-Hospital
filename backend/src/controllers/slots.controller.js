import { getTodaySlotsByDepartment } from "../services/slots.service.js";

export const getTodaySlots = async (req, res) => {

  try {

    const { departmentId } = req.query;

    console.log("[Controller] departmentId:", departmentId);

    console.log("[API] query:", req.query);

    const slots = await getTodaySlotsByDepartment(departmentId); // phải truyền vào

    console.log("[API] doctors length:", slots.length);

    res.json(slots);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }

};