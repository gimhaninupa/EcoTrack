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

export const serviceService = {
    // Create a new service (Admin only)
    async createService(adminId: string, serviceData: any) {
        try {
            await addDoc(collection(db, "services"), {
                adminId,
                serviceName: serviceData.serviceName,
                description: serviceData.description,
                area: serviceData.area,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            throw error;
        }
    },

    // Get services created by a specific admin (Real-time)
    subscribeToAdminServices(adminId: string, callback: (services: any[]) => void) {
        const q = query(
            collection(db, "services"),
            where("adminId", "==", adminId),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const services = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(services);
        }, (error) => {
            console.error("Error in subscribeToAdminServices:", error);
        });
    },

    // Get all services available for clients (optionally filtered by area)
    subscribeToAllServices(areaFilter: string | null, callback: (services: any[]) => void) {
        let q = query(collection(db, "services"), orderBy("createdAt", "desc"));

        if (areaFilter) {
            q = query(
                collection(db, "services"),
                where("area", "==", areaFilter),
                orderBy("createdAt", "desc")
            );
        }

        return onSnapshot(q, (snapshot) => {
            const services = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(services);
        }, (error) => {
            console.error("Error in subscribeToAllServices:", error);
        });
    }
};
