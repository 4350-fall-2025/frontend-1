import { basicOptions, animalGroupOptions, sexOptions } from "~data/constants";
import { validateRequiredSelectedOption } from "./validation.ts";

/**
 * Used Google AI Mode to generate validation for image
 */

export const validateSelectedAnimalGroup = (value: string): string | null => {
    return validateRequiredSelectedOption(value, animalGroupOptions);
};

export const validateSelectedSex = (value: string): string => {
    return validateRequiredSelectedOption(value, sexOptions);
};

export const validateSelectedSpayedOrNeutered = (
    value: string,
): string | null => {
    return validateRequiredSelectedOption(value, basicOptions);
};

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
