// This file was developed with the help of ChatGPT

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Sidebar from "../../components/sidebar";

import { DM_Sans, Tsukimi_Rounded } from "next/font/google";

const dmSans = DM_Sans({
    variable: "--font-dm_sans",
    subsets: ["latin"],
});

const tsukimiRounded = Tsukimi_Rounded({
    variable: "--font-tsukimi_rounded",
    weight: ["300", "500", "700"],
    subsets: ["latin"],
});

/**
 * Local layout for /under-construction route
 *  Adds the sidebar only to this section
 */
export default function UnderConstructionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className={`${dmSans.variable} ${tsukimiRounded.variable}`}>
                <MantineProvider>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "220px 1fr",
                            minHeight: "100vh",
                        }}
                    >
                        <Sidebar />
                        <main style={{ padding: 16 }}>{children}</main>
                    </div>
                </MantineProvider>
            </body>
        </html>
    );
}
