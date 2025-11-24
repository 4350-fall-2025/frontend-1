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

            expect(result.error).toBeNull();
            expect(result.owner).not.toBeNull();
            expect(result.owner?.id).toBe("123");
            expect(result.owner?.firstName).toBe("Test");
            expect(result.owner?.lastName).toBe("Owner");
            expect(result.owner?.email).toBe("test@example.com");
        });

        it("should return specific error message when no cookie exists", () => {
            const result = getAuthenticatedOwner();

            expect(result.owner).toBeNull();
            expect(result.error).toBe(
                "You must be logged in to access the full page.",
            );
        });

        it("should return specific error message when user is a vet, not an owner", () => {
            setAuthCookie(mockAuthVet);

            const result = getAuthenticatedOwner();

            expect(result.owner).toBeNull();
            expect(result.error).toBe("Only owners can access this page.");
        });
    });

    describe("getAuthenticatedVet", () => {
        it("should return Vet instance with correct data when valid vet cookie exists", () => {
            setAuthCookie(mockAuthVet);

            const result = getAuthenticatedVet();

            expect(result.error).toBeNull();
            expect(result.vet).not.toBeNull();
            expect(result.vet?.id).toBe("456");
            expect(result.vet?.firstName).toBe("Jane");
            expect(result.vet?.lastName).toBe("Smith");
            expect(result.vet?.email).toBe("jane.smith@example.com");
        });

        it("should return specific error message when no cookie exists", () => {
            const result = getAuthenticatedVet();

            expect(result.vet).toBeNull();
            expect(result.error).toBe(
                "You must be logged in to access the full page.",
            );
        });

        it("should return specific error message when user is an owner, not a vet", () => {
            setAuthCookie(mockAuthOwner);

            const result = getAuthenticatedVet();

            expect(result.vet).toBeNull();
            expect(result.error).toBe(
                "Only veterinarians can access this page.",
            );
        });
    });

    describe("Role-based access control", () => {
        it("should prevent vet from accessing owner-only functions", () => {
            setAuthCookie(mockAuthVet);

            const ownerResult = getAuthenticatedOwner();

            expect(ownerResult.owner).toBeNull();
            expect(ownerResult.error).toBe("Only owners can access this page.");
        });

        it("should prevent owner from accessing vet-only functions", () => {
            setAuthCookie(mockAuthOwner);
            const vetResult = getAuthenticatedVet();

            expect(vetResult.vet).toBeNull();
            expect(vetResult.error).toBe(
                "Only veterinarians can access this page.",
            );
        });
    });

    describe("Session state management", () => {
        it("should return error after logout (cookie removal) for owner", () => {
            setAuthCookie(mockAuthOwner);
            expect(getAuthenticatedOwner().owner).not.toBeNull();

            removeAuthCookie();
            const result = getAuthenticatedOwner();

            expect(result.owner).toBeNull();
            expect(result.error).toBe(
                "You must be logged in to access the full page.",
            );
        });

        it("should return error after logout (cookie removal) for vet", () => {
            setAuthCookie(mockAuthVet);
            expect(getAuthenticatedVet().vet).not.toBeNull();

            removeAuthCookie();
            const result = getAuthenticatedVet();

            expect(result.vet).toBeNull();
            expect(result.error).toBe(
                "You must be logged in to access the full page.",
            );
        });
    });
});
