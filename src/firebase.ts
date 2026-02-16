import { initializeApp, getApps, getApp } from "firebase/app";
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

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Optional: Force long polling if websockets are unstable (common cause of "Internal Assertion Failed")
// import { initializeFirestore } from 'firebase/firestore';
// export const db = initializeFirestore(app, { experimentalForceLongPolling: true });
export default app;
