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

import "@testing-library/jest-dom";
import dayjs from "dayjs";
import { render, screen } from "~tests/utils/custom-testing-library";
import PetProfilePage from "./page";
import { PetsAPI } from "~api/petsAPI";
import { mockPets } from "~data/pets/mock";
import { todayDate } from "~data/constants";

describe("Pet Profile Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the pet info on the page", async () => {
        jest.spyOn(PetsAPI, "getPet").mockResolvedValue(mockPets[0]);
        await render(<PetProfilePage />);

        const formattedDateString = dayjs(todayDate.toISOString()).format(
            "MMMM D, YYYY",
        );

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

    it("show message when no diary entries present", async () => {
        jest.spyOn(PetsAPI, "getPet").mockResolvedValue(mockPets[0]);
        await render(<PetProfilePage />);

        const noEntriesMessage = await screen.findByText(/no entries yet/i);
        expect(noEntriesMessage).toBeInTheDocument();
    });

    it("show message when no vet notes present", async () => {
        jest.spyOn(PetsAPI, "getPet").mockResolvedValue(mockPets[0]);
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
