import { appointmentCollection } from "../models/appointment.model.js";
import { DoctorModel } from "../models/doctor.model.js";
import { patientCollection } from "../models/patient.model.js";
import { departmentCollection } from "../models/department.model.js";
import { generateQueueNumber } from "../utils/queue.js";


export const createWalkInAppointmentService = async (data) => {

  const appointment = {
    userUid: data.userUid,

    patientId: data.patientId,
    fullName: data.fullName,
    dob: data.dob,
    phone: data.phone,
    gender: data.gender,
    cccd: data.cccd || null,

    information: {
      doctorId: data.information.doctorId,
      name: data.information.name,
      specialty: data.information.specialty,
      departmentId: data.information.departmentId,
      departmentName: data.information.departmentName,
    },

    schedule: {
      date: data.schedule.date,
      shiftId: data.schedule.shiftId,
      room: data.schedule.room,
    },

    status: "PENDING", 
    createdAt: new Date()
  };

  const docRef = await appointmentCollection.add(appointment);

  return {
    appointmentId: docRef.id
  };

};


export const checkInService = async (data) => {

  const departmentId = data.information?.departmentId;

  const queueNumber = await generateQueueNumber(departmentId);

  const checkin = {
    appointmentId: data.appointmentId || null, // nếu có đặt trước

    userUid: data.userUid, // lễ tân

    patientId: data.patientId,
    fullName: data.fullName,
    phone: data.phone,

    information: data.information,

    schedule: data.schedule,

    queueNumber,

    status: "WAITING",
    checkInTime: new Date()
  };

  const docRef = await checkinCollection.add(checkin);

  return {
    checkinId: docRef.id,
    queueNumber
  };
};

export const searchPatientsAppointmentService = async (query) => {

  const keyword = query.trim();

  const [codeSnap, phoneSnap, nameSnap] = await Promise.all([

    /* SEARCH BY PATIENT CODE */

    patientCollection
      .where("patientCode", "==", keyword)
      .limit(10)
      .get(),

    /* SEARCH BY PHONE */

    patientCollection
      .where("phone", "==", keyword)
      .limit(10)
      .get(),

    /* SEARCH BY FULL NAME */

    patientCollection
      .orderBy("fullName")
      .startAt(keyword)
      .endAt(keyword + "\uf8ff")
      .limit(10)
      .get()

  ]);

  const results = [];

  codeSnap.forEach(doc => {
    results.push({
      patientId: doc.id,
      ...doc.data()
    });
  });

  phoneSnap.forEach(doc => {
    results.push({
      patientId: doc.id,
      ...doc.data()
    });
  });

  nameSnap.forEach(doc => {
    results.push({
      patientId: doc.id,
      ...doc.data()
    });
  });

  /* REMOVE DUPLICATE */

  const unique = Array.from(
    new Map(results.map(item => [item.patientId, item])).values()
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