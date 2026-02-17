import { db } from "../firebase";
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    orderBy
} from "firebase/firestore";

export interface Pickup {
    id?: string;
    userId: string;
    residentName: string;
    date: string; // ISO string or simple date string
    type: 'Waste' | 'Recycling' | 'Organic' | 'Hazardous';
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Missed';
    location: string;
    notes?: string;
    createdAt?: any;
}

export const pickupService = {
    // Schedule a new pickup (Resident)
    async createPickup(pickupData: Omit<Pickup, 'id' | 'createdAt' | 'status'>) {
        try {
            await addDoc(collection(db, "pickups"), {
                ...pickupData,
                status: 'Scheduled',
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error creating pickup:", error);
            throw error;
        }
    },

    // Get pickups for a specific user (Resident View)
    subscribeToUserPickups(userId: string, callback: (pickups: Pickup[]) => void) {
        const q = query(
            collection(db, "pickups"),
            where("userId", "==", userId),
            orderBy("date", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const pickups = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Pickup[];
            callback(pickups);
        }, (error) => {
            console.error("Error in subscribeToUserPickups:", error);
        });
    },

    // Get ALL pickups (Admin View - Schedule Builder)
    subscribeToAllPickups(callback: (pickups: Pickup[]) => void) {
        const q = query(
            collection(db, "pickups"),
            orderBy("date", "asc")
        );

        return onSnapshot(q, (snapshot) => {
            const pickups = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Pickup[];
            callback(pickups);
        }, (error) => {
            console.error("Error in subscribeToAllPickups:", error);
        });
    },

    async updatePickup(id: string, updates: Partial<Pickup>) {
        try {
            // Import doc and updateDoc dynamically to avoid top-level import errors if not used
            const { doc, updateDoc } = await import("firebase/firestore");
            const pickupRef = doc(db, "pickups", id);
            await updateDoc(pickupRef, updates);
        } catch (error) {
            console.error("Error updating pickup:", error);
            throw error;
        }
    },

    async deletePickup(id: string) {
        try {
            const { doc, deleteDoc } = await import("firebase/firestore");
            const pickupRef = doc(db, "pickups", id);
            await deleteDoc(pickupRef);
        } catch (error) {
            console.error("Error deleting pickup:", error);
            throw error;
        }
    }
};
