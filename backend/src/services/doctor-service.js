import { db } from "../config/firebase.js";
import Doctor from "../models/doctor-model.js";
import {
  doctorListCache,
  doctorDetailCache,
  getCache,
  setCache,
} from "../cache/doctor-cache.js";

export const fetchDoctors = async (department) => {
  const cacheKey = department || "__ALL__";

  const cached = getCache(doctorListCache, cacheKey);
  if (cached) return cached;

  const depDocRef = db.collection("Doctor").doc("Departments");
  let doctors = [];

  if (department) {
    const snapshot = await depDocRef
      .collection(department)
      .get();

    doctors = snapshot.docs.map((doc) =>
      Doctor.fromFirestore(doc, department).toListJSON()
    );
  } else {
    const departments = await depDocRef.listCollections();
    const snapshots = await Promise.all(
      departments.map((dep) => dep.get())
    );

    doctors = snapshots.flatMap((snap, index) =>
      snap.docs.map((doc) =>
        Doctor.fromFirestore(doc, departments[index].id).toListJSON()
      )
    );
  }

  setCache(doctorListCache, cacheKey, doctors);
  return doctors;
};

export const fetchDoctorDetail = async (department, id) => {
  const cacheKey = `${department}_${id}`;

  const cached = getCache(doctorDetailCache, cacheKey);
  if (cached) return cached;

  const snapshot = await db
    .collection("Doctor")
    .doc("Departments")
    .collection(department)
    .doc(id)
    .get();

  if (!snapshot.exists) return null;

  const doctor = Doctor.fromFirestore(
    snapshot,
    department
  ).toDetailJSON();

  setCache(doctorDetailCache, cacheKey, doctor);
  return doctor;
};

export const warmUpDoctorCache = async () => {
  console.log("Warming up doctor cache...");
  await fetchDoctors();
  console.log("Doctor cache ready");
};
