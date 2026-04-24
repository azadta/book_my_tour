import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "book-my-tour-9f8bd.firebaseapp.com",
  projectId: "book-my-tour-9f8bd",
  storageBucket: "book-my-tour-9f8bd.firebasestorage.app",
  messagingSenderId: "916418323577",
  appId: "1:916418323577:web:e8edf750e5aa9ca2f560a8",
};

export const app: FirebaseApp = initializeApp(firebaseConfig);