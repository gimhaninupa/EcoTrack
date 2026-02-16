import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const userService = {
    // Create or overwrite a user profile
    async createUserProfile(uid: string, data: any) {
        const userRef = doc(db, "users", uid);
        try {
            await setDoc(userRef, {
                uid,
                ...data,
                createdAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    },

    // Get a user profile by UID
    async getUserProfile(uid: string) {
        const userRef = doc(db, "users", uid);
        try {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    },

    // Update a user profile
    async updateUserProfile(uid: string, data: any) {
        const userRef = doc(db, "users", uid);
        try {
            await setDoc(userRef, data, { merge: true });
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    }
};
