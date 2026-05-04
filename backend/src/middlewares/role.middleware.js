export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }

    if (!roles.includes(req.user.role)) {
      console.log("FORBIDDEN:", req.user.role);
      return res.status(403).json({ message: "FORBIDDEN" });
    }

    next();
  };
};