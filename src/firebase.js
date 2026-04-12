import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBegK9WsaRJEPYmhDf4MDgyJoVQ8Eow5OQ",
  authDomain: "alfie-love.firebaseapp.com",
  projectId: "alfie-love",
  storageBucket: "alfie-love.firebasestorage.app",
  messagingSenderId: "786007232158",
  appId: "1:786007232158:web:12d37acfc4518bac5d758f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
