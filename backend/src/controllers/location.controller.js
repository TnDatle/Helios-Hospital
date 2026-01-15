import {
  fetchProvinces,
  fetchCommunes,
} from "../services/location.service.js";

export const getProvinces = async (req, res) => {
  try {
    const data = await fetchProvinces();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const getCommunes = async (req, res) => {
  try {
    const { provinceCode } = req.params;
    const data = await fetchCommunes(provinceCode);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
