import dayjs from "dayjs";
import { defaultDate, todayDate } from "~data/constants";

// Based on validateName in sign up page
export const validateRequiredStringValue = (value: string): string | null => {
    if (!value || value.trim().length === 0) return "This field is required";
    const trimmed = value.trim();
    if (trimmed.length < 2) return "This field must be at least 2 characters";
    if (trimmed.length > 32) return "This field must be at most 32 characters";
    if (!/^[A-Za-z\-\s]+$/.test(trimmed))
        return "This field may only contain letters, spaces and dashes";
    return null;
};

export const validateRequiredSelectedOption = (
    value: string,
    options: string[],
): string | null => {
    if (!value) {
        return "This field can't be empty.";
    }

    if (!options.includes(value)) {
        return "Invalid selected value. Please choose from the list.";
    }

    return null;
};

// NOTE: helper function, ensure date is not null before calling this
const validateDate = (date: Date): string | null => {
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
