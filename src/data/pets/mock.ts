import { AnimalGroup, Pet, SterileStatus } from "src/models/pet";
import { todayDate } from "~data/constants";

const todayDateString: string = todayDate.toISOString();

export const mockPets: Pet[] = [
    {
        id: "pet1",
        name: "Bella",
        birthdate: todayDateString,
        estimatedBirthdate: true,
        sex: "Female",
        animalGroup: AnimalGroup.amphibian,
        sterileStatus: SterileStatus.nonsterile,
        species: "Dog",
        breed: "Beagle",
    },
    {
        id: "pet2",
        name: "Bella2",
        birthdate: todayDateString,
        estimatedBirthdate: true,
        sex: "Female",
        animalGroup: AnimalGroup.amphibian,
        sterileStatus: SterileStatus.nonsterile,
        species: "Dog",
        breed: "Beagle",
    },
];
