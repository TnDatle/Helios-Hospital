import { db } from "../config/firebase.js";

export class DoctorModel {
  static fromFirestore(doc, departmentFromFE = "") {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name || data.DocName || "",
      specialty: data.specialty || "",
      role: data.role || "",
      department: departmentFromFE || data.departmentId || "",
      departmentId: data.departmentId || "",
      isActive: data.isActive ?? true,
    };
  }

    static async update(id, data) {
    await db.collection("Doctor").doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
  }
}
