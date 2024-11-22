import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC10xIU8VP83MNUvRQbq59bVf3bf-Vn2hE",
    authDomain: "projet-9f0cf.firebaseapp.com",
    databaseURL: "https://projet-9f0cf-default-rtdb.firebaseio.com",
    projectId: "projet-9f0cf",
    storageBucket: "projet-9f0cf.appspot.com",
    messagingSenderId: "799669167729",
    appId: "1:799669167729:web:5433d75097d6eee5bc1dd0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
