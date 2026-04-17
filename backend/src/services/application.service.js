import { applicationCollection } from "../models/application.model.js";


export const createApplication = async (req) => {
  const { name, email, phone, coverLetter, jobId } = req.body;

  const file = req.file;

  if (!file) throw new Error("Chưa upload CV");

  const cvUrl = `http://localhost:5000/uploads/cv/${file.filename}`;

  const docRef = await applicationCollection.add({
    name,
    email,
    phone,
    coverLetter,
    jobId,
    cvUrl,
    status: "pending",
    createdAt: new Date(),
  });

  return {
    id: docRef.id,
    cvUrl,
  };
};