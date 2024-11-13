import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import storage
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

// à remplacer pour pas trop dépasser limite et requête
const firebaseConfig = {
    apiKey: "AIzaSyAf2sIeBe9j9i39DrL9u32py-5DfIVm1qc",
    authDomain: "projet-bc37c.firebaseapp.com",
    databaseURL: "https://projet-bc37c-default-rtdb.firebaseio.com",
    projectId: "projet-bc37c",
    storageBucket: "projet-bc37c.appspot.com",
    messagingSenderId: "329017083370",
    appId: "1:329017083370:web:2a967a79bd2ac5c3645e93"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage



export const auth = getAuth(app);
export {db, storage}
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
