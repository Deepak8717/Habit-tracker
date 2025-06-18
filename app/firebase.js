// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBouyNEi2wLXV4XaXXb6LCcoBHcjDvkv4E",
  authDomain: "leverage-dc5c7.firebaseapp.com",
  projectId: "leverage-dc5c7",
  storageBucket: "leverage-dc5c7.firebasestorage.app",
  messagingSenderId: "392940244115",
  appId: "1:392940244115:web:67e6007b96ba55f7235166",
  measurementId: "G-N3G5T8DYW0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
