import axios from "axios";

export const getProvinces = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/locations/provinces"
  );
  return res.data.data || [];
};

export const getCommunes = async (provinceCode) => {
  if (!provinceCode) return [];
  const res = await axios.get(
    `http://localhost:5000/api/locations/communes/${provinceCode}`
  );
  return res.data.data || [];
};
