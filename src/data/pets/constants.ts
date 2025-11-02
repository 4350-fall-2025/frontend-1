import { AnimalGroup, SterileStatus } from "src/models/pet";

export const animalGroupOptions = [
    {
        value: AnimalGroup.small,
        label: "Small mammal (e.g. cat, rabbit, and mouse)",
        displayLabel: "Small mammal",
    },
    {
        value: AnimalGroup.farm,
        label: "Farm (e.g. chicken, pig, and cow)",
        displayLabel: "Farm animal",
    },
    {
        value: AnimalGroup.equine,
        label: "Equine (e.g. horse)",
        displayLabel: "Equine",
    },
    {
        value: AnimalGroup.bird,
        label: "Bird",
        displayLabel: "Bird",
    },
    {
        value: AnimalGroup.reptile,
        label: "Reptile",
        displayLabel: "Reptile",
    },
    {
        value: AnimalGroup.amphibian,
        label: "Amphibian",
        displayLabel: "Amphibian",
    },
    {
        value: AnimalGroup.fish,
        label: "Fish",
        displayLabel: "Fish",
    },
    {
        value: AnimalGroup.invertebrate,
        label: "Invertebrate",
        displayLabel: "Invertebrate",
    },
    {
        value: AnimalGroup.other,
        label: "Other",
        displayLabel: "Other",
    },
];

export const sterileOptions = [
    {
        value: SterileStatus.sterile,
        label: "Yes",
    },
    {
        value: SterileStatus.nonsterile,
        label: "No",
    },
    {
        value: SterileStatus.unknown,
        label: "Unknown",
    },
];

export const sexOptions: string[] = ["Male", "Female", "Unknown"];

// For displaying on cards/pages - uses the short label
export const getAnimalGroupDisplayLabel = (value: string): string => {
    return (
        animalGroupOptions.find((option) => option.value === value)
            ?.displayLabel || value
    );
};
