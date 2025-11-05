import { ContentType, PetDiary } from "src/models/pet-diary";
import { mockPets } from "~data/pets/mock";

export const MOCK_DIARY_ID: string = "diary123";

export const MOCK_DIARY_ENTRY: PetDiary = {
    id: MOCK_DIARY_ID,
    contentType: ContentType.general,
    contentBody: "This is a mock diary entry.",
    createTimestamp: new Date("2025-01-01"),
    pet: mockPets[0],
    media: [],
};

export const MOCK_DIARY_ENTRIES: PetDiary[] = [MOCK_DIARY_ENTRY];
