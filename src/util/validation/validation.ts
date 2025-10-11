/**
 * Generated with GPT-5 mini
 * @param value form field value
 * @returns string, cause of why name is invalid. Empty if name is valid.
 */
export function validateName(name: string): string {
    if (!name || name.trim().length === 0) return "Name is required";
    const trimmed = name.trim();
    if (trimmed.length < 2) return "Name must be at least 2 characters";
    if (trimmed.length > 32) return "Name must be at most 32 characters";
    if (!/^[A-Za-z\-\s]+$/.test(trimmed))
        return "Name may only contain letters, spaces and dashes";
    return "";
}

/**
 * Validates email input of user
 * 
 * @param email 
 * @returns string, cause of why email is invalid. Empty if email is valid.
 */
export const validateEmail = (email: string) => {
    if (email.length <= 0) {
        return "Email can't be empty.";
    }

    // Used chatgpt to generate regex pattern
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Incorrect email format. Email should be formatted as youremail@email.com";
    }

    return "";
}

/**
 * 
 * @param password 
 * @returns string, cause of why password is invalid. Empty if password is valid.
 */
export const validatePassword = (password: string) => {

    if (password.length <= 0) {
        return "Password can't be empty.";
    }

    return "";
}

/**
 * Generated with GPT-5 mini
 * @param password password field value
 * @returns String reason for failure. Empty if field value is valid.
 */
export function validatePasswordSignup(password: string): string {
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
    return "";
}