// This file was developed with the help of ChatGPT
"use client";
import Link from "next/link";
import { NavLink, Stack } from "@mantine/core";
import Image, { StaticImageData } from "next/image";
import testLogo from "../../public/logo/testLogo.avif";

/**
 * Sidebar component for navigation:
 * Displays vertical nav links using Mantine's NavLink and Stack
 * Each link currently routes to a temporary "under construction" page
 */
export default function Sidebar() {
    return (
        <aside style={{ width: 220, padding: 12 }}>
            <Link href='/' style={{ marginBottom: 16 }}>
                <Image
                    src={testLogo}
                    alt='QDog Logo'
                    width={150}
                    height={150}
                ></Image>
            </Link>

            <Stack gap='xs'>
                <NavLink
                    component={Link}
                    href='/under-construction'
                    label='Dashboard'
                />
                <NavLink
                    component={Link}
                    href='/under-construction'
                    label='My Pets'
                />
                <NavLink
                    component={Link}
                    href='/under-construction'
                    label='Appointments'
                />
                <NavLink
                    component={Link}
                    href='/under-construction'
                    label='Pet Diary'
                />
                <NavLink
                    component={Link}
                    href='/under-construction'
                    label='Messages'
                />
            </Stack>
        </aside>
    );
}
