// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGXrfjeX8_EfpN6zCvBXsyFDSoBIe_MOQ",
  authDomain: "dashboard-18d80.firebaseapp.com",
  projectId: "dashboard-18d80",
  storageBucket: "dashboard-18d80.firebasestorage.app",
  messagingSenderId: "837010224764",
  appId: "1:837010224764:web:b3ac9ffb8cc5be8dd0bbf9",
  measurementId: "G-JH51DZKM8J"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
