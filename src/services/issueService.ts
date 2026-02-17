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
    deleteDoc
} from "firebase/firestore";

export interface Issue {
    id?: string;
    userId: string;
    residentName: string;
    type: string;
    description: string;
    address: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    priority: 'Low' | 'Medium' | 'High';
    date: string;
    images?: string[];
    createdAt?: any;
}

export const issueService = {
    // Report a new issue (Resident)
    async reportIssue(issueData: Omit<Issue, 'id' | 'createdAt'>) {
        try {
            await addDoc(collection(db, "issues"), {
                ...issueData,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error reporting issue:", error);
            throw error;
        }
    },

    // Get issues for a specific user (Resident View)
    subscribeToUserIssues(userId: string, callback: (issues: Issue[]) => void) {
        const q = query(
            collection(db, "issues"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const issues = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Issue[];
            callback(issues);
        }, (error) => {
            console.error("Error in subscribeToUserIssues:", error);
        });
    },

    // Get ALL issues (Admin View)
    subscribeToAllIssues(callback: (issues: Issue[]) => void) {
        const q = query(
            collection(db, "issues"),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const issues = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Issue[];
            callback(issues);
        }, (error) => {
            console.error("Error in subscribeToAllIssues:", error);
        });
    },

    // Update Issue Status (Admin)
    async updateIssueStatus(issueId: string, status: Issue['status']) {
        try {
            const issueRef = doc(db, "issues", issueId);
            await updateDoc(issueRef, { status });
        } catch (error) {
            console.error("Error updating issue status:", error);
            throw error;
        }
    },

    // Update entire issue (Admin)
    async updateIssue(issueId: string, data: Partial<Issue>) {
        try {
            const issueRef = doc(db, "issues", issueId);
            await updateDoc(issueRef, data);
        } catch (error) {
            console.error("Error updating issue:", error);
            throw error;
        }
    },

    // Delete issue (Admin)
    async deleteIssue(issueId: string) {
        try {
            await deleteDoc(doc(db, "issues", issueId));
        } catch (error) {
            console.error("Error deleting issue:", error);
            throw error;
        }
    }
};
