import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import { Roboto, Tsukimi_Rounded } from "next/font/google";

// importing font in tsx is more efficient than in css
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["symbols"] // required
});

const tsukimiRounded = Tsukimi_Rounded({
  variable: "--font-tsukimi_rounded",
  weight: ["300", "500", "700"],
  subsets: ["latin"] // required
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${tsukimiRounded.variable}`}>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
