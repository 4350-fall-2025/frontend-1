/**
 * Conditional Sidebar Component
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Conditional rendering based on route
 * - Hiding sidebar on signup pages
 * Reference: https://www.reddit.com/r/reactjs/comments/u05yhi/have_navbar_component_on_every_route_except_one/
 */

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";

/** Show Sidebar on every route except /signup (and /signup/...) */
export default function ConditionalSidebar() {
    const pathname = usePathname() || "/";

    // hide on /signup or /signup/anything
    const hideSidebar =
        pathname === "/signup" || pathname.startsWith("/signup/");

    // DEBUG (leave for a minute to confirm)
    console.log("[ConditionalSidebar]", { pathname, hideSidebar });

    if (hideSidebar) return null;
    return <Sidebar />;
}
