const errorHandler = (err, req, res, next) => {

  if (err.message === "PHONE_EXISTS") {
    return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
  }

  if (err.message === "CCCD_EXISTS") {
    return res.status(400).json({ message: "CCCD đã tồn tại" });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;