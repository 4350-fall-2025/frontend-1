/**
 * Validation functions generated with AI
 */

export function validateName(value: string): string | null {
    if (!value || value.trim().length === 0) return "Name is required";
    const trimmed = value.trim();
    if (trimmed.length < 2) return "Name must be at least 2 characters";
    if (trimmed.length > 32) return "Name must be at most 32 characters";
    if (!/^[A-Za-z\-\s]+$/.test(trimmed))
        return "Name may only contain letters, spaces and dashes";
    return null;
}

export function validatePassword(value: string): string | null {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (value.length > 120) return "Password must be at most 120 characters";
    if (!/[a-z]/.test(value))
        return "Password must include at least one lowercase letter";
    if (!/[A-Z]/.test(value))
        return "Password must include at least one uppercase letter";
    if (!/[0-9]/.test(value))
        return "Password must include at least one number";
    // Most symbols that exist on English keyboard
    if (!/[!#$%&()*+,-.:;<=>?@^_~]/.test(value))
        return "Password must include at least one symbol";
    return null;
}
