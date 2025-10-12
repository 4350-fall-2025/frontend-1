// This file was developed with the help of ChatGPT
"use client"; // doesn't use server

import { Button } from "@mantine/core";
import Link from "next/link";

/**
 * Dummy page for unfinished routes
 */
export default function Page() {
    return (
        <div>
            <h1> This page is currently under construction </h1>
            <p>
                {" "}
                We’re working hard to bring this page to life. Check back
                soon!{" "}
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
    );
}
