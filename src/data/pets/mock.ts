import { AnimalGroup, Pet, SterileStatus } from "src/models/pet";
import { todayDate } from "~data/constants";

const todayDateString: string = todayDate.toISOString();

export const mockPets: Pet[] = [
    {
        id: 1,
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
        id: 2,
        name: "Becca",
        birthdate: todayDateString,
        estimatedBirthdate: true,
        sex: "Female",
        animalGroup: AnimalGroup.amphibian,
        sterileStatus: SterileStatus.nonsterile,
        species: "Dog",
        breed: "Beagle",
    },
];
