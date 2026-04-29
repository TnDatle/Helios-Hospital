import { ApplicationModel } from "../models/application.model.js";

/* =========================
   CREATE APPLICATION (UPLOAD CV)
========================= */
export const createApplication = async (req) => {
  try {
    const { name, email, phone, coverLetter, jobId } = req.body;
    const file = req.file;

    if (!file) throw new Error("Chưa upload CV");

    const cvUrl = `http://localhost:5000/uploads/cv/${file.filename}`;

    //gọi model
    const docRef = await ApplicationModel.create({
      name,
      email,
      phone,
      coverLetter,
      jobId,
      cvUrl,
      status: "pending",
      createdAt: new Date(),
    });

    return docRef;
  } catch (err) {
    throw new Error(err.message);
  }
};

/* =========================
   APPLICATION SERVICE
========================= */
export const ApplicationService = {
  async getApplications(jobId) {
    //fix lỗi "undefined"
    if (!jobId || jobId === "undefined") {
      return await ApplicationModel.findAll();
    }

    return await ApplicationModel.findByJobId(jobId);
  },

  async updateStatus(id, status) {
    const valid = ["pending", "approved", "rejected"];

    if (!valid.includes(status)) {
      throw new Error("Invalid status");
    }

    return await ApplicationModel.updateStatus(id, status);
  },
};