/* Tests written with help from Copilot GPT-5 mini
 * Help with mocking/spying on the api taken from:
 * https://www.meticulous.ai/blog/mocking-a-javascript-class-with-jest-two-ways-to-make-it-easier#example-class-exchangerateapi-client
 **/

const mockUseRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockUseRouter,
    }),
    useParams: () => ({ id: 1 }),
}));

jest.mock("~util/strings/format-pet", () => {
    const originalModule = jest.requireActual("~util/strings/format-pet");
    return {
        __esModule: true,
        ...originalModule,
        formatAgeFromDOB: jest.fn(() => {
            return "2 years";
        }),
        formatAnimalGroup: jest.fn(() => "amphibian"),
        formatSterileStatus: jest.fn(() => "Unknown"),
    };
});

const mockGetPet = jest.fn();
PetsAPI.getPet = mockGetPet;

const mockGetDiaryEntries = jest.fn();
PetDiaryAPI.getDiaryEntries = mockGetDiaryEntries;

import "@testing-library/jest-dom";
import dayjs from "dayjs";
import { PetsAPI } from "~api/petsAPI";
import { PetDiaryAPI } from "~api/petDiaryAPI";
import { MOCK_DIARY_ENTRIES, MOCK_DIARY_ENTRY } from "~data/diary/mock";
import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "~tests/utils/custom-testing-library";
import { mockPets } from "~data/pets/mock";
import { toSentenceCase } from "~util/strings/normalize";
import PetProfilePage from "./page";

describe("Pet Profile Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Pet info", () => {
        it("renders the pet info on the page", async () => {
            mockGetPet.mockResolvedValue(mockPets[0]);
            mockGetDiaryEntries.mockResolvedValue(MOCK_DIARY_ENTRIES);
            await render(<PetProfilePage />);

            const isoDateString = new Date(mockPets[0].birthdate).toISOString();
            const formattedDateString =
                dayjs(isoDateString).format("MMMM D, YYYY");

            const name = await screen.findByText(/bella/i);
            const age = await screen.findByText(/2 years/i);
            const animalGroup = await screen.findByText(/amphibian/i);
            const sterileStatus = await screen.findByText(/unknown/i);
            const breed = await screen.findByText(/beagle/i);
            const species = await screen.findByText(/dog/i);
            const sex = await screen.findByText(/female/i);
            const birthdate = await screen.findByText(formattedDateString);

            expect(name).toBeInTheDocument();
            expect(age).toBeInTheDocument();
            expect(animalGroup).toBeInTheDocument();
            expect(sterileStatus).toBeInTheDocument();
            expect(breed).toBeInTheDocument();
            expect(species).toBeInTheDocument();
            expect(sex).toBeInTheDocument();
            expect(birthdate).toBeInTheDocument();
        });

        it("show placeholder when no vet notes present", async () => {
            mockGetPet.mockResolvedValue(mockPets[0]);
            mockGetDiaryEntries.mockResolvedValue(MOCK_DIARY_ENTRIES);
            await render(<PetProfilePage />);

            const noEntriesMessage =
                await screen.findByText(/no notes to show/i);
            expect(noEntriesMessage).toBeInTheDocument();
        });

        it("renders error component on API error", async () => {
            mockGetPet.mockRejectedValue("API Error");
            await render(<PetProfilePage />);

            const errorMessage = await screen.findByText(/ruh roh/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    describe("Diary entries", () => {
        it("renders diary entries on the page", async () => {
            mockGetPet.mockResolvedValue(mockPets[0]);
            mockGetDiaryEntries.mockResolvedValue([MOCK_DIARY_ENTRY]);
            await render(<PetProfilePage />);

            await expect(
                screen.findByText(toSentenceCase(MOCK_DIARY_ENTRY.contentType)),
            ).resolves.toBeInTheDocument();
        });

        it("shows placeholder when no diary entries present", async () => {
            mockGetPet.mockResolvedValue(mockPets[0]);
            mockGetDiaryEntries.mockResolvedValue([]);
            await render(<PetProfilePage />);

            const noEntriesMessage = await screen.findByText(/no entries yet/i);
            expect(noEntriesMessage).toBeInTheDocument();
        });

        it("renders error component on API error", async () => {
            mockGetPet.mockResolvedValue(mockPets[0]);
            mockGetDiaryEntries.mockRejectedValue("API Error");
            await render(<PetProfilePage />);

            const errorMessage = await screen.findByText(/ruh roh/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });
});
