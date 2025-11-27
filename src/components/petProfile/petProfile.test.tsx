/* Tests written with help from Copilot GPT-5 mini
 * Help with mocking/spying on the api taken from:
 * https://www.meticulous.ai/blog/mocking-a-javascript-class-with-jest-two-ways-to-make-it-easier#example-class-exchangerateapi-client
 **/

import "@testing-library/jest-dom";
import dayjs from "dayjs";
import { PetsAPI } from "~api/petsAPI";
import { PetDiaryAPI } from "~api/petDiaryAPI";
import { MOCK_DIARY_ENTRY } from "~data/diary/mock";
import { render, screen } from "~tests/utils/custom-testing-library";
import { mockPets } from "~data/pets/mock";
import { mockAuthOwner } from "~data/owner/mock";
import { toSentenceCase } from "~util/strings/normalize";
import PetProfile from "./petProfile";
import { removeAuthCookie, setAuthCookie } from "~util/auth/authCookies";

const mockUseRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => mockUseRouter,
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

const mockGetImageURL = jest.fn();
jest.mock("../../firebase", () => ({
    auth: {},
    storage: {},
    generatePetURL: jest.fn(() => "pets/user123/pet123"),
    getImageURL: (...args: any[]) => mockGetImageURL(...args),
    signInWithBackendToken: jest.fn(() => Promise.resolve()),
}));

describe("Pet Profile", () => {
    const petId = "pet123";

    beforeEach(() => {
        jest.clearAllMocks();
        setAuthCookie(mockAuthOwner);
        mockGetDiaryEntries.mockResolvedValue([]);
    });

    afterEach(() => {
        removeAuthCookie();
    });

    describe("Pet info", () => {
        beforeEach(() => {
            mockGetDiaryEntries.mockResolvedValue([]);
        });

        it("renders the pet info on the page", async () => {
            mockGetPet.mockResolvedValue(mockPets[0]);
            await render(<PetProfile id={petId} />);

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
            await render(<PetProfile id={petId} />);

            const noEntriesMessage =
                await screen.findByText(/no notes to show/i);
            expect(noEntriesMessage).toBeInTheDocument();
        });

        it("renders error component on API error", async () => {
            mockGetPet.mockRejectedValue("API Error");
            await render(<PetProfile id={petId} />);

            const errorMessage = await screen.findByText(/ruh roh/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    describe("Diary entries", () => {
        beforeEach(async () => {
            mockGetPet.mockResolvedValue(mockPets[0]);
        });

        it("renders diary entries on the page", async () => {
            mockGetDiaryEntries.mockResolvedValue([MOCK_DIARY_ENTRY]);
            await render(<PetProfile id={petId} />);

            await expect(
                screen.findByText(toSentenceCase(MOCK_DIARY_ENTRY.contentType)),
            ).resolves.toBeInTheDocument();
        });

        it("shows placeholder when no diary entries present", async () => {
            mockGetDiaryEntries.mockResolvedValue([]);
            await render(<PetProfile id={petId} />);

            const noEntriesMessage = await screen.findByText(/no entries yet/i);
            expect(noEntriesMessage).toBeInTheDocument();
        });

        it("renders error component on API error", async () => {
            mockGetDiaryEntries.mockRejectedValue("API Error");
            await render(<PetProfile id={petId} />);

            const errorMessage = await screen.findByText(/ruh roh/i);
            expect(errorMessage).toBeInTheDocument();
        });
    });

    describe("Pet image", () => {
        beforeEach(() => {
            mockGetPet.mockResolvedValue(mockPets[0]);
            mockGetDiaryEntries.mockResolvedValue([]);
        });

        it("renders pet image with correct URL", async () => {
            mockGetImageURL.mockResolvedValue("/test-pet-image.jpg");
            await render(<PetProfile id={petId} />);

            const petImage = await screen.findByAltText("Pet profile picture");
            expect(petImage).toBeInTheDocument();
            expect(petImage).toHaveAttribute(
                "src",
                expect.stringContaining("/test-pet-image.jpg"),
            );
        });

        it("renders placeholder image if pet has no image", async () => {
            mockGetImageURL.mockRejectedValue("API Error");
            await render(<PetProfile id={petId} />);

            const petImage = await screen.findByAltText("Pet profile picture");
            expect(petImage).toBeInTheDocument();
            expect(petImage).toHaveAttribute(
                "src",
                expect.stringContaining("/placeholder.jpg"),
            );
        });
    });
});
