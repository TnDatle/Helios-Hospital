// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config (GIỮ NGUYÊN)
const firebaseConfig = {
  apiKey: "AIzaSyC2bZzwg5nqzkqBGCxHYCldn-NtMbwcbao",
  authDomain: "helios-bd3c4.firebaseapp.com",
  projectId: "helios-bd3c4",
  storageBucket: "helios-bd3c4.firebasestorage.app",
  messagingSenderId: "80852148358",
  appId: "1:80852148358:web:afb4ca37ebe24222ad7107",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT NHỮNG THỨ CẦN DÙNG
export const auth = getAuth(app);
export const db = getFirestore(app);
