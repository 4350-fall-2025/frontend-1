export const validateDiaryContentBody = (value: string): string | null => {
    if (!value || value.trim().length === 0) return "Notes field is required.";
    const trimmed = value.trim();
    if (trimmed.length < 2) return "This field must be at least 2 characters";
    if (trimmed.length > 1500)
        return "This field must be at most 1500 characters";
    return null;
};
