import { AnimalGroup } from "src/models/pet";

export const animalGroupOptions = [
    {
        value: AnimalGroup.small,
        label: "Small mammal (e.g. cat, rabbit, and mouse)",
    },
    {
        value: AnimalGroup.farm,
        label: "Farm (e.g. chicken, pig, and cow)",
    },
    {
        value: AnimalGroup.equine,
        label: "Equine (e.g. horse)",
    },
    {
        value: AnimalGroup.bird,
        label: "Bird",
    },
    {
        value: AnimalGroup.reptile,
        label: "Reptile",
    },
    {
        value: AnimalGroup.amphibian,
        label: "Amphibian",
    },

    {
        value: AnimalGroup.fish,
        label: "Fish",
    },
    {
        value: AnimalGroup.invertebrate,
        label: "Invertebrate",
    },
    {
        value: AnimalGroup.other,
        label: "Other",
    },
];

export const sexOptions: string[] = ["Male", "Female", "Unknown"];
