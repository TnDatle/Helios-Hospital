import express from "express";
import { upload } from "../middlewares/upload.js";
import { uploadImage } from "../services/imageUpload.service.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = await uploadImage(
      req.file.buffer,
      req.file.originalname
    );

    res.json({ url: imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
