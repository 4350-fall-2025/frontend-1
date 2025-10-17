/**
 * Partially generated with GPT-5 mini
 */

/**
 * @param value form field value
 * @returns String error message, null if value is valid.
 */
export function validateName(name: string): string | null {
    if (!name || name.trim().length === 0) return "Name is required";
    const trimmed = name.trim();
    if (trimmed.length < 2) return "Name must be at least 2 characters";
    if (trimmed.length > 32) return "Name must be at most 32 characters";
    if (!/^[A-Za-z\-\s]+$/.test(trimmed))
        return "Name may only contain letters, spaces and dashes";
    return null;
}

/**
 * @param password password field value
 * @returns String error message, null if value is valid.
 */
export function validatePasswordSignup(password: string): string | null {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 120) return "Password must be at most 120 characters";
    if (!/[a-z]/.test(password))
        return "Password must include at least one lowercase letter";
    if (!/[A-Z]/.test(password))
        return "Password must include at least one uppercase letter";
    if (!/[0-9]/.test(password))
        return "Password must include at least one number";
    // Most symbols that exist on English keyboard
    if (!/[!#$%&()*+,-.:;<=>?@^_~]/.test(password))
        return "Password must include at least one symbol";
    return null;
}

/**
 *
 * @param licenseId veterinarian license ID
 * @returns String error message, null if valid
 */
export function validateLicenseId(licenseId: string): string | null {
    if (!licenseId || licenseId.trim().length === 0)
        return "License ID is required";

    const trimmed = licenseId.trim();
    if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
        return "License ID may only contain letters and numbers";
    }

    if (trimmed.length < 5 || trimmed.length > 20) {
        return "License ID must be between 5 and 20 characters";
    }

    return null;
}
