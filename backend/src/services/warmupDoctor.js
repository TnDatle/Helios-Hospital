import { db } from "../config/firebase.js";

export const warmUpDoctorCache = async (doctorListCache) => {
  try {
    console.log(" Warming up doctor cache...");

    const depDocRef = db.collection("Doctor").doc("Departments");
    const departments = await depDocRef.listCollections();

    const snapshots = await Promise.all(
      departments.map((dep) => dep.get())
    );

    const allDoctors = [];

    snapshots.forEach((snap, index) => {
      snap.docs.forEach((doc) => {
        const d = doc.data();
        allDoctors.push({
          id: doc.id,
          name: d.DocName || "",
          specialty: d.specialty || "",
          role: d.role || "",
          room: d.room || "",
          weekday: d.weekday || "",
          shiftmorning: d.shiftmorning || "",
          shiftafternoon: d.shiftafternoon || "",
          department: departments[index].id,
        });
      });
    });

    doctorListCache.set("__ALL__", {
      expire: Date.now() + 10 * 1000,
      data: allDoctors,
    });

    console.log(` Doctor cache warmed: ${allDoctors.length} doctors`);
  } catch (err) {
    console.error(" Warm-up doctor cache failed:", err);
  }
};
