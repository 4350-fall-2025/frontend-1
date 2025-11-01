import { notesMaxCharacters, notesMinCharacters } from "~data/constants";

export const validateDiaryContentBody = (value: string): string | null => {
    if (!value || value.trim().length === 0) return "Notes field is required.";
    const trimmed = value.trim();
    if (trimmed.length < notesMinCharacters)
        return (
            "This field must be at least " + notesMinCharacters + " characters"
        );
    if (trimmed.length > notesMaxCharacters)
        return (
            "This field must be at most " + notesMaxCharacters + " characters"
        );
    return null;
};
