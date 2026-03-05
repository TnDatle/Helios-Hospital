import {searchPatientsAppointmentService, createWalkInAppointmentService , getAppointmentsByPatientService } from "../services/appointment.service.js";

export const createWalkInAppointment = async (req, res) => {

  try {

    const result = await createWalkInAppointmentService(req.body);

    res.status(201).json(result);

  } catch (err) {

    console.error("CREATE WALKIN ERROR:", err);

    res.status(500).json({
      message: "Không thể tạo lịch khám"
    });

  }

};

export const getAppointmentsByPatient = async (req, res) => {

  try {

    const { patientId } = req.params;

    const appointments = await getAppointmentsByPatientService(patientId);

    res.status(200).json(appointments);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Cannot get appointments"
    });

  }

};

export const searchPatientsAppointment = async (req, res) => {

  try {

    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        message: "Missing query"
      });
    }

    const patients = await searchPatientsAppointmentService(q);

    res.json(patients);

  } catch (err) {

    console.error("SEARCH PATIENT ERROR:", err);

    res.status(500).json({
      message: "Server error"
    });

  }

};