import { defaultDate, todayDate } from "~data/constants";
import {
    validateRequiredImage,
    validateOptionalDateValue,
    validateRequiredDateValue,
    validateRequiredStringValue,
    validateOptionalImage,
} from "~util/validation/validation";

/**
 * Used Claude Sonnet 4.5 to generate tests for validateRequiredDateValue and some of validateRequiredImage
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

    describe("Image validation", () => {
        it("returns null for valid JPEG image", () => {
            const jpegFile = new File(["dummy content"], "test.jpg", {
                type: "image/jpeg",
            });
            expect(validateRequiredImage(jpegFile)).toBeNull();
        });

        it("returns null for valid PNG image", () => {
            const pngFile = new File(["dummy content"], "test.png", {
                type: "image/png",
            });
            expect(validateRequiredImage(pngFile)).toBeNull();
        });

        it("returns error when no file is provided (null) for required images", () => {
            expect(validateRequiredImage(null as any)).toBe(
                "Please select an image.",
            );
        });

        it("returns error when no file is provided (undefined) for required images", () => {
            expect(validateRequiredImage(undefined as any)).toBe(
                "Please select an image.",
            );
        });

        it("returns null when no file is provided (null) for optional images", () => {
            expect(validateOptionalImage(null as any)).toBe(null);
        });

        it("returns null when no file is provided (undefined) for optional images", () => {
            expect(validateOptionalImage(undefined as any)).toBe(null);
        });

        it("returns error for invalid file type (GIF)", () => {
            const gifFile = new File(["dummy content"], "test.gif", {
                type: "image/gif",
            });
            expect(validateRequiredImage(gifFile)).toBe(
                "Only jpeg, webp, and png images are allowed.",
            );
        });

        it("returns error for invalid file type (SVG)", () => {
            const svgFile = new File(["dummy content"], "test.svg", {
                type: "image/svg+xml",
            });
            expect(validateRequiredImage(svgFile)).toBe(
                "Only jpeg, webp, and png images are allowed.",
            );
        });

        it("accepts JPEG with uppercase extension", () => {
            const jpegFile = new File(["dummy content"], "test.JPEG", {
                type: "image/jpeg",
            });
            expect(validateRequiredImage(jpegFile)).toBeNull();
        });

        it("accepts PNG with uppercase extension", () => {
            const pngFile = new File(["dummy content"], "test.PNG", {
                type: "image/png",
            });
            expect(validateRequiredImage(pngFile)).toBeNull();
        });
    });
});
