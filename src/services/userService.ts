import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

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
    },

    // Subscribe to all residents (Admin)
    subscribeToAllResidents(callback: (residents: any[]) => void) {
        console.log("userService: Subscribing to all residents...");
        const q = query(
            collection(db, "users"),
            where("role", "==", "resident")
            // orderBy("createdAt", "desc") // Commenting out orderBy temporarily to rule out index issues
        );

        return onSnapshot(q, (snapshot) => {
            console.log(`userService: Snapshot received. Docs count: ${snapshot.docs.length}`);
            const residents = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log("userService: Fetched resident:", data);
                return {
                    uid: doc.id,
                    ...data
                };
            });
            callback(residents);
        }, (error) => {
            console.error("Error in subscribeToAllResidents:", error);
        });
    }
};
