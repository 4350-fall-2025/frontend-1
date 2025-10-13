import dayjs from "dayjs";
import { defaultDate, todayDate } from "~data/constants";
import { animalGroupOptions, sexOptions } from "~data/constants";
import { basicOptions } from "~data/constants";
import { validateSelectedOption } from "./validation.ts";

/**
 * Used Google AI Mode to generate validation for image
 * Reused validation for name in sign up page, with some modifications
 */

export const validateSelectedAnimalGroup = (value: string): string | null => {
    return validateSelectedOption(value, animalGroupOptions);
};

export const validateSelectedSex = (value: string): string => {
    return validateSelectedOption(value, sexOptions);
};

export const validateSelectedSpayedOrNeutered = (
    value: string,
): string | null => {
    return validateSelectedOption(value, basicOptions);
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

export const validateDateValue = (date: Date): string | null => {
    if (!date) {
        return "This field is required.";
    }

    const selectedDate = dayjs(date); // dayjs is better for comparison

    if (selectedDate.isBefore(defaultDate, "day")) {
        return (
            "This date can't be before " +
            dayjs(defaultDate).format("MMM D, YYYY") +
            "."
        );
    }

    if (selectedDate.isAfter(todayDate, "day")) {
        return "Date must be in the past.";
    }

    return null;
};
