// Code created with the help of Claude Sonnet 4.5

import { Owner } from "src/models/owner";
import { Vet } from "src/models/vet";
import { getAuthCookie, hasRole } from "~util/auth/authCookies";
import { UserRoles } from "~data/constants";

export interface AuthOwnerResult {
    owner: Owner | null;
    error: string | null;
}

export interface AuthVetResult {
    vet: Vet | null;
    error: string | null;
}

/**
 * Gets authenticated owner from cookie
 * Returns null owner with error message if not authenticated or not an owner
 */
export function getAuthenticatedOwner(): AuthOwnerResult {
    const authUser = getAuthCookie();

    if (!authUser) {
        return {
            owner: null,
            error: "You must be logged in to access this page.",
        };
    }

    if (!hasRole(UserRoles.owner)) {
        return {
            owner: null,
            error: "Only owners can access this page.",
        };
    }

    const owner = new Owner({
        id: authUser.userId,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        email: authUser.email,
    });

    return { owner, error: null };
}

/**
 * Gets authenticated vet from cookie
 * Returns null vet with error message if not authenticated or not a vet
 */
export function getAuthenticatedVet(): AuthVetResult {
    const authUser = getAuthCookie();

    if (!authUser) {
        return {
            vet: null,
            error: "You must be logged in to access this page.",
        };
    }

    if (!hasRole(UserRoles.vet)) {
        return {
            vet: null,
            error: "Only veterinarians can access this page.",
        };
    }

    const vet = new Vet({
        id: authUser.userId,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        email: authUser.email,
    });

    return { vet, error: null };
}
