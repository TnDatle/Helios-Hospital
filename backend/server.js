import express from "express";
import cors from "cors";
import session from "express-session";
import fileUpload from "express-fileupload";

import "./src/config/firebase.js";
import doctorRoutes from "./src/routes/doctor.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import scheduleRoutes from "./src/routes/schedule.routes.js";
import locationRoutes from "./src/routes/location.routes.js";
import bookingDoctorRoutes from "./src/routes/booking-doctor.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoute from "./src/routes/auth.routes.js";

const app = express();

/* ======================
   1️⃣ PARSE JSON (PHẢI ĐẦU TIÊN)
====================== */
app.use(express.json());

/* ======================
   2️⃣ CORS
====================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ======================
   3️⃣ SESSION
====================== */
app.use(
  session({
    name: "helios.sid",
    secret: "helios-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

/* ======================
   4️⃣ FILE UPLOAD
====================== */
app.use(fileUpload());

/* ======================
   5️⃣ ROUTES
====================== */
app.get("/", (req, res) => res.send("Server OK"));
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/booking", bookingDoctorRoutes);
app.use("/api/auth", authRoute);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
