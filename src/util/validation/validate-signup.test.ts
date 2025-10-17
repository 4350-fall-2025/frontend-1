import { DEFAULT_PASSWORD } from "~tests/utils/defaults";
import {
    validateLicenseId,
    validateName,
    validatePasswordSignup,
} from "./validate-signup";

describe("Signup field validations", () => {
    describe("Name validation", () => {
        it("returns null for valid names", () => {
            expect(validateName("John")).toBeNull();
        });

        it("accepts names with spaces", () => {
            expect(validateName("John Doe")).toBeNull();
        });

        it("accepts names with dashes", () => {
            expect(validateName("Mary-Jane")).toBeNull();
        });

        it("rejects empty name", () => {
            expect(validateName("")).toBe("Name is required");
        });

        it("rejects names that are too short", () => {
            expect(validateName("A")).toBe(
                "Name must be at least 2 characters",
            );
        });

        it("rejects names that are too long", () => {
            const longName = "A".repeat(33);
            expect(validateName(longName)).toBe(
                "Name must be at most 32 characters",
            );
        });

        it("rejects names with numbers", () => {
            expect(validateName("John123")).toBe(
                "Name may only contain letters, spaces and dashes",
            );
        });
    });

    describe("Password validation", () => {
        it("returns null for valid password", () => {
            expect(validatePasswordSignup(DEFAULT_PASSWORD)).toBeNull();
        });

        it("rejects empty password", () => {
            expect(validatePasswordSignup("")).toBe("Password is required");
        });

        it("rejects passwords that are too short", () => {
            expect(validatePasswordSignup("Pass1!")).toBe(
                "Password must be at least 8 characters",
            );
        });

        it("rejects passwords that are too long", () => {
            const longPassword = "Password1!".repeat(12) + "!"; // 120 characters

            expect(validatePasswordSignup(longPassword)).toBe(
                "Password must be at most 120 characters",
            );
        });

        it("rejects passwords missing lowercase letter", () => {
            expect(validatePasswordSignup("PASSWORD1!")).toBe(
                "Password must include at least one lowercase letter",
            );
        });

        it("rejects passwords missing uppercase letter", () => {
            expect(validatePasswordSignup("password1!")).toBe(
                "Password must include at least one uppercase letter",
            );
        });

        it("rejects passwords missing number", () => {
            expect(validatePasswordSignup("Password!")).toBe(
                "Password must include at least one number",
            );
        });

        it("rejects passwords missing symbol", () => {
            expect(validatePasswordSignup("Password1")).toBe(
                "Password must include at least one symbol",
            );
        });

        it("rejects unsupported symbols", () => {
            expect(validatePasswordSignup('Password1"')).toBe(
                "Password must include at least one symbol",
            );
        });
    });

    describe("License ID validation", () => {
        it("returns null for valid license IDs", () => {
            expect(validateLicenseId("A1b2C3d4E5")).toBeNull();
        });

        it("rejects empty license ID", () => {
            expect(validateLicenseId("")).toBe("License ID is required");
            expect(validateLicenseId("   ")).toBe("License ID is required");
        });

        it("rejects license IDs that are too short", () => {
            expect(validateLicenseId("A1B")).toBe(
                "License ID must be between 5 and 20 characters",
            );
        });

        it("rejects license IDs that are too long", () => {
            const longId = "A123".repeat(6); // 24 characters
            expect(validateLicenseId(longId)).toBe(
                "License ID must be between 5 and 20 characters",
            );
        });

        it("rejects license IDs with special characters", () => {
            expect(validateLicenseId("A1234!")).toBe(
                "License ID may only contain letters and numbers",
            );
        });
    });
});
