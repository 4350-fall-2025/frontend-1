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
import { NavLink, Stack } from "@mantine/core";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import testLogo from "../../public/logo/testLogo.avif";
import styles from "./sidebar.module.scss";

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

    return (
        <>
            {/* Mobile toggle button - only visible on small screens */}
            <button onClick={toggleSidebar} className={styles.toggleBtn}>
                ☰ Menu
            </button>

            {/* Sidebar overlay for mobile - closes sidebar when clicked */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className={styles.overlay}
                />
            )}

            {/* Main sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                <Link href='/' className={styles.logoLink}>
                    <Image
                        src={testLogo}
                        alt='QDog Logo'
                        width={150}
                        height={150}
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                </Link>

                <Stack gap='xs'>
                    <NavLink
                        component={Link}
                        href='/dashboard'
                        label='Dashboard'
                        className={styles.navLink}
                    />
                    <NavLink
                        component={Link}
                        href='/under-construction'
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
            </aside>

            {/* Spacer for desktop - prevents content from hiding behind sidebar */}
            <div className={styles.spacer} />
        </>
    );
}
