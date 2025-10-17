import { validateImage } from "./validate-new-pet";

/**
 * Test suite written with the help of Claude Sonnet 4.5
 */

describe("Create new pet validations", () => {
    describe("Image validation", () => {
        it("returns null for valid JPEG image", () => {
            const jpegFile = new File(["dummy content"], "test.jpg", {
                type: "image/jpeg",
            });
            expect(validateImage(jpegFile)).toBeNull();
        });

        it("returns null for valid PNG image", () => {
            const pngFile = new File(["dummy content"], "test.png", {
                type: "image/png",
            });
            expect(validateImage(pngFile)).toBeNull();
        });

        it("returns error when no file is provided (null)", () => {
            expect(validateImage(null as any)).toBe("Please select an image.");
        });

        it("returns error when no file is provided (undefined)", () => {
            expect(validateImage(undefined as any)).toBe(
                "Please select an image.",
            );
        });

        it("returns error for invalid file type (GIF)", () => {
            const gifFile = new File(["dummy content"], "test.gif", {
                type: "image/gif",
            });
            expect(validateImage(gifFile)).toBe(
                "Only JPEG and PNG images are allowed.",
            );
        });

        it("returns error for invalid file type (SVG)", () => {
            const svgFile = new File(["dummy content"], "test.svg", {
                type: "image/svg+xml",
            });
            expect(validateImage(svgFile)).toBe(
                "Only JPEG and PNG images are allowed.",
            );
        });

        it("accepts JPEG with uppercase extension", () => {
            const jpegFile = new File(["dummy content"], "test.JPEG", {
                type: "image/jpeg",
            });
            expect(validateImage(jpegFile)).toBeNull();
        });

        it("accepts PNG with uppercase extension", () => {
            const pngFile = new File(["dummy content"], "test.PNG", {
                type: "image/png",
            });
            expect(validateImage(pngFile)).toBeNull();
        });
    });
});
