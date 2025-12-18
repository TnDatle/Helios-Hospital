import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import "./src/config/firebase.js";

// Import truy vấn thông tin bác sĩ
import doctorRoutes from "./src/routes/doctor-routes.js";
import { warmUpDoctorCache } from "./src/services/warmupDoctor.js";
import { doctorListCache } from "./src/controllers/doctor-controller.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => res.send("Server OK"));
app.use("/api/doctors", doctorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(5000, async () => {
  console.log("Backend running on port 5000");

  await warmUpDoctorCache(doctorListCache);
});
