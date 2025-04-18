// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpe4_0ipKfGNINw26YhuEHZG1vG5ISd3o",
  authDomain: "school-erp-system-da7b9.firebaseapp.com",
  projectId: "school-erp-system-da7b9",
  storageBucket: "school-erp-system-da7b9.firebasestorage.app",
  messagingSenderId: "337080671538",
  appId: "1:337080671538:web:9898fecfce1d2885e44b2b",
  measurementId: "G-RS2RYYEGDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);