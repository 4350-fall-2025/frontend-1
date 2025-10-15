import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import Sidebar from "~components/sidebar";
import styles from "./layout.module.scss";

import { dmSans, tsukimiRounded } from "../lib/fonts";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
