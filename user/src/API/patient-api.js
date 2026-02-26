// API/patient-api.js
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {auth, db } from "../config/firebase";

export const getSelfPatientByOwner = async (ownerUid) => {
  const q = query(
    collection(db, "Patients"),
    where("ownerUid", "==", ownerUid),
    where("isDefault", "==", true)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return {
    id: snap.docs[0].id,
    ...snap.docs[0].data(),
  };
};


export const getPatientsByOwner = async (ownerUid) => {
  const q = query(
    collection(db, "Patients"),
    where("ownerUid", "==", ownerUid)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addPatient = async (data) => {
  const token = await auth.currentUser.getIdToken();

  const res = await fetch("http://localhost:5000/api/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};


export const updatePatient = async (id, data) => {
  return await updateDoc(doc(db, "Patients", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};


/**
 * Lấy thông tin bệnh nhân theo ID
 * @param {string} patientId
 * @returns {object | null}
 */
export const getPatientById = async (patientId) => {
  if (!patientId) return null;

  const ref = doc(db, "Patients", patientId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
};