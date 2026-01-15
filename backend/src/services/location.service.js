import axios from "axios";
import {
  provinceCache,
  communeCache,
  getCache,
  setCache,
} from "../cache/location-cache.js";

const BASE_URL =
  "https://production.cas.so/address-kit/2025-07-01";

// ===== PROVINCES =====
export const fetchProvinces = async () => {
  const cached = getCache(provinceCache, "__ALL__");
  if (cached) {
    console.log("⚡ Provinces from cache");
    return cached;
  }

  console.log("Fetch provinces from Address Kit");
  const res = await axios.get(`${BASE_URL}/provinces`);

  const provinces = (res.data.provinces || []).map((p) => ({
    code: p.code,
    name: p.name,
  }));

  setCache(provinceCache, "__ALL__", provinces);
  return provinces;
};

// ===== COMMUNES =====
export const fetchCommunes = async (provinceCode) => {
  if (!provinceCode) return [];

  const cached = getCache(communeCache, provinceCode);
  if (cached) {
    console.log(`Communes ${provinceCode} from cache`);
    return cached;
  }

  console.log(`Fetch communes of ${provinceCode}`);
  const res = await axios.get(
    `${BASE_URL}/provinces/${provinceCode}/communes`
  );

  const communes = (res.data.communes || []).map((c) => ({
    code: c.code,
    name: c.name,
  }));

  setCache(communeCache, provinceCode, communes);
  return communes;
};
