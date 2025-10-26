export const animalGroupOptions: string[] = [
    "Small mammal (e.g. cat, rabbit, and mouse)",
    "Farm (e.g. chicken, pig, and cow)",
    "Equine (e.g. horse)",
    "Bird",
    "Reptile",
    "Amphibian",
    "Fish",
    "Invertebrate",
    "Other",
];

export const sexOptions: string[] = ["Male", "Female", "Unknown"];

export const mockPets = [
    {
        id: "bella",
        name: "Bella",
        age: "5y 3m",
        sex: "Female",
        group: "Small animal",
        species: "Dog",
        breed: "Beagle",
        photoUrl: "", // empty for now, shows a placeholder box
    },
    {
        id: "tweety",
        name: "Tweety",
        age: "7m",
        sex: "Male",
        group: "Bird",
        species: "Cockatiel",
        breed: "White-faced cockatiel",
        photoUrl: "",
    },
];
