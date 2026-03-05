import { appointmentCollection } from "../models/appointment.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import { departmentCollection } from "../models/department.model.js";
import { generateQueueNumber } from "../utils/queue.js";


export const createWalkInAppointmentService = async (data) => {

  const queueNumber = await generateQueueNumber(data.departmentId);

  const appointment = {

    patientId: data.patientId,

    departmentId: data.departmentId,

    doctorId: data.doctorId || null,

    visitType: data.visitType,

    priority: data.priority,

    paymentType: data.paymentType,

    reason: data.reason,

    hasInsurance: data.hasInsurance,

    queueNumber,

    status: "WAITING",

    schedule: {
      date: new Date().toISOString().split("T")[0],
      shiftId: "WALKIN"
    },

    createdAt: new Date()
  };

  const docRef = await appointmentCollection.add(appointment);

  return {
    appointmentId: docRef.id,
    queueNumber
  };
};


export const searchPatientsAppointmentService = async (query) => {

  const results = [];

  /* SEARCH BY PATIENT CODE */

  const codeSnap = await  appointmentCollection
    .where("patientId", "==", query)
    .limit(10)
    .get();

  codeSnap.forEach(doc => {
    results.push({
      id: doc.id,
      ...doc.data()
    });
  });

  /* SEARCH BY PHONE */

  const phoneSnap = await  appointmentCollection
    .where("phone", "==", query)
    .limit(10)
    .get();

  phoneSnap.forEach(doc => {
    results.push({
      id: doc.id,
      ...doc.data()
    });
  });

  /* SEARCH BY NAME (PREFIX SEARCH) */

  const nameSnap = await  appointmentCollection
    .orderBy("fullName")
    .startAt(query)
    .endAt(query + "\uf8ff")
    .limit(10)
    .get();

  nameSnap.forEach(doc => {
    results.push({
      id: doc.id,
      ...doc.data()
    });
  });

  /* REMOVE DUPLICATE */

  const unique = Array.from(
    new Map(results.map(item => [item.id, item])).values()
  );

  return unique;
};


export const getAppointmentsByPatientService = async (patientId) => {

  const snapshot = await appointmentCollection
    .where("patientId", "==", patientId)
    .get();

  const appointments = [];

  for (const doc of snapshot.docs) {

    const data = doc.data();

    let doctorName = "";
    let departmentName = "";

    /* GET DOCTOR */

    if (data.doctorId) {

      const doctor = await DoctorModel.getById(data.doctorId);

      doctorName = doctor?.name || "";

    }

    /* GET DEPARTMENT */

    if (data.departmentId) {

      const deptDoc = await departmentCollection
        .doc(data.departmentId)
        .get();

      if (deptDoc.exists) {
        departmentName = deptDoc.data().name;
      }

    }

    appointments.push({
      id: doc.id,
      ...data,
      doctorName,
      departmentName
    });

  }

  return appointments;

};