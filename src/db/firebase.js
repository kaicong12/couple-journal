// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV5qHdZMoFpdpTgJZ4G2MuBU6NU5OJT5s",
  authDomain: "democpp-66e04.firebaseapp.com",
  projectId: "democpp-66e04",
  storageBucket: "democpp-66e04.appspot.com",
  messagingSenderId: "932047479692",
  appId: "1:932047479692:web:5c76eee3290e332714aca9",
  measurementId: "G-CGSML1BN2B",
  databaseURL: "https://democpp-66e04-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const database = getDatabase(app);
const rtdb = database;

export { db, rtdb }