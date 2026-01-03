import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Lấy thông tin bác sĩ theo ID
 * @param {string} doctorId
 * @returns {object | null}
 */
export const getDoctorById = async (doctorId) => {
  if (!doctorId) return null;

  const ref = doc(db, "Doctor", doctorId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
};
