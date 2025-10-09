/**
 * Validates email input of user
 * 
 * @param value 
 * @returns string, cause of why email is invalid. Empty if email is valid.
 */
export const validateEmail = (value) => {
    if (value.length <= 0) {
        return "Email can't be empty.";
    }

    // Used chatgpt to generate regex pattern
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Incorrect email format. Email should be formatted as youremail@email.com";
    }

    return "";
}

/**
 * 
 * @param value 
 * @returns string, cause of why password is invalid. Empty if password is valid.
 */
export const validatePassword = (value) => {

    if (value.length <= 0) {
        return "Password can't be empty.";
    }

    return "";
}