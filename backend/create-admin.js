import { admin, db } from "./src/config/firebase.js";

const email = process.env.DEFAULT_ADMIN_EMAIL;
const password = process.env.DEFAULT_ADMIN_PASSWORD;

async function createAdmin() {
  try {
    const user = await admin.auth().createUser({
      email,
      password,
    });

    await db.collection("Users").doc(user.uid).set({
      email,
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ ADMIN CREATED:", email);
    process.exit();
  } catch (err) {
    console.error("❌ CREATE ADMIN FAILED:", err.message);
    process.exit(1);
  }
}

createAdmin();
