import {
  createJobService,
  getJobsService,
  getJobByIdService,
  updateJobService,
  deleteJobService,
} from "../services/job.service.js";

export const createJob = async (req, res) => {
  try {
    const id = await createJobService(req.body);

    res.json({
      success: true,
      id,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await getJobsService();

    res.json({
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//Get job on User page
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await getJobByIdService(id);

    res.json({ data });
  } catch (err) {
    if (err.message === "JOB_NOT_FOUND") {
      return res.status(404).json({ message: "Không tìm thấy job" });
    }

    res.status(500).json({ message: err.message });
  }
};



export const updateJob = async (req, res) => {
  const { id } = req.params;

  const data = await updateJobService(id, req.body);

  res.json({ data });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  await deleteJobService(id);

  res.json({ message: "Deleted" });
};