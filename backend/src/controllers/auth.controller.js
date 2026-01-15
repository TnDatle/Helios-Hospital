import {
  verifyAndLoadUser,
  hydrateAuthUser,
} from "../services/auth.service.js";

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "ID_TOKEN_REQUIRED" });
    }

    const user = await verifyAndLoadUser(idToken);

    req.session.user = {
      uid: user.uid,
      email: user.email,
      role: user.role,
      name: user.name || null,
      doctorId: user.doctorId || null,
    };

    req.session.save(() => {
      res.json({ ok: true });
    });
  } catch (err) {
    res.status(401).json({ message: err.message || "LOGIN_FAILED" });
  }
};

/* GET ME */
export const getMe = async (req, res) => {
  try {
    const user = await hydrateAuthUser({ ...req.user });
    res.json({ data: user });
  } catch {
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};
