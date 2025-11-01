import { AnimalGroup, Pet, SterileStatus } from "src/models/pet";
import { todayDate } from "~data/constants";

const todayDateString: string = todayDate.toISOString();

export const mockPets: Pet[] = [
    {
        id: 1,
        name: "Bella",
        birthdate: todayDateString,
        //         birthdate: new Date("2019-08-01"), // 5y 3m
        estimatedBirthdate: true,
        sex: "Female",
        animalGroup: AnimalGroup.amphibian,
        sterileStatus: SterileStatus.nonsterile,
        species: "Dog",
        breed: "Beagle",
    },
    {
        id: 2,
        name: "Tweety",
        birthdate: todayDateString,
        //         birthdate: new Date("2024-03-01"), // 7m
        estimatedBirthdate: true, //false,
        sex: "Female",
        animalGroup: AnimalGroup.bird,
        sterileStatus: SterileStatus.sterile,
        species: "Cockatiel",
        breed: "White-faced cockatiel",
    },
];
