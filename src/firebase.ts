// Code copied from ChatGPT, GPT-5 Model

// src/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import {
    getAuth,
    connectAuthEmulator,
    signInWithCustomToken,
    Auth,
} from "firebase/auth";
import {
    getStorage,
    connectStorageEmulator,
    ref,
    uploadBytes,
    getDownloadURL,
    getBytes,
} from "firebase/storage";

// Firebase emulator config (projectId can be placeholder)
const firebaseConfig = {
    apiKey: "qdog-6aca2-dummy-apikey",
    authDomain: "qdog-6aca2.firebaseapp.com",
    projectId: "qdog-6aca2",
    storageBucket: "qdog-6aca2.appspot.com",
};

// Initialize Firebase App
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Auth emulator
export const auth: Auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

// Storage emulator
export const storage = getStorage(app);
connectStorageEmulator(storage, "localhost", 9199);

// Sign in with backend custom token
export async function signInWithBackendToken(token: string): Promise<void> {
    await signInWithCustomToken(auth, token);
}

export async function uploadFile(file: File): Promise<string> {
    if (!auth.currentUser) {
        throw new Error("User is not authenticated.");
    }

    // Reference to the file location in Firebase Storage
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef); // Get the file's download URL

    return fileUrl; // Return the download URL
}

export async function downloadFile(filePath: string): Promise<Blob> {
    if (!auth.currentUser) {
        throw new Error("User is not authenticated.");
    }

    const storageRef = ref(storage, filePath);
    const fileBytes = await getBytes(storageRef); // Get file bytes from Firebase Storage
    return new Blob([fileBytes]);
}
