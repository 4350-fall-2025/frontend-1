import { defaultDate, todayDate } from "~data/constants";
import {
    validateOptionalDateValue,
    validateRequiredDateValue,
    validateRequiredStringValue,
} from "~util/validation/validation";

/**
 * Used Claude Sonnet 4.5 to generate tests for validateRequiredDateValue
 */

describe("General validations", () => {
    describe("Name validation", () => {
        it("returns null for valid strings", () => {
            expect(validateRequiredStringValue("John")).toBeNull();
        });

        it("returns null for strings with spaces", () => {
            expect(validateRequiredStringValue("John Doe")).toBeNull();
        });

        it("returns null for strings with dashes", () => {
            expect(validateRequiredStringValue("Mary-Jane")).toBeNull();
        });

        it("rejects empty string", () => {
            expect(validateRequiredStringValue("")).toBe(
                "This field is required.",
            );
        });

        it("rejects strings that are too short", () => {
            expect(validateRequiredStringValue("A")).toBe(
                "This field must be at least 2 characters",
            );
        });

        it("rejects strings that are too long", () => {
            const longName = "A".repeat(33);
            expect(validateRequiredStringValue(longName)).toBe(
                "This field must be at most 32 characters",
            );
        });

        it("rejects strings with numbers", () => {
            expect(validateRequiredStringValue("John123")).toBe(
                "This field may only contain letters, spaces and dashes",
            );
        });
    });

    describe("validateRequiredDateValue", () => {
        it("returns null for valid date which is default", () => {
            expect(validateRequiredDateValue(defaultDate)).toBeNull();
        });

        it("returns null for valid date which is today", () => {
            expect(validateRequiredDateValue(todayDate)).toBeNull();
        });

        it("returns error for null date", () => {
            expect(validateRequiredDateValue(null)).toBe(
                "This field is required.",
            );
        });

        it("returns error for date before minimum", () => {
            const result = validateRequiredDateValue(new Date("1950-01-01"));
            expect(result).toContain("This date can't be before");
        });

        it("returns error for future date", () => {
            const result = validateRequiredDateValue(new Date("9999-01-01"));
            expect(result).toBe("Date must be in the past.");
        });
    });

    describe("validateOptionalDateValue", () => {
        it("returns null for valid date which is default", () => {
            expect(validateOptionalDateValue(defaultDate)).toBeNull();
        });

        it("returns null for valid date which is today", () => {
            expect(validateOptionalDateValue(todayDate)).toBeNull();
        });

        it("returns null for valid date which is null", () => {
            expect(validateOptionalDateValue(null)).toBeNull();
        });

        it("returns error for date before minimum", () => {
            const result = validateOptionalDateValue(new Date("1950-01-01"));
            expect(result).toContain("This date can't be before");
        });

        it("returns error for future date", () => {
            const result = validateOptionalDateValue(new Date("9999-01-01"));
            expect(result).toBe("Date must be in the past.");
        });
    });
});
