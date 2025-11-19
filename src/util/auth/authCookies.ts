// Code created with the help of Claude Sonnet 4.5
// and modified to fit project's needs

import { UserRoles } from "~data/constants";

export type UserRole = UserRoles.owner | UserRoles.vet;

export interface AuthCookieData {
    userId: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    email: string;
}

const AUTH_COOKIE_NAME = "auth_user";

/**
 * Set authentication cookie with user data
 */
export function setAuthCookie(userData: AuthCookieData): void {
    const cookieValue = JSON.stringify(userData);
    const maxAge = 24 * 60 * 60; // 1 day in seconds
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(cookieValue)}; max-age=${maxAge}; path=/; SameSite=Strict`;
}

/**
 * Get authentication data from cookie
 */
export function getAuthCookie(): AuthCookieData | null {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split("=");

        if (name === AUTH_COOKIE_NAME) {
            try {
                return JSON.parse(decodeURIComponent(value));
            } catch (error) {
                console.error("Failed to parse auth cookie:", error);
                return null;
            }
        }
    }

    return null;
}

/**
 * Remove authentication cookie (logout)
 */
export function removeAuthCookie(): void {
    document.cookie = `${AUTH_COOKIE_NAME}=; max-age=0; path=/; SameSite=Strict`;
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: UserRole): boolean {
    const authUser = getAuthCookie();
    return authUser?.role === role;
}
