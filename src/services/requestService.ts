import { db } from "../firebase";
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    doc,
    orderBy,
    getDocs // Added getDocs
} from "firebase/firestore";

export interface ServiceRequest {
    id?: string;
    clientId: string;
    clientName: string;
    clientAddress: string;
    wasteType: string;
    status: 'pending' | 'accepted' | 'completed' | 'cancelled'; // expanded status
    location: string;
    createdAt: any;
}

export const requestService = {
    // Create a new request (Client)
    async createRequest(
        clientId: string,
        clientName: string,
        clientAddress: string,
        wasteType: string,
        location: string
    ) {
        try {
            await addDoc(collection(db, "requests"), {
                clientId,
                clientName,
                clientAddress,
                wasteType,
                location,
                status: "pending",
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error creating request:", error);
            throw error;
        }
    },

    // Get requests for a specific client (Real-time)
    subscribeToClientRequests(clientId: string, callback: (requests: ServiceRequest[]) => void) {
        const q = query(
            collection(db, "requests"),
            where("clientId", "==", clientId),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ServiceRequest[];
            callback(requests);
        }, (error) => {
            console.error("Error in subscribeToClientRequests:", error);
        });
    },

    // Get ALL requests (Admin - Real-time)
    subscribeToAllRequests(callback: (requests: ServiceRequest[]) => void) {
        const q = query(
            collection(db, "requests"),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ServiceRequest[];
            callback(requests);
        }, (error) => {
            console.error("Error in subscribeToAllRequests:", error);
        });
    },

    // Update Request Status (Admin)
    async updateRequestStatus(requestId: string, status: 'pending' | 'accepted' | 'completed' | 'cancelled') {
        try {
            const requestRef = doc(db, "requests", requestId);
            await updateDoc(requestRef, {
                status
            });
        } catch (error) {
            console.error("Error updating request status:", error);
            throw error;
        }
    }
};
