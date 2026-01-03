import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const createAppointment = async (payload) => {
  const ref = collection(db, "Appointments");

  const docRef = await addDoc(ref, {
    ...payload,
    status: "PENDING",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getAppointmentsByUser = async (userUid) => {
  const q = query(
    collection(db, "Appointments"),     
    where("userUid", "==", userUid),    
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};
