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
    userUid: payload.userUid || null,
    patientId: payload.patientId || null,

    fullName: payload.fullName || "",
    dob: payload.dob || "",
    phone: payload.phone || "",
    gender: payload.gender || "",
    cccd: payload.cccd || null,

    //Gom nhóm thông tin
    information: payload.information || null, // Thông tin Khoa , bác sĩ 
    schedule: payload.schedule || null, //Thông tin ngày , giờ khám

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
