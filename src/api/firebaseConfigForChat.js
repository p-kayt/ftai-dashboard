// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { collection, getFireStore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig2 = {
  apiKey: "AIzaSyCa5Gyv8zbVQcWQDwGrk-C7XZwF84UYHoI",
  authDomain: "ftai-firebase-auth.firebaseapp.com",
  databaseURL: "https://ftai-firebase-auth-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ftai-firebase-auth",
  storageBucket: "ftai-firebase-auth.appspot.com",
  messagingSenderId: "713920214373",
  appId: "1:713920214373:web:f9390a985bb9dfe5751d8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig2);

export const db = getFireStore(app);

export const roomRef = collection(db, "rooms");
