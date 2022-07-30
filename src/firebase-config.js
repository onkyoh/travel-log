import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDsh0xrwA_qlcDR9DKYYI88s2h5K9DhIY0",
  authDomain: "travel-log-5ecbb.firebaseapp.com",
  projectId: "travel-log-5ecbb",
  storageBucket: "travel-log-5ecbb.appspot.com",
  messagingSenderId: "478018773744",
  appId: "1:478018773744:web:a5fb183d2903e90bf01835",
  measurementId: "G-QDCXBJZ827"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)