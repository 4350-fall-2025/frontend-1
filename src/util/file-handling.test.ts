import { urlToFile } from "./file-handling";

/**
 * Test suite written with the help of Claude Sonnet 4.5
 */

describe("urlToFile", () => {
    beforeEach(() => {
        // Reset fetch mock before each test
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("successfully converts a URL to a File object", async () => {
        const mockBlob = new Blob(["test content"], { type: "image/jpeg" });
        (global.fetch as jest.Mock).mockResolvedValue({
            blob: jest.fn().mockResolvedValue(mockBlob),
        });

        const result = await urlToFile(
            "https://example.com/image.jpg",
            "test.jpg",
            "image/jpeg",
        );

        expect(result).toBeInstanceOf(File);
    });

    it("creates a File with correct MIME type for PNG", async () => {
        const mockBlob = new Blob(["png content"], { type: "image/png" });
        (global.fetch as jest.Mock).mockResolvedValue({
            blob: jest.fn().mockResolvedValue(mockBlob),
        });

        const result = await urlToFile(
            "https://example.com/image.png",
            "test.png",
            "image/png",
        );

        expect(result?.type).toBe("image/png");
    });

    it("creates a File with custom filename", async () => {
        const mockBlob = new Blob(["content"], { type: "image/jpeg" });
        (global.fetch as jest.Mock).mockResolvedValue({
            blob: jest.fn().mockResolvedValue(mockBlob),
        });

        const result = await urlToFile(
            "https://example.com/original.jpg",
            "custom-name.jpg",
            "image/jpeg",
        );

        expect(result?.name).toBe("custom-name.jpg");
    });

    it("returns null when fetch fails", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation();
        (global.fetch as jest.Mock).mockRejectedValue(
            new Error("Network error"),
        );

        const result = await urlToFile(
            "https://example.com/image.jpg",
            "test.jpg",
            "image/jpeg",
        );

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error creating File from URL:",
            expect.any(Error),
        );
        consoleErrorSpy.mockRestore();
    });

    it("returns null when blob conversion fails", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation();
        (global.fetch as jest.Mock).mockResolvedValue({
            blob: jest.fn().mockRejectedValue(new Error("Blob error")),
        });

        const result = await urlToFile(
            "https://example.com/image.jpg",
            "test.jpg",
            "image/jpeg",
        );

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it("handles empty URL gracefully", async () => {
        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation();
        (global.fetch as jest.Mock).mockRejectedValue(new Error("Invalid URL"));

        const result = await urlToFile("", "test.jpg", "image/jpeg");

        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });

    it("handles different MIME types correctly", async () => {
        const mockBlob = new Blob(["pdf content"], { type: "application/pdf" });
        (global.fetch as jest.Mock).mockResolvedValue({
            blob: jest.fn().mockResolvedValue(mockBlob),
        });

        const result = await urlToFile(
            "https://example.com/document.pdf",
            "test.pdf",
            "application/pdf",
        );

        expect(result).toBeInstanceOf(File);
        expect(result?.type).toBe("application/pdf");
    });

    it("calls fetch with the correct URL", async () => {
        const mockBlob = new Blob(["content"], { type: "image/jpeg" });
        const url = "https://cdn.example.com/images/photo123.jpg";
        (global.fetch as jest.Mock).mockResolvedValue({
            blob: jest.fn().mockResolvedValue(mockBlob),
        });

        await urlToFile(url, "test.jpg", "image/jpeg");

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(url);
    });
});
