import { db } from "./src/config/firebase.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file JSON
const rawData = fs.readFileSync(
  path.join(__dirname, "doctorWeeklySchedules.json"),
  "utf-8"
);

const schedules = JSON.parse(rawData);

async function seedDoctorWeeklySchedules() {
  console.log("🚀 Start seeding DoctorWeeklySchedules...");

  let batch = db.batch();
  let batchCount = 0;
  let total = 0;

  for (const data of schedules) {
    const ref = db.collection("DoctorWeeklySchedules").doc();

    batch.set(ref, {
      doctorId: data.doctorId,
      weekday: data.weekday,
      shiftId: data.shiftId,
      room: data.room,
      createdAt: new Date(),
    });

    batchCount++;
    total++;

    // Firestore giới hạn 500 writes / batch
    if (batchCount === 500) {
      await batch.commit();
      console.log(`✅ Committed ${total} records`);
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`🎉 Seed DONE: ${total} records`);
  process.exit(0);
}

seedDoctorWeeklySchedules().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
