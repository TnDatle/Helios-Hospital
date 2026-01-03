import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Lấy thông tin khoa theo ID
 * @param {string} departmentId
 * @returns {object | null}
 */
export const getDepartmentById = async (departmentId) => {
  if (!departmentId) return null;

  const ref = doc(db, "Departments", departmentId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
};
