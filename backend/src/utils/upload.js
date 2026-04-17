// src/utils/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

/* =====================
   CREATE FOLDER IF NOT EXISTS
===================== */
const uploadPath = "uploads/cv";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* =====================
   STORAGE CONFIG
===================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

/* =====================
   FILE FILTER (optional)
===================== */
const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Chỉ cho phép file PDF"), false);
  }

  cb(null, true);
};

/* =====================
   EXPORT
===================== */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});