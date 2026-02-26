import { db } from "../config/firebase.js";
import admin from "firebase-admin";

const collection = db.collection("Patients");

export const createPatientService = async (data) => {

  // Check duplicate phone
  if (data.phone) {
    const phoneQuery = await collection
      .where("phone", "==", data.phone)
      .limit(1)
      .get();

    if (!phoneQuery.empty) {
      throw new Error("PHONE_EXISTS");
    }
  }

  // Check duplicate CCCD
  if (data.cccd) {
    const cccdQuery = await collection
      .where("cccd", "==", data.cccd)
      .limit(1)
      .get();

    if (!cccdQuery.empty) {
      throw new Error("CCCD_EXISTS");
    }
  }

  const patientDoc = {
    fullName: data.fullName,
    dob: data.dob,
    gender: data.gender?.toUpperCase(),
    phone: data.phone,
    cccd: data.cccd,
    ethnicity: data.ethnicity || "Kinh",

    address: {
      province: data.address?.province || "",
      commune: data.address?.commune || "",
      detail: data.address?.detail || ""
    },

    bhyt: data.bhyt || "",

    relationship: data.relationship || null,
    ownerUid: data.ownerUid || null,
    isDefault: false,

    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await collection.doc(data.patientCode).set(patientDoc);

  return {
    patientCode: data.patientCode,
    ...patientDoc
  };
};

export const searchPatientService = async (keyword) => {

  // search by doc id
  const doc = await collection.doc(keyword).get();
  if (doc.exists) {
    return { patientCode: doc.id, ...doc.data() };
  }

  // search by phone
  const phoneQuery = await collection
    .where("phone", "==", keyword)
    .limit(1)
    .get();

  if (!phoneQuery.empty) {
    const d = phoneQuery.docs[0];
    return { patientCode: d.id, ...d.data() };
  }

  // search by cccd
  const idQuery = await collection
    .where("cccd", "==", keyword)
    .limit(1)
    .get();

  if (!idQuery.empty) {
    const d = idQuery.docs[0];
    return { patientCode: d.id, ...d.data() };
  }

  return null;
};