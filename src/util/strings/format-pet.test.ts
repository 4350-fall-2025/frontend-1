/**
 * Generated with Copilot GPT-5 mini
 */

jest.mock("dayjs", () => {
    const actualDayjs = jest.requireActual("dayjs");
    const fixedNow = actualDayjs("2024-01-15");
    const dayjs = (arg?: string) => (arg ? actualDayjs(arg) : fixedNow);
    // copy static properties/methods from actual dayjs
    Object.assign(dayjs, actualDayjs);
    return dayjs;
});

import {
    calculateAge,
    getAnimalGroupDisplayLabel,
    formatSterileStatus,
} from "./format-pet";

import { AnimalGroup, SterileStatus } from "src/models/pet";

describe("calculateAge", () => {
    it("returns 'Unknown' when birthdate is undefined", () => {
        expect(calculateAge(undefined)).toBe("Unknown");
    });

    it("returns 'Unknown' for an invalid date string", () => {
        expect(calculateAge("not-a-date")).toBe("Unknown");
    });

    it("returns '< 1 month' for a birthdate less than 1 month ago", () => {
        expect(calculateAge("2024-01-10")).toBe("< 1 month");
    });

    it("returns only the year for exact dates", () => {
        expect(calculateAge("2023-01-15")).toBe("1 year");
    });

    it("pluralizes year", () => {
        expect(calculateAge("2022-01-15")).toBe("2 years");
    });

    it("returns year and month", () => {
        expect(calculateAge("2022-12-15")).toBe("1 year 1 month");
    });

    it("pluralizes month", () => {
        expect(calculateAge("2023-11-15")).toBe("2 months");
    });
});

describe("getAnimalGroupDisplayLabel", () => {
    it("converts enum value to sentence case", () => {
        expect(getAnimalGroupDisplayLabel(AnimalGroup.bird)).toBe("Bird");
    });

    it("replaces underscores with space", () => {
        expect(getAnimalGroupDisplayLabel(AnimalGroup.small)).toBe(
            "Small mammal",
        );
    });
});

describe("formatSterileStatus", () => {
    it("returns 'Neutered' for sterile if male", () => {
        expect(formatSterileStatus(SterileStatus.sterile, "MALE")).toBe(
            "Neutered",
        );
    });

    it("returns 'Spayed' for sterile if female", () => {
        expect(formatSterileStatus(SterileStatus.sterile, "FEMALE")).toBe(
            "Spayed",
        );
    });

    it("returns 'No' for nonsterile", () => {
        expect(formatSterileStatus(SterileStatus.nonsterile, "MALE")).toBe(
            "No",
        );
    });

    it("returns unknown for unknown status", () => {
        expect(formatSterileStatus(SterileStatus.unknown, "MALE")).toBe(
            "Unknown",
        );
    });

    it("returns 'N/A' as default value", () => {
        expect(
            formatSterileStatus("not-a-status" as SterileStatus, "MALE"),
        ).toBe("N/A");
    });
});
