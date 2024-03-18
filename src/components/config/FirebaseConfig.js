// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVwrsFH1SAqSc7gJoNllJ7JHLOzSQI6Nk",
  authDomain: "feedback-f0c02.firebaseapp.com",
  projectId: "feedback-f0c02",
  storageBucket: "feedback-f0c02.appspot.com",
  messagingSenderId: "904432839052",
  appId: "1:904432839052:web:858ed29fce56fb150d4ea9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)