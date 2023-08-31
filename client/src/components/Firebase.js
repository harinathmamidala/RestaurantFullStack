// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5xo-wfh0HOEN5RyaHcqNRQX2xYR71f48",
  authDomain: "restaurent-c3d12.firebaseapp.com",
  projectId: "restaurent-c3d12",
  storageBucket: "restaurent-c3d12.appspot.com",
  messagingSenderId: "677444886792",
  appId: "1:677444886792:web:e863e8e18b696a7c548cbd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);