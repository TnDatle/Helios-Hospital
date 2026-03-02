import { v4 as uuidv4 } from "uuid";
import admin from "firebase-admin";
import * as PatientModel from "../models/patient.model.js";

const generatePatientCode = () => {
  const shortId = uuidv4().replace(/-/g, "").slice(0, 8).toUpperCase();
  return "BN" + shortId;
};

export const createPatientService = async (data, user) => {

  if (data.phone) {
    const phoneQuery = await PatientModel.findByPhone(data.phone);
    if (!phoneQuery.empty) throw new Error("PHONE_EXISTS");
  }

  if (data.cccd) {
    const cccdQuery = await PatientModel.findByCCCD(data.cccd);
    if (!cccdQuery.empty) throw new Error("CCCD_EXISTS");
  }

  let patientCode;
  let exists = true;

  while (exists) {
    patientCode = generatePatientCode();
    const doc = await PatientModel.findById(patientCode);
    exists = doc.exists;
  }

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
    ownerUid: user?.uid ?? null,
    isDefault: true,
    createdBy: user?.uid ?? null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await PatientModel.createPatient(patientCode, patientDoc);

  return { patientCode, ...patientDoc };
};


export const searchPatientService = async (keyword, type) => {

  switch (type) {
    case "id": {
      const doc = await PatientModel.findById(keyword);
      if (!doc.exists) return null;
      return [{ patientCode: doc.id, ...doc.data() }];
    }

    case "phone": {
      const snapshot = await PatientModel.findByPhone(keyword);
      if (snapshot.empty) return null;
      return snapshot.docs.map(doc => ({
        patientCode: doc.id,
        ...doc.data()
      }));
    }

    case "insurance": {
      const snapshot = await PatientModel.searchByField("bhyt", keyword);
      if (snapshot.empty) return null;
      return snapshot.docs.map(doc => ({
        patientCode: doc.id,
        ...doc.data()
      }));
    }

    case "name": {
      const snapshot = await PatientModel.searchByName(keyword);
      if (snapshot.empty) return null;
      return snapshot.docs.map(doc => ({
        patientCode: doc.id,
        ...doc.data()
      }));
    }

    default:
      return null;
  }
};