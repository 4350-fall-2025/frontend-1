/**
 * Sidebar Navigation Component
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Responsive design implementation
 * - Mobile menu toggle functionality
 * - Navigation link styling
 */

"use client";
import Link from "next/link";
import { Button, NavLink, Stack } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import logo from "~public/logo/tennisLogo.png";
import styles from "./sidebar.module.scss";
import { useRouter } from "next/navigation";

/**
 * Sidebar component for navigation:
 * Displays vertical nav links using Mantine's NavLink and Stack
 * Responsive design: collapses on smaller screens with toggle button
 */
export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const router = useRouter();

    const logOut = () => {
        if (window.confirm("Are you sure you want to sign out?")) {
            localStorage.clear();
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
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
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
                    <NavLink
                        component={Link}
                        href='/owner/dashboard'
                        label='Dashboard'
                        className={styles.navLink}
                    />
                    <NavLink
                        component={Link}
                        href='/owner/pets/create'
                        label='My Pets'
                        className={styles.navLink}
                    />
                    <NavLink
                        component={Link}
                        href='/under-construction'
                        label='Appointments'
                        className={styles.navLink}
                    />
                    <NavLink
                        component={Link}
                        href='/under-construction'
                        label='Pet Diary'
                        className={styles.navLink}
                    />
                    <NavLink
                        component={Link}
                        href='/under-construction'
                        label='Messages'
                        className={styles.navLink}
                    />
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
