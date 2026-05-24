import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD36bOW1Zntu64V2xRg4LWuzDvawx48IIQ",
  authDomain: "ecommerce-site-8e1bc.firebaseapp.com",
  projectId: "ecommerce-site-8e1bc",
  storageBucket: "ecommerce-site-8e1bc.firebasestorage.app",
  messagingSenderId: "671243950918",
  appId: "1:671243950918:web:e7b1aaf72a834171c82347",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);