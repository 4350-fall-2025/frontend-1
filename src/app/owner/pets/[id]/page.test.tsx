/* Tests written with help from Copilot GPT-5 mini
 * Help with mocking/spying on the api taken from:
 * https://www.meticulous.ai/blog/mocking-a-javascript-class-with-jest-two-ways-to-make-it-easier#example-class-exchangerateapi-client
 **/

const mockUseRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockUseRouter,
    }),
    useParams: () => ({ id: MOCK_PET_ID }),
}));

jest.mock("~util/strings/format-pet", () => {
    const originalModule = jest.requireActual("~util/strings/format-pet");
    return {
        __esModule: true,
        ...originalModule,
        formatAgeFromDOB: jest.fn(() => {
            return "2 years";
        }),
    };
});

import "@testing-library/jest-dom";
import { MOCK_PET, MOCK_PET_ID } from "src/models/__mocks__/pet";
import { render, screen } from "~tests/utils/custom-testing-library";
import PetProfilePage from "./page";
import { PetsAPI } from "~api/petsAPI";

describe("Pet Profile Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the pet info on the page", async () => {
        jest.spyOn(PetsAPI, "getPet").mockResolvedValue(MOCK_PET);
        await render(<PetProfilePage />);

        const name = await screen.findByText(/fluffy/i);
        const age = await screen.findByText(/2 years/i);
        const animalGroup = await screen.findByText(/Small mammal/i);
        const sterileStatus = await screen.findByText(/Unknown/i);
        const breed = await screen.findByText(/Siamese/i);
        const species = await screen.findByText(/Cat/i);
        const sex = await screen.findByText(/Female/i);
        const birthdate = await screen.findByText(/January 1, 2019/i);

        expect(name).toBeInTheDocument();
        expect(age).toBeInTheDocument();
        expect(animalGroup).toBeInTheDocument();
        expect(sterileStatus).toBeInTheDocument();
        expect(breed).toBeInTheDocument();
        expect(species).toBeInTheDocument();
        expect(sex).toBeInTheDocument();
        expect(birthdate).toBeInTheDocument();
    });

    it("show message when no diary entries present", async () => {
        jest.spyOn(PetsAPI, "getPet").mockResolvedValue(MOCK_PET);
        await render(<PetProfilePage />);

        const noEntriesMessage = await screen.findByText(/no entries yet/i);
        expect(noEntriesMessage).toBeInTheDocument();
    });

    it("show message when no vet notes present", async () => {
        jest.spyOn(PetsAPI, "getPet").mockResolvedValue(MOCK_PET);
        await render(<PetProfilePage />);

        const noEntriesMessage = await screen.findByText(/no notes to show/i);
        expect(noEntriesMessage).toBeInTheDocument();
    });

    it("renders error component on API error", async () => {
        jest.spyOn(PetsAPI, "getPet").mockRejectedValue("API Error");
        await render(<PetProfilePage />);

        const errorMessage = await screen.findByText(/ruh roh/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
