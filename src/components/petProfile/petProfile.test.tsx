/* Tests written with help from Copilot GPT-5 mini
 * Help with mocking/spying on the api taken from:
 * https://www.meticulous.ai/blog/mocking-a-javascript-class-with-jest-two-ways-to-make-it-easier#example-class-exchangerateapi-client
 **/

import "@testing-library/jest-dom";
import dayjs from "dayjs";
import { MOCK_DIARY_ENTRIES, MOCK_DIARY_ENTRY } from "~data/diary/mock";
import { render, screen } from "~tests/utils/custom-testing-library";
import { mockPets } from "~data/pets/mock";
import { mockAuthOwner } from "~data/owner/mock";
import { toSentenceCase } from "~util/strings/normalize";
import PetProfile from "./petProfile";

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

describe("Pet Profile", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Pet info", () => {
        it("renders the pet info on the page", async () => {
            await render(
                <PetProfile
                    pet={mockPets[0]}
                    diaryEntries={MOCK_DIARY_ENTRIES}
                    imageUrl='/placeholder.jpg'
                />,
            );

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
            await render(
                <PetProfile
                    pet={mockPets[0]}
                    diaryEntries={MOCK_DIARY_ENTRIES}
                    imageUrl='/placeholder.jpg'
                />,
            );

            const noEntriesMessage =
                await screen.findByText(/no notes to show/i);
            expect(noEntriesMessage).toBeInTheDocument();
        });
    });

    describe("Diary entries", () => {
        it("renders diary entries on the page", async () => {
            await render(
                <PetProfile
                    pet={mockPets[0]}
                    diaryEntries={MOCK_DIARY_ENTRIES}
                    imageUrl='/placeholder.jpg'
                />,
            );

            await expect(
                screen.findByText(toSentenceCase(MOCK_DIARY_ENTRY.contentType)),
            ).resolves.toBeInTheDocument();
        });

        it("shows placeholder when no diary entries present", async () => {
            await render(
                <PetProfile
                    pet={mockPets[0]}
                    diaryEntries={[]}
                    imageUrl='/placeholder.jpg'
                />,
            );

            const noEntriesMessage = await screen.findByText(/no entries yet/i);
            expect(noEntriesMessage).toBeInTheDocument();
        });
    });

    describe("Pet image", () => {
        it("renders pet image with correct URL", async () => {
            const testImageUrl = "/test-pet-image.jpg";
            await render(
                <PetProfile
                    pet={mockPets[0]}
                    diaryEntries={MOCK_DIARY_ENTRIES}
                    imageUrl={testImageUrl}
                />,
            );

            const petImage = await screen.findByAltText("Pet profile picture");
            expect(petImage).toBeInTheDocument();
            expect(petImage).toHaveAttribute(
                "src",
                expect.stringContaining(testImageUrl),
            );
        });
    });
});
