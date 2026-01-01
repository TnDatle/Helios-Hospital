import { fetchDepartments } from "../services/department-service.js";

export const getDepartments = async (req, res) => {
  try {
      res.set("Cache-Control", "no-store");
    const departments = await fetchDepartments();

    res.json({
      success: true,
      data: departments,
    });
  } catch (err) {
    console.error("[getDepartments]", err);
    res.status(500).json({ success: false });
  }
};
