// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmvsT7J0-2NOn0YxyLxcr0g_BHRKIjGAw",
  authDomain: "travello-2c306.firebaseapp.com",
  projectId: "travello-2c306",
  storageBucket: "travello-2c306.firebasestorage.app",
  messagingSenderId: "677676359488",
  appId: "1:677676359488:web:86838d8d444ea77ecee4a5",
  measurementId: "G-CV3S31JYB6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
