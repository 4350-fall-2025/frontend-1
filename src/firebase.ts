// Initial code generated from ChatGPT, GPT-5 Model
// then modified to meet projects needs

// src/firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import {
    getAuth,
    connectAuthEmulator,
    signInWithCustomToken,
    Auth,
    signOut,
} from "firebase/auth";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getBytes,
    FirebaseStorage,
    connectStorageEmulator,
} from "firebase/storage";
import placeholderImage from "~public/placeholder.jpg";

export const USE_EMULATOR: boolean =
    process.env.NEXT_PUBLIC_USE_EMULATOR === "true";
export const USE_STORAGE: boolean =
    process.env.NEXT_PUBLIC_USE_STORAGE === "true";

const firebaseEmulatorConfig = {
    apiKey: "qdog-6aca2-dummy-apikey",
    authDomain: "qdog-6aca2.firebaseapp.com",
    projectId: "qdog-6aca2",
    storageBucket: "qdog-6aca2.appspot.com",
};

const firebaseDBConfig = {
    apiKey: process.env.NEXT_PUBLIC_GCP_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_GCP_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_GCP_BUCKET,
};

// Initialize Firebase App
const firebaseConfig = USE_EMULATOR ? firebaseEmulatorConfig : firebaseDBConfig;

export const app: FirebaseApp = initializeApp(firebaseConfig);

// Auth
export const auth: Auth = getAuth(app);
if (USE_EMULATOR) {
    connectAuthEmulator(auth, "http://localhost:9099");
}

// Storage emulator
export const storage: FirebaseStorage = getStorage(app);
if (USE_EMULATOR) {
    connectStorageEmulator(storage, "localhost", 9199);
}

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

    if (USE_STORAGE) {
        // Reference to the file location in Firebase Storage
        const storageRef = ref(storage, `${filePath}`);
        await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(storageRef); // Get the file's download URL

        return fileUrl; // Return the download URL
    } else {
        return placeholderImage.src;
    }
}

export async function downloadFile(filePath: string): Promise<Blob> {
    if (!auth.currentUser) {
        throw new Error("User is not authenticated.");
    }
    if (USE_STORAGE) {
        const storageRef = ref(storage, filePath);
        const fileBytes = await getBytes(storageRef); // Get file bytes from Firebase Storage
        return new Blob([fileBytes]);
    } else {
        return null;
    }
}

export async function getImageURL(filePath: string): Promise<string> {
    if (USE_STORAGE) {
        const storageRef = ref(storage, `${filePath}`);
        const fileUrl = await getDownloadURL(storageRef);
        return fileUrl;
    } else {
        return placeholderImage.src;
    }
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
