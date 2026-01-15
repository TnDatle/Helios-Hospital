import {
  verifyAndLoadUser,
  hydrateAuthUser,
  getUserByUid,
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

/* GET ME (admin - staff - doctor)*/
export const getMe = async (req, res) => {
  try {
    const user = await hydrateAuthUser({ ...req.user });
    res.json({ data: user });
  } catch {
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

/* GET ME (patient)*/
export const getMeByToken = async (req, res) => {
  try {
    const uid = req.firebaseUser.uid;

    const user = await getUserByUid(uid);
    if (!user) {
      return res.status(403).json({ message: "USER_NOT_FOUND" });
    }

    res.json({
      data: {
        uid,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};
