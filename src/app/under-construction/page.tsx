/**
 * Under Construction Page
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Centered layout implementation
 * - Font integration setup
 * - Page structure
 */

"use client"; // doesn't use server

import { Button } from "@mantine/core";
import Link from "next/link";
import styles from "./page.module.scss";

/**
 * Dummy page for unfinished routes
 */
export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.heading}>
                    This page is currently under construction
                </h1>
                <p className={styles.text}>
                    We're working hard to bring this page to life. Check back
                    soon!
                </p>
                <Button
                    component={Link}
                    href='/'
                    variant='light'
                    mt='md'
                    color='blue'
                >
                    Back to Sign-in
                </Button>
            </div>
        </div>
    );
}
