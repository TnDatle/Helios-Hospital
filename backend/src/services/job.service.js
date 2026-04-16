import { jobCollection } from "../models/job.model.js";

export const createJobService = async (data) => {
  if (!data.title) {
    throw new Error("Thiếu title");
  }

  const doc = await jobCollection.add({
    title: data.title,
    location: data.location || "",
    salary: data.salary || "",
    description: data.description || "",
    requirements: data.requirements || "",
    benefits: data.benefits || "",
    deadline: data.deadline,
    createdAt: Date.now(),
    isActive: true,
  });

  return doc.id;
};

export const getJobsService = async () => {
  const snapshot = await jobCollection.get();

  const now = new Date();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((job) => {
      if (!job.deadline) return true;

      return new Date(job.deadline) >= now;
    });
};


export const getJobByIdService = async (id) => {
  const doc = await jobCollection.doc(id).get();

  if (!doc.exists) {
    throw new Error("JOB_NOT_FOUND");
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};


export const updateJobService = async (id, body) => {
  await jobCollection.doc(id).update(body);

  return { id, ...body };
};

export const deleteJobService = async (id) => {
  await jobCollection.doc(id).delete();
};