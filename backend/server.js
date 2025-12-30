import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import "./src/config/firebase.js";
import doctorRoutes from "./src/routes/doctor-routes.js";
import { warmUpDoctorCache } from "./src/services/doctor-service.js";
import locationRoutes from "./src/routes/location-routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.get("/", (req, res) => res.send("Server OK"));
app.use("/api/doctors", doctorRoutes);
app.use("/api/locations", locationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  await warmUpDoctorCache();
});
