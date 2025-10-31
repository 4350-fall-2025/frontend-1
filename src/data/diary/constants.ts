import { ContentType } from "src/models/pet-diary";

export const noteTypeOptions = [
    {
        value: ContentType.general,
        label: "General",
    },
    {
        value: ContentType.behaviour,
        label: "Behaviour",
    },
    {
        value: ContentType.diet,
        label: "Diet",
    },
    {
        value: ContentType.measurement,
        label: "Measurement",
    },
    {
        value: ContentType.other,
        label: "Other",
    },
];
