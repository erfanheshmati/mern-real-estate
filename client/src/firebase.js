// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-5a725.firebaseapp.com",
  projectId: "mern-real-estate-5a725",
  storageBucket: "mern-real-estate-5a725.appspot.com",
  messagingSenderId: "715086213967",
  appId: "1:715086213967:web:fbd45e2e9a71ce7069cb3a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
