import { db } from "../firebase";
import {
    collection,
    addDoc,
    query,
    onSnapshot,
    serverTimestamp,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    where
} from "firebase/firestore";

export interface Truck {
    id?: string;
    driver: string;
    status: 'En Route' | 'Collection' | 'Idle' | 'Maintenance';
    location: string;
    battery: number;
    fuel: number;
    route: string;
    type: string;
    vehicleNumber: string;
    contactNumber: string;
    latitude: number;
    longitude: number;
    currentStopIndex?: number; // For simulation/tracking
    headingTo?: string;
    eta?: string;
    updatedAt?: any;
}

// Route waypoints for simulation (Meepe to Kottawa)
export const ROUTE_WAYPOINTS: [number, number][] = [
    [6.8533, 80.0575], // Meepe
    [6.8520, 80.0500], // Meegoda Area
    [6.8480, 80.0300], // Godagama
    [6.8430, 80.0000], // Homagama
    [6.8410, 79.9900], // Makumbura
    [6.8412, 79.9700]  // Kottawa (End)
];

export const truckService = {
    // Add a new truck (Admin)
    async addTruck(truckData: Omit<Truck, 'id' | 'updatedAt'>) {
        try {
            await addDoc(collection(db, "trucks"), {
                ...truckData,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error adding truck:", error);
            throw error;
        }
    },

    // Subscribe to ALL trucks (Admin View)
    subscribeToAllTrucks(callback: (trucks: Truck[]) => void) {
        const q = query(
            collection(db, "trucks"),
            orderBy("updatedAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const trucks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Truck[];
            callback(trucks);
        }, (error) => {
            console.error("Error in subscribeToAllTrucks:", error);
        });
    },

    // Subscribe to a specific truck (Resident Tracking)
    subscribeToTruck(truckId: string, callback: (truck: Truck | null) => void) {
        const truckRef = doc(db, "trucks", truckId);

        return onSnapshot(truckRef, (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...doc.data() } as Truck);
            } else {
                callback(null);
            }
        }, (error) => {
            console.error("Error in subscribeToTruck:", error);
        });
    },

    // Update Truck details/location
    async updateTruck(truckId: string, updates: Partial<Truck>) {
        try {
            const truckRef = doc(db, "trucks", truckId);
            await updateDoc(truckRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating truck:", error);
            throw error;
        }
    },

    async deleteTruck(truckId: string) {
        try {
            await deleteDoc(doc(db, "trucks", truckId));
        } catch (error) {
            console.error("Error deleting truck:", error);
            throw error;
        }
    }
};
