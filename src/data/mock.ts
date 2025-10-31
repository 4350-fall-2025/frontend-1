import { Pet, AnimalGroup, SterileStatus } from "../models/pet";

export const mockPets: Pet[] = [
    new Pet({
        id: 1,
        name: "Bella",
        birthdate: new Date("2019-08-01"), // 5y 3m from today
        estimatedBirthdate: false,
        sex: "Female",
        animalGroup: AnimalGroup.small,
        species: "Dog",
        breed: "Beagle",
        sterileStatus: SterileStatus.sterile,
        photoUrl: "",
    }),

    new Pet({
        id: 2,
        name: "Tweety",
        birthdate: new Date("2024-03-01"), // 7m from today
        estimatedBirthdate: false,
        sex: "Male",
        animalGroup: AnimalGroup.bird,
        species: "Cockatiel",
        breed: "White-faced cockatiel",
        sterileStatus: SterileStatus.unknown,
        photoUrl: "",
    }),
];
