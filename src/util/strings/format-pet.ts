import dayjs from "dayjs";
import { toSentenceCase } from "./normalize";
import { AnimalGroup, SterileStatus } from "src/models/pet";

export const formatAgeFromDOB = (birthdate?: string): string => {
    if (!birthdate) {
        return "Unknown";
    }

    const bd = dayjs(birthdate);
    if (!bd.isValid()) {
        return "Unknown";
    }

    const now = dayjs();
    const yoa = now.diff(bd, "years");
    const moa = yoa % 12;

    const yoaString = yoa >= 1 ? yoa + " year" + (yoa > 1 ? "s" : "") : "";
    const moaString = moa >= 1 ? moa + " month" + (moa > 1 ? "s" : "") : "";

    return (
        `${yoaString}${moaString ? " " + moaString : ""}`.trim() || "< 1 month"
    );
};

export function formatAnimalGroup(group: AnimalGroup): string {
    return toSentenceCase(group.toString().replaceAll("_", " "));
}

export function formatSterileStatus(
    status: SterileStatus,
    sex: string,
): string {
    switch (status) {
        case SterileStatus.sterile:
            if (sex === "MALE") {
                return "Neutered";
            } else {
                return "Spayed";
            }
        case SterileStatus.nonsterile:
            return "No";
        case SterileStatus.unknown:
            return toSentenceCase(status.toLowerCase());
        default:
            return "N/A";
    }
}
