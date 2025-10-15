/**
 * Generated using Google AI Mode
 *
 * Converts a URL to a File object.
 * @param url The URL of the image.
 * @param filename The desired file name.
 * @param mimeType The MIME type of the file.
 * @returns A Promise that resolves to a File object or null if an error occurs.
 */
export async function urlToFile(
    url: string,
    filename: string,
    mimeType: string,
): Promise<File | null> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType });
    } catch (error) {
        console.error("Error creating File from URL:", error);
        return null;
    }
}
