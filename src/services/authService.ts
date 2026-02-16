import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { userService } from "./userService";

export const authService = {
    // Register a new user
    async registerUser(email: string, password: string, userData: any) {
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Display Name
            await updateProfile(user, {
                displayName: userData.name
            });

            // 3. Create Firestore Profile
            try {
                await userService.createUserProfile(user.uid, {
                    name: userData.name,
                    email: email,
                    role: userData.role,
                    location: userData.location || ''
                });
            } catch (profileError) {
                console.error("AuthService: Failed to create Firestore profile during signup", profileError);
                // Continue execution so the user is returned.
                // The AuthContext will attempt to create/fetch the profile later.
            }

            return user;
        } catch (error) {
            throw error;
        }
    },

    // Login a user
    async loginUser(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    // Logout a user
    async logoutUser() {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    }
};
