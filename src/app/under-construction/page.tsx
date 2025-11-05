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
import { useRouter } from "next/navigation";

/**
 * Dummy page for unfinished routes
 */
export default function Page() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

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
                <div className={styles.button_group}>
                    <Button
                        variant='light'
                        mt='md'
                        color='blue'
                        onClick={handleBack}
                    >
                        Back to Previous
                    </Button>
                    <Button
                        component={Link}
                        href='/'
                        variant='light'
                        mt='md'
                        color='gray'
                    >
                        Back to Sign-in
                    </Button>
                </div>
            </div>
        </div>
    );
}
