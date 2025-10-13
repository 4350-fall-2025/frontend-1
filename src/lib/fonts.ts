import { DM_Sans, Tsukimi_Rounded } from "next/font/google";

export const dmSans = DM_Sans({
    variable: "--font-dm_sans",
    subsets: ["latin"],
});

export const tsukimiRounded = Tsukimi_Rounded({
    variable: "--font-tsukimi_rounded",
    weight: ["300", "500", "700"],
    subsets: ["latin"],
});
