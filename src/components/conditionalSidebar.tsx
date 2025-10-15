/**
 * Conditional Sidebar Component
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Conditional rendering based on route
 * - Hiding sidebar on signup pages
 * Reference: https://www.reddit.com/r/reactjs/comments/u05yhi/have_navbar_component_on_every_route_except_one/
 */

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Sidebar from "./sidebar";

/** Show Sidebar on every route except /signup (and /signup/...) */
export default function ConditionalSidebar() {
    const pathname = usePathname() || "/";
    const searchParams = useSearchParams();

    // hide on /signup or /signup/anything
    const isSignInOrUp = pathname === "/" || pathname.startsWith("/signup");

    // Hide sidebar on under-construction ONLY if hideNav=true
    const isForgotPassword =
        pathname === "/under-construction" &&
        searchParams.get("hideNav") === "true";

    if (isSignInOrUp || isForgotPassword) return null;
    return <Sidebar />;
}
