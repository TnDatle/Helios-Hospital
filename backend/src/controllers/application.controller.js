import * as applicationService from "../services/application.service.js";

// Hàm ứng tuyển công việc 
export const createApplication = async (req, res) => {
  try {
    const result = await applicationService.createApplication(req);

    res.status(201).json({
      message: "Ứng tuyển thành công",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Lỗi server",
    });
  }
};

// Hàm lấy CV theo từng job
export const getApplications = async (req, res) => {
  try {
    let { jobId } = req.query;

    // normalize dữ liệu
    if (jobId === "undefined") jobId = undefined;

    const data = await applicationService.ApplicationService.getApplications(jobId);

    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// update status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("ID:", id);
    console.log("BODY:", req.body);
    console.log("STATUS:", status);

    if (!status) {
      return res.status(400).json({
        error: "Status is required",
      });
    }

    const result =
      await applicationService.ApplicationService.updateStatus(
        id,
        status
      );

    res.json({ message: "Updated", data: result });
  } catch (err) {
    console.error("UPDATE ERROR:", err.message);
    res.status(400).json({ error: err.message });
  }
};