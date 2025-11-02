import { AnimalGroup, Pet, SterileStatus } from "src/models/pet";
import { todayDate } from "~data/constants";

const todayDateString: string = todayDate.toISOString();

export const mockPets: Pet[] = [
    {
        id: "pet1",
        name: "Bella",
        birthdate: "2019-08-01", // 5y 3m
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
        birthdate: "2024-03-01", // 7m
        estimatedBirthdate: true, //false,
        sex: "Female",
        animalGroup: AnimalGroup.bird,
        sterileStatus: SterileStatus.sterile,
        species: "Cockatiel",
        breed: "White-faced cockatiel",
        photoUrl: null,
    },
];
