import { db } from "../config/firebase.js";

const collection = db.collection("Patients");
export const patientCollection = db.collection("Patients");

export const findByPhone = async (phone) => {
  return await collection.where("phone", "==", phone).limit(1).get();
};

export const findByCCCD = async (cccd) => {
  return await collection.where("cccd", "==", cccd).limit(1).get();
};

export const findById = async (id) => {
  return await collection.doc(id).get();
};

export const createPatient = async (patientCode, data) => {
  return await collection.doc(patientCode).set(data);
};

export const searchByField = async (field, value) => {
  return await collection.where(field, "==", value).limit(1).get();
};

export const searchByName = async (keyword) => {
  return await collection
    .where("fullName", ">=", keyword)
    .where("fullName", "<=", keyword + "\uf8ff")
    .limit(10)
    .get();
};