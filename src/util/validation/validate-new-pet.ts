/**
 * Used Google AI Mode to generate validation for image
 */

export const validateImage = (value: File): string | null => {
    if (!value) {
        return "Please select an image.";
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(value.type)) {
        return "Only JPEG and PNG images are allowed.";
    }

    return null;
};
