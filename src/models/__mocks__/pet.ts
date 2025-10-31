import { AnimalGroup, Pet, SterileStatus } from "src/models/pet";

export const MOCK_PET_ID = "pet123";
export const MOCK_PET: Pet = {
    id: MOCK_PET_ID,
    name: "Fluffy",
    animalGroup: AnimalGroup.small,
    breed: "Siamese",
    estimatedBirthdate: false,
    sex: "female",
    species: "cat",
    birthdate: "2019-01-01",
    sterileStatus: SterileStatus.unknown,
};
