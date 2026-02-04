import express from "express";
import cors from "cors";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import "./src/config/firebase.js";


import newsRoutes from "./src/routes/news.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import doctorRoutes from "./src/routes/doctor.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import scheduleRoutes from "./src/routes/schedule.routes.js";
import locationRoutes from "./src/routes/location.routes.js";
import bookingDoctorRoutes from "./src/routes/booking-doctor.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import authRoute from "./src/routes/auth.routes.js";
import chatbotRoute from "./src/routes/chatbot.routes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
];

/* ======================
   CORS 
====================== */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* ======================
   UPLOAD
====================== */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ======================
   PARSE JSON
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   SESSION
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
   STATIC FILE
====================== */
app.use("/uploads", express.static("uploads"));

/* ======================
   ROUTES
====================== */
app.get("/", (req, res) => res.send("Server OK"));
app.use("/api/upload", uploadRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/booking", bookingDoctorRoutes);
app.use("/api/auth", authRoute);
app.use("/api/news", newsRoutes);
app.use("/api/chatbot", chatbotRoute);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
