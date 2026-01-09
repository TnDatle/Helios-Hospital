import * as DepartmentService from "../services/department-service.js";

// GET
export const getDepartments = async (req, res) => {
  try {
    const departments = await DepartmentService.fetchDepartments();
    res.json({ success: true, data: departments });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// POST
export const createDepartment = async (req, res) => {
  try {
    const department =
      await DepartmentService.createDepartment(req.body);

    res.status(201).json({ data: department });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Lỗi server",
    });
  }
};


// PUT 
export const updateDepartment = async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await DepartmentService.updateDepartment(
      slug,
      req.body
    );

    res.json({ data });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};



// DELETE
export const deleteDepartment = async (req, res) => {
  try {
    await DepartmentService.deleteDepartment(req.params.slug);
    res.json({ success: true });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};
