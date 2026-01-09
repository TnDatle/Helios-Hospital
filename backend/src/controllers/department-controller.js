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


export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tên khoa không hợp lệ" });
    }

    const department = await Department.create({ name });

    res.status(201).json({ data: department });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
