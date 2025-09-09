// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, useDeviceLanguage } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZaG8YlslypFVsE1Zx6YBV6nwtqH39Z-o",
  authDomain: "otp-auth-82e63.firebaseapp.com",
  projectId: "otp-auth-82e63",
  storageBucket: "otp-auth-82e63.firebasestorage.app",
  messagingSenderId: "907580235322",
  appId: "1:907580235322:web:6cc8a39c0d8760fd621f03",
  measurementId: "G-56YV06YQMV"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
useDeviceLanguage(auth);

export { auth };