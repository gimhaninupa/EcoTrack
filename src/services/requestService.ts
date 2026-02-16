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
    orderBy
} from "firebase/firestore";

export const requestService = {
    // Create a new request (Client)
    async createRequest(clientId: string, serviceId: string, adminId: string) {
        try {
            await addDoc(collection(db, "requests"), {
                clientId,
                serviceId,
                adminId,
                status: "pending",
                createdAt: serverTimestamp()
            });
        } catch (error) {
            throw error;
        }
    },

    // Get requests for a specific client (Real-time)
    subscribeToClientRequests(clientId: string, callback: (requests: any[]) => void) {
        const q = query(
            collection(db, "requests"),
            where("clientId", "==", clientId),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(requests);
        }, (error) => {
            console.error("Error in subscribeToClientRequests:", error);
        });
    },

    // Get requests for a specific admin (Real-time)
    subscribeToAdminRequests(adminId: string, callback: (requests: any[]) => void) {
        const q = query(
            collection(db, "requests"),
            where("adminId", "==", adminId),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(requests);
        }, (error) => {
            console.error("Error in subscribeToAdminRequests:", error);
        });
    },

    // Update request status (Admin only)
    async updateRequestStatus(requestId: string, status: "pending" | "accepted" | "completed") {
        try {
            const requestRef = doc(db, "requests", requestId);
            await updateDoc(requestRef, { status });
        } catch (error) {
            throw error;
        }
    }
};
