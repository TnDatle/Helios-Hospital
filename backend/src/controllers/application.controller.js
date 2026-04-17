import * as applicationService from "../services/application.service.js";

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