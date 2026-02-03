import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATSGlDiBpBRn4G7xo6Re2QIS0xfvQgbTg",
  authDomain: "hemox-faae0.firebaseapp.com",
  projectId: "hemox-faae0",
  storageBucket: "hemox-faae0.appspot.com",
  messagingSenderId: "309037596770",
  appId: "1:309037596770:web:da95fc65df5f4a90a9d13b",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
