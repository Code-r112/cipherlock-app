// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFcjS7OBWsDU5RRO1H_WjGuQmNW5QquhY",
  authDomain: "brev-6b2e7.firebaseapp.com",
  projectId: "brev-6b2e7",
  storageBucket: "brev-6b2e7.firebasestorage.app",
  messagingSenderId: "81399061385",
  appId: "1:81399061385:web:df0f1b8c96ea5e6ce99f58",
  measurementId: "G-011YK6Q16S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
