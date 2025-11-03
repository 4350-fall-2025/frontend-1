// Code copied from ChatGPT, GPT-5 Model

// src/pages/UploadDemo.tsx
"use client";
import { useState } from "react";
import { uploadFile } from "src/firebase";

export default function UploadDemo() {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    // Upload the selected file
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first");
            return;
        }

        try {
            const url = await uploadFile(file);
            setImageUrl(url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Check console for details.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Upload a Photo</h1>

            <input
                type='file'
                accept='image/*'
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <div style={{ margin: "1rem 0" }}>
                <button onClick={handleUpload}>Upload Photo</button>
            </div>

            {imageUrl && (
                <div>
                    <h2>Uploaded Image:</h2>
                    <img
                        src={imageUrl}
                        alt='Uploaded'
                        style={{ maxWidth: "400px", maxHeight: "400px" }}
                    />
                </div>
            )}
        </div>
    );
}
