// Boilerplate component copied from Next.js docs:
// https://nextjs.org/docs/15/app/api-reference/file-conventions/error

"use client"; // Error boundaries must be Client Components

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./error.module.scss";

export default function Error({
    error,
}: {
    error?: Error & { digest?: string };
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    const router = useRouter();

    const handleClick = () => router.back();

    return (
        <div className={styles.error_container}>
            <div className={styles.error_heading}>
                <h1>Ruh Roh</h1>
                <h2>Something went wrong!</h2>
            </div>
            <Button variant='light' color='blue' onClick={handleClick}>
                Go to previous page
            </Button>
        </div>
    );
}
