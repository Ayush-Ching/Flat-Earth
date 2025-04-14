// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsdRSMMctV9CHzHmBRgyMCiIJF_ZrkDBA",
  authDomain: "flat-earth-f635d.firebaseapp.com",
  projectId: "flat-earth-f635d",
  storageBucket: "flat-earth-f635d.firebasestorage.app",
  messagingSenderId: "825841464510",
  appId: "1:825841464510:web:c90e8cce0b56ea0afa5aef",
  measurementId: "G-JGVQYM3D1J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);