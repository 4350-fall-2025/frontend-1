// Initial code generated from ChatGPT, GPT-5 Model
// then modified to meet projects needs

// src/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, signInWithCustomToken, Auth, signOut } from "firebase/auth";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getBytes,
    FirebaseStorage,
} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyABKDG4qCnILmCUJwqSj9UX0WCXP6fUlt0",
    authDomain: "qdog-prod-43670.firebaseapp.com",
    projectId: "qdog-prod-43670",
    storageBucket: "qdog-prod-43670.firebasestorage.app",
};

// Initialize Firebase App
export let app: FirebaseApp = initializeApp(firebaseConfig);

// Auth
export const auth: Auth = getAuth(app);

// Storage
export const storage: FirebaseStorage = getStorage(app);

// Sign in with backend custom token
export async function signInWithBackendToken(token: string): Promise<void> {
    await signInWithCustomToken(auth, token);
}

export async function signOutOfFirebase() {
    if (auth.currentUser) {
        signOut(auth);
    }
}

export async function uploadFile(
    file: File,
    filePath: string,
): Promise<string> {
    if (!auth.currentUser) {
        throw new Error("User is not authenticated.");
    }

    // Reference to the file location in Firebase Storage
    const storageRef = ref(storage, `${filePath}`);
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

export async function getImageURL(filePath: string): Promise<string> {
    const storageRef = ref(storage, `${filePath}`);
    const fileUrl = await getDownloadURL(storageRef);
    return fileUrl;
}

export function generateDiaryURL(
    ownerId: string,
    petId: string,
    diaryId: string,
    fileName: string,
) {
    return `/owners/${ownerId}/pets/${petId}/diaries/${diaryId}/${fileName}`;
}

export function generatePetURL(ownerId: string, petId: string) {
    return `/owners/${ownerId}/pets/${petId}`;
}
