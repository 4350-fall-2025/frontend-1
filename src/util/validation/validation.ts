import dayjs from "dayjs";
import { defaultDate, todayDate, allowedImageTypes } from "~data/constants";

// Based on validateName in sign up page
export const validateRequiredStringValue = (value: string): string | null => {
    if (!value || value.trim().length === 0) return "This field is required.";
    const trimmed = value.trim();
    if (trimmed.length < 2) return "This field must be at least 2 characters";
    if (trimmed.length > 32) return "This field must be at most 32 characters";
    if (!/^[A-Za-z\-\s]+$/.test(trimmed))
        return "This field may only contain letters, spaces and dashes";
    return null;
};

// NOTE: helper function, not meant to be used directly
const validateDate = (date: Date): string | null => {
    const selectedDate = dayjs(date); // dayjs is better for comparison

    // Check against defaultDate (earliest allowed) and todayDate (latest allowed)
    if (selectedDate.isBefore(defaultDate, "day")) {
        return (
            "This date can't be before " +
            dayjs(defaultDate).format("MMMM D, YYYY") +
            "."
        );
    }

    if (selectedDate.isAfter(todayDate, "day")) {
        return "Date must be in the past.";
    }

    return null;
};

export const validateRequiredDateValue = (date: Date): string | null => {
    if (!date) {
        return "This field is required.";
    }

    return validateDate(date);
};

export const validateOptionalDateValue = (date: Date): string | null => {
    if (!date) {
        return null;
    }

    return validateDate(date);
};

// NOTE: helper function, not meant to be used directly
const validateImage = (value: File): string | null => {
    if (!allowedImageTypes.includes(value.type)) {
        return "Only jpeg, webp, and png images are allowed.";
    }

    return null;
};

export const validateRequiredImage = (value: File): string | null => {
    if (!value) {
        return "Please select an image.";
    }

    return validateImage(value);
};

export const validateOptionalImage = (value: File): string | null => {
    if (!value) {
        return null;
    }

    return validateImage(value);
};
