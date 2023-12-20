"use client"
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// const firebaseConfig = {
//     apiKey: "AIzaSyBTZS_eUDDU83mYhcnTUhpCwJ4nJisTORY",
//     authDomain: "next-auth-app-51cca.firebaseapp.com",
//     projectId: "next-auth-app-51cca",
//     storageBucket: "next-auth-app-51cca.appspot.com",
//     messagingSenderId: "723699406572",
//     appId: "1:723699406572:web:806651964788499c3f37c9",
//     measurementId: "G-DQG7Z733F9"
// };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)
const firestore = getFirestore(app); // Initialize Firestore

export { app, auth, firestore };
// export {app, auth}
