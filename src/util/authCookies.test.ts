/**
 * Unit tests for authentication cookie utilities
 * Testing cookie management functions for user authentication
 */

import { mockAuthOwner } from "~data/owner/mock";
import {
    setAuthCookie,
    getAuthCookie,
    removeAuthCookie,
    hasRole,
    type AuthCookieData,
} from "./authCookies";
import { UserRoles } from "~data/constants";
import { mockAuthVet } from "~data/vets/mock";

describe("authCookies utility functions", () => {
    beforeEach(() => {
        // Clear all cookies before each test
        document.cookie = "";
    });

    describe("setAuthCookie", () => {
        it("should set a cookie with user data", () => {
            setAuthCookie(mockAuthOwner);

            expect(document.cookie).toContain("auth_user");
            expect(document.cookie).toContain(
                encodeURIComponent(JSON.stringify(mockAuthOwner)),
            );
        });

        it("should set cookie with correct attributes", () => {
            setAuthCookie(mockAuthOwner);

            // Cookie should be set (we can verify it exists)
            const authCookie = getAuthCookie();
            expect(authCookie).toEqual(mockAuthOwner);
        });

        it("should encode cookie value properly", () => {
            const dataWithSpecialChars: AuthCookieData = {
                ...mockAuthOwner,
                email: "test+special@example.com",
            };

            setAuthCookie(dataWithSpecialChars);

            const retrieved = getAuthCookie();
            expect(retrieved).toEqual(dataWithSpecialChars);
        });
    });

    describe("getAuthCookie", () => {
        it("should return null when no cookie is set", () => {
            const result = getAuthCookie();
            expect(result).toBeNull();
        });

        it("should retrieve and parse cookie data correctly", () => {
            setAuthCookie(mockAuthOwner);

            const result = getAuthCookie();
            expect(result).toEqual(mockAuthOwner);
        });

        it("should return correct data for vet user", () => {
            setAuthCookie(mockAuthVet);

            const result = getAuthCookie();
            expect(result).toEqual(mockAuthVet);
        });

        it("should handle malformed cookie data gracefully", () => {
            // Set an invalid cookie manually
            document.cookie = "auth_user=invalid-json-data";

            const consoleSpy = jest
                .spyOn(console, "error")
                .mockImplementation();
            const result = getAuthCookie();

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                "Failed to parse auth cookie:",
                expect.any(Error),
            );

            consoleSpy.mockRestore();
        });

        it("should parse cookie with special characters correctly", () => {
            const dataWithSpecialChars: AuthCookieData = {
                userId: "789",
                role: UserRoles.owner,
                firstName: "José",
                lastName: "O'Brien",
                email: "jose.obrien@example.com",
            };

            setAuthCookie(dataWithSpecialChars);
            const result = getAuthCookie();

            expect(result).toEqual(dataWithSpecialChars);
        });
    });

    describe("removeAuthCookie", () => {
        it("should remove the auth cookie", () => {
            setAuthCookie(mockAuthOwner);
            expect(document.cookie).toContain("auth_user");

            removeAuthCookie();

            expect(document.cookie).not.toContain("auth_user");
        });

        it("should not throw error when removing non-existent cookie", () => {
            expect(() => removeAuthCookie()).not.toThrow();
        });

        it("should make getAuthCookie return null after removal", () => {
            setAuthCookie(mockAuthOwner);
            expect(getAuthCookie()).toEqual(mockAuthOwner);

            removeAuthCookie();

            expect(getAuthCookie()).toBeNull();
        });
    });

    describe("hasRole", () => {
        it("should return true when user has the specified role", () => {
            setAuthCookie(mockAuthOwner);

            expect(hasRole(UserRoles.owner)).toBe(true);
        });

        it("should return false when user has different role", () => {
            setAuthCookie(mockAuthOwner);

            expect(hasRole(UserRoles.vet)).toBe(false);
        });

        it("should return false when no cookie is set", () => {
            expect(hasRole(UserRoles.owner)).toBe(false);
            expect(hasRole(UserRoles.vet)).toBe(false);
        });

        it("should correctly identify vet role", () => {
            setAuthCookie(mockAuthVet);

            expect(hasRole(UserRoles.vet)).toBe(true);
            expect(hasRole(UserRoles.owner)).toBe(false);
        });
    });

    describe("Cookie persistence and overwrites", () => {
        it("should overwrite existing cookie with new data", () => {
            setAuthCookie(mockAuthOwner);
            expect(getAuthCookie()?.userId).toBe("123");

            setAuthCookie(mockAuthVet);
            const result = getAuthCookie();

            expect(result?.userId).toBe("456");
            expect(result?.role).toBe(UserRoles.vet);
        });

        it("should maintain data integrity across multiple operations", () => {
            setAuthCookie(mockAuthOwner);
            removeAuthCookie();
            setAuthCookie(mockAuthVet);

            const result = getAuthCookie();
            expect(result).toEqual(mockAuthVet);
        });
    });
});
