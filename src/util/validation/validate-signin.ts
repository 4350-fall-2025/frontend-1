/**
 *
 * @param password
 * @returns string, cause of why password is invalid. Empty if password is valid.
 */
export const validatePassword = (password: string): string => {
    if (password.length <= 0) {
        return "Password can't be empty.";
    }

    return "";
};
