import { v4 as uuidv4 } from "uuid";
import { db } from "../config/firebase.js";
import admin from "firebase-admin";

const collection = db.collection("Patients");

const generatePatientCode = () => {
  const shortId = uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase();
  return "BN" + shortId;
};

export const createPatientService = async (data, user) => {

  //  Check duplicate phone
  if (data.phone) {
    const phoneQuery = await collection
      .where("phone", "==", data.phone)
      .limit(1)
      .get();

    if (!phoneQuery.empty) {
      throw new Error("PHONE_EXISTS");
    }
  }

  //  Check duplicate CCCD
  if (data.cccd) {
    const cccdQuery = await collection
      .where("cccd", "==", data.cccd)
      .limit(1)
      .get();

    if (!cccdQuery.empty) {
      throw new Error("CCCD_EXISTS");
    }
  }

  //  Generate unique patientCode
  let patientCode;
  let exists = true;

  while (exists) {
    patientCode = generatePatientCode();
    const doc = await collection.doc(patientCode).get();
    exists = doc.exists;
  }

  //  Logic ownerUid đơn giản
  // Nếu request có user (đăng nhập) → là user tạo
  // Nếu không có user (reception không verify) → null

  const ownerUid = user?.uid ?? null;

  const patientDoc = {
    patientCode,
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
    ownerUid,
    isDefault: false,

    createdBy: user?.uid ?? null,

    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await collection.doc(patientCode).set(patientDoc);

  return {
    patientCode,
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