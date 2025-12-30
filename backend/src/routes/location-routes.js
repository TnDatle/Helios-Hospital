import express from "express";
import {
  getProvinces,
  getCommunes,
} from "../controllers/location-controller.js";

const router = express.Router();

router.get("/provinces", getProvinces);
router.get("/communes/:provinceCode", getCommunes);

export default router;
