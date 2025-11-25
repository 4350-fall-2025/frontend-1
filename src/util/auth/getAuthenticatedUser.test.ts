/**
 * Tests written with the help of Claude Sonnet 4.5
 */

import {
    getAuthenticatedOwner,
    getAuthenticatedVet,
} from "./getAuthenticatedUser";
import { setAuthCookie, removeAuthCookie } from "~util/auth/authCookies";
import { mockAuthOwner } from "~data/owner/mock";
import { mockAuthVet } from "~data/vets/mock";

describe("getAuthenticatedUser utilities", () => {
    beforeEach(() => {
        removeAuthCookie();
    });

    describe("getAuthenticatedOwner", () => {
        it("should return Owner instance with correct data when valid owner cookie exists", () => {
            setAuthCookie(mockAuthOwner);

            const result = getAuthenticatedOwner();

            expect(result).not.toBeNull();
            expect(result?.id).toBe("123");
            expect(result?.firstName).toBe("Test");
            expect(result?.lastName).toBe("Owner");
            expect(result?.email).toBe("test@example.com");
        });

        it("should throw error with specific error message when no cookie exists", () => {
            expect(getAuthenticatedOwner).toThrow(Error);
            expect(getAuthenticatedOwner).toThrow(
                "You must be logged in to access the full page.",
            );
        });

        it("should throw error with specific error message when user is a vet, not an owner", () => {
            setAuthCookie(mockAuthVet);

            expect(getAuthenticatedOwner).toThrow(Error);
            expect(getAuthenticatedOwner).toThrow(
                "Only owners can access this page.",
            );
        });
    });

    describe("getAuthenticatedVet", () => {
        it("should return Vet instance with correct data when valid vet cookie exists", () => {
            setAuthCookie(mockAuthVet);

            const result = getAuthenticatedVet();

            expect(result).not.toBeNull();
            expect(result?.id).toBe("456");
            expect(result?.firstName).toBe("Jane");
            expect(result?.lastName).toBe("Smith");
            expect(result?.email).toBe("jane.smith@example.com");
        });

        it("should throw error with specific error message when no cookie exists", () => {
            expect(getAuthenticatedVet).toThrow(Error);
            expect(getAuthenticatedVet).toThrow(
                "You must be logged in to access the full page.",
            );
        });

        it("should throw error with specific error message when user is an owner, not a vet", () => {
            setAuthCookie(mockAuthOwner);

            expect(getAuthenticatedVet).toThrow(Error);
            expect(getAuthenticatedVet).toThrow(
                "Only veterinarians can access this page.",
            );
        });
    });

    describe("Session state management", () => {
        it("should return error after logout (cookie removal) for owner", () => {
            setAuthCookie(mockAuthOwner);
            expect(getAuthenticatedOwner).not.toBeNull();

            removeAuthCookie();

            expect(getAuthenticatedOwner).toThrow(Error);
            expect(getAuthenticatedOwner).toThrow(
                "You must be logged in to access the full page.",
            );
        });

        it("should return error after logout (cookie removal) for vet", () => {
            setAuthCookie(mockAuthVet);
            expect(getAuthenticatedVet).not.toBeNull();

            removeAuthCookie();

            expect(getAuthenticatedVet).toThrow(Error);
            expect(getAuthenticatedVet).toThrow(
                "You must be logged in to access the full page.",
            );
        });
    });
});
