import { db } from "../config/firebase.js";

export const fetchDepartments = async () => {
  const snapshot = await db.collection("Departments").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
