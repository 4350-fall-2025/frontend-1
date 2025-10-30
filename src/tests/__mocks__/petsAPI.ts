// Boilerplate copied from Jest docs: https://jestjs.io/docs/es6-class-mocks
// Further modified with GPT-5 mini

import { AnimalGroup, Pet, SterileStatus } from "src/models/pet";

export const mockPetId = "pet123";
export const mockPet: Pet = {
    id: mockPetId,
    name: "Fluffy",
    animalGroup: AnimalGroup.small,
    breed: "Siamese",
    estimatedBirthdate: false,
    sex: "female",
    species: "cat",
    birthdate: "2019-01-01",
    sterileStatus: SterileStatus.unknown,
};

const mock = jest.fn().mockImplementation(() => ({
    getPet: jest.fn().mockResolvedValue(mockPet),
}));

export default mock;
