/**
 * Under Construction Route Layout
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Responsive grid system
 * - Sidebar integration
 * - Font variable configuration
 */

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Sidebar from "../../components/sidebar";
import styles from "./layout.module.scss";

import { dmSans, tsukimiRounded } from "../../lib/fonts";

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
                    <div className={styles.layoutGrid}>
                        <Sidebar />
                        <main className={styles.main}>{children}</main>
                    </div>
                </MantineProvider>
            </body>
        </html>
    );
}
