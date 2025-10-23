import type { Config } from "jest";
import nextJest from "next/jest.js";

/**
 * Boilerplate can be found at:
 * https://nextjs.org/docs/app/guides/testing/jest
 */

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/data/**",
        "!src/tests/**",
    ],
    coverageProvider: "babel",
    moduleNameMapper: {
        "^\\~app/(.*)$": "<rootDir>/src/app/$1",
        "^\\~components/(.*)$": "<rootDir>/src/components/$1",
        "^\\~data/(.*)$": "<rootDir>/src/data/$1",
        "^\\~lib/(.*)$": "<rootDir>/src/lib/$1",
        "^\\~tests/(.*)$": "<rootDir>/src/tests/$1",
        "^\\~util/(.*)$": "<rootDir>/src/util/$1",
    },
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
