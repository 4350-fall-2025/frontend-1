// Based on validateName in sign up page
export const validateStringValue = (value: string): string | null => {
    if (!value || value.trim().length === 0) return "This field is required";
    const trimmed = value.trim();
    if (trimmed.length < 2) return "This field must be at least 2 characters";
    if (trimmed.length > 32) return "This field must be at most 32 characters";
    if (!/^[A-Za-z\-\s]+$/.test(trimmed))
        return "This field may only contain letters, spaces and dashes";
    return null;
};

export const validateSelectedOption = (
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
