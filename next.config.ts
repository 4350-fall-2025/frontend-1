import { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    sassOptions: {
        implementation: "sass-embedded",
    },
};

export default nextConfig;
