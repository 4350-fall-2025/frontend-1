/**
 * Sidebar Navigation Configuration
 *
 * Developed with assistance from Claude AI (Anthropic) for:
 * - Organizing navigation links by user type
 * - Following DRY principles with reusable configurations
 */

export interface NavLinkItem {
    label: string;
    href: string;
}

/**
 * Navigation links for pet owners
 */
export const ownerNavLinks: NavLinkItem[] = [
    {
        label: "My Pets",
        href: "/owner/pets/dashboard",
    },
    {
        label: "Appointments",
        href: "/under-construction",
    },
    {
        label: "Pet Diary",
        href: "/owner/diary/dashboard",
    },
    {
        label: "Messages",
        href: "/owner/messages",
    },
];

/**
 * Navigation links for veterinarians
 */
export const vetNavLinks: NavLinkItem[] = [
    {
        label: "Dashboard",
        href: "/vet/dashboard",
    },
    {
        label: "Appointments",
        href: "/under-construction",
    },
    {
        label: "Patients",
        href: "/under-construction",
    },
    {
        label: "Messages",
        href: "/under-construction",
    },
];
