// Code created with the help of Claude Sonnet 4.5

import { Owner } from "src/models/owner";
import { Vet } from "src/models/vet";
import { getAuthCookie, hasRole } from "~util/auth/authCookies";
import { UserRoles } from "~data/constants";

/**
 * Gets authenticated owner from cookie
 * Returns null owner with error message if not authenticated or not an owner
 */
export function getAuthenticatedOwner(): Owner {
    const authUser = getAuthCookie();

    if (!authUser) {
        throw new Error("You must be logged in to access the full page.");
    }

    if (!hasRole(UserRoles.owner)) {
        throw new Error("Only owners can access this page.");
    }

    const owner = new Owner({
        id: authUser.userId,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        email: authUser.email,
    });

    return owner;
}

/**
 * Gets authenticated vet from cookie
 * Returns null vet with error message if not authenticated or not a vet
 */
export function getAuthenticatedVet(): Vet {
    const authUser = getAuthCookie();

    if (!authUser) {
        throw new Error("You must be logged in to access the full page.");
    }

    if (!hasRole(UserRoles.vet)) {
        throw new Error("Only veterinarians can access this page.");
    }

    const vet = new Vet({
        id: authUser.userId,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        email: authUser.email,
    });

    return vet;
}
