import dayjs from "dayjs";
import { defaultDate, todayDate } from "../../data/date.ts";
import { animalGroupOptions, sexOptions } from "../../data/pet.ts";
import { basicOptions } from "../../data/general.ts";

/**
 * Used Google AI Mode to generate validation for image
 */

const validateSelectedOption = (value: string, options: string[]): string => {
    if (!value) {
        return "This field can't be empty.";
    }

    if (!options.includes(value)) {
        return "Invalid selected value. Please choose from the list.";
    }

    return "";
};

export const validateSelectedAnimalGroup = (value: string): string => {
    return validateSelectedOption(value, animalGroupOptions);
};

export const validateSelectedSex = (value: string): string => {
    return validateSelectedOption(value, sexOptions);
};

export const validateSelectedSpayedOrNeutered = (value: string): string => {
    return validateSelectedOption(value, basicOptions);
};

export const validateImage = (value: File) => {
    if (!value) {
        return "Please select an image.";
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(value.type)) {
        return "Only JPEG and PNG images are allowed.";
    }

    return "";
};

// TODO: remove this
/**
 * Validates string input of user, for more general string inputs.
 *
 * @param value
 * @returns string, cause of why value is invalid. Empty if value is valid.
 */
export const validateStringValue = (value: string): string => {
    console.log(value);

    if (value.length <= 0) {
        return "This field can't be empty.";
    }

    return "";
};

/**
 * Validates date input of user
 *
 * @param date
 * @returns string, cause of why value is invalid. Empty if value is valid.
 */
export const validateDateValue = (date: Date): string => {
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

    return "";
};
