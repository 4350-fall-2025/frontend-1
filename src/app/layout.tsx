import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import { dmSans, tsukimiRounded } from "../lib/fonts";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${dmSans.variable} ${tsukimiRounded.variable}`}>
                <MantineProvider>{children}</MantineProvider>
            </body>
        </html>
    );
}
