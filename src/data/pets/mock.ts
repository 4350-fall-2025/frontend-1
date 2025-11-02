import { AnimalGroup, Pet, SterileStatus } from "src/models/pet";

export const mockPets: Pet[] = [
    {
        id: "pet1",
        name: "Bella",
        birthdate: new Date("2019-08-01").toISOString(),
        estimatedBirthdate: true,
        sex: "Female",
        animalGroup: AnimalGroup.amphibian,
        sterileStatus: SterileStatus.nonsterile,
        species: "Dog",
        breed: "Beagle",
        photoUrl: null,
    },
    {
        id: "pet2",
        name: "Tweety",
        birthdate: new Date("2024-03-01").toISOString(),
        estimatedBirthdate: true,
        sex: "Female",
        animalGroup: AnimalGroup.bird,
        sterileStatus: SterileStatus.sterile,
        species: "Cockatiel",
        breed: "White-faced cockatiel",
        photoUrl: null,
    },
];
