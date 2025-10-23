/**
 * Global Route Layout
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Responsive grid system
 * - Sidebar integration
 * - Font variable configuration
 */

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { dmSans, tsukimiRounded } from "~lib/fonts";
import styles from "./layout.module.scss";

/**
 * Global layout for /under-construction route
 * Adds the sidebar to all pages except signup
 */

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className={`${dmSans.variable} ${tsukimiRounded.variable}`}>
                <MantineProvider>
                    <div className={styles.layoutGrid}>{children}</div>
                </MantineProvider>
            </body>
        </html>
    );
}
