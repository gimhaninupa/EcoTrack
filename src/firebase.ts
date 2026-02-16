import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMsRdaxUo-OQ8PTbUPTAxVSkYAsG4WuY4",
    authDomain: "ecotrack-76009.firebaseapp.com",
    projectId: "ecotrack-76009",
    storageBucket: "ecotrack-76009.firebasestorage.app",
    messagingSenderId: "626410537233",
    appId: "1:626410537233:web:d8aa2204537ff98e164cb0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
