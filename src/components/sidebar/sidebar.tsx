/**
 * Sidebar Navigation Component
 *
 * Developed with assistance from Claude AI (Anthropic) and ChatGPT for:
 * - Responsive design implementation
 * - Mobile menu toggle functionality
 * - Navigation link styling
 * - Dynamic link rendering based on user type (owner/vet)
 * - Props-based configuration following DRY principles
 */

"use client";
import Link from "next/link";
import { Button, NavLink, Stack } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import logo from "~public/logo/tennisLogo.png";
import styles from "./sidebar.module.scss";
import { useRouter } from "next/navigation";
import { signOutOfFirebase } from "src/firebase";
import { removeAuthCookie } from "~util/authCookies";

interface NavLinkItem {
    label: string;
    href: string;
}

interface SidebarProps {
    navLinks: NavLinkItem[];
    variant?: "owner" | "vet";
}

/**
 * Sidebar component for navigation:
 * Displays vertical nav links using Mantine's NavLink and Stack
 * Accepts dynamic navigation links via props
 * Responsive design: collapses on smaller screens with toggle button
 */
export default function Sidebar({ navLinks, variant = "owner" }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const router = useRouter();
    const pathname = usePathname();

    const logOut = () => {
        if (window.confirm("Are you sure you want to sign out?")) {
            removeAuthCookie();
            signOutOfFirebase();
            router.push("/");
        }
    };

    return (
        <>
            {/* Mobile toggle button - only visible on small screens */}
            <button onClick={toggleSidebar} className={styles.toggleBtn}>
                ☰ Menu
            </button>

            {/* Sidebar overlay for mobile - closes sidebar when clicked */}
            {isOpen && (
                <div
                    data-testid='sidebar-overlay'
                    onClick={() => setIsOpen(false)}
                    className={styles.overlay}
                />
            )}

            {/* Main sidebar */}
            <aside className={`${styles.sidebar} ${styles[variant]} ${isOpen ? styles.open : ""}`}>
                <div className={styles.logoLink}>
                    <Image
                        src={logo}
                        alt='QDog Logo'
                        style={{
                            width: "60%",
                            height: "auto",
                        }}
                    />
                </div>

                <Stack gap='xs'>
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.href}
                            component={Link}
                            href={link.href}
                            label={link.label}
                            className={styles.navLink}
                            active={pathname === link.href}
                        />
                    ))}
                </Stack>
                <div className={styles.bottom}>
                    <Button
                        variant='filled'
                        className={styles.button}
                        onClick={logOut}
                    >
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Spacer for desktop - prevents content from hiding behind sidebar */}
            <div className={styles.spacer} />
        </>
    );
}
