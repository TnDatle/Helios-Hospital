import { getUsersService,createUserService } from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();
    res.json({ data: users });
  } catch (err) {
    console.error("GET /users failed:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const result = await createUserService(req.body);

    return res.status(201).json({
      message: "Tạo tài khoản thành công",
      data: result,
    });
  } catch (err) {
    switch (err.message) {
      case "INVALID_INPUT":
        return res.status(400).json({ message: "Thiếu email hoặc role" });

      case "DOCTOR_ID_REQUIRED":
        return res.status(400).json({ message: "Thiếu doctorId" });

      case "DOCTOR_NOT_FOUND":
        return res.status(404).json({ message: "Doctor không tồn tại" });

      case "DOCTOR_HAS_ACCOUNT": 
        return res
          .status(409)
          .json({ message: "Bác sĩ này đã có tài khoản đăng nhập" });

      case "NAME_REQUIRED":
        return res.status(400).json({ message: "Thiếu họ tên" });

      case "OFFICE_REQUIRED":
        return res.status(400).json({ message: "Thiếu phòng ban" });

      default:
        console.error("SYSTEM ERROR:", err);
        return res.status(500).json({ message: "Lỗi server" });
    }
  }
};
