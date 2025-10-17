import { validatePassword } from "./validate-signin";

/**
 * Test suite written with help from Claude Sonnet 4.5
 *
 * Note: When we add authentication, these tests will be stricter
 */

describe("Sign-in validations", () => {
    describe("Password validation", () => {
        it("returns error for empty string", () => {
            const result = validatePassword("");
            expect(result).toBe("Password can't be empty.");
        });

        it("returns null for single character password", () => {
            expect(validatePassword("a")).toBeNull();
        });

        it("returns null for simple string password", () => {
            expect(validatePassword("password123")).toBeNull();
        });

        it("returns null for special characters string password", () => {
            expect(validatePassword("p@ssw0rd!")).toBeNull();
        });
    });
});
