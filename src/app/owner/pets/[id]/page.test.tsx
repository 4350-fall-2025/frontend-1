import "@testing-library/jest-dom";
import { render, screen, waitFor } from "~tests/utils/custom-testing-library";
import { mockPets } from "~data/pets/mock";
import { mockAuthOwner } from "~data/owner/mock";
import { MOCK_DIARY_ENTRIES } from "~data/diary/mock";
import PetProfilePage from "./page";
import { setAuthCookie, removeAuthCookie } from "~util/auth/authCookies";

const mockUseRouter = jest.fn();
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockBack,
        push: mockUseRouter,
    }),
    useParams: () => ({ id: "pet123" }),
}));

const mockGetPet = jest.fn();
jest.mock("~api/petsAPI", () => ({
    PetsAPI: {
        getPet: (...args: any[]) => mockGetPet(...args),
    },
}));

const mockGetDiaryEntries = jest.fn();
jest.mock("~api/petDiaryAPI", () => ({
    PetDiaryAPI: {
        getDiaryEntries: (...args: any[]) => mockGetDiaryEntries(...args),
    },
}));

const mockGetImageURL = jest.fn();
jest.mock("../../../../firebase", () => ({
    generatePetURL: jest.fn(() => "pets/user123/pet123"),
    getImageURL: (...args: any[]) => mockGetImageURL(...args),
    signInWithBackendToken: jest.fn(() => Promise.resolve()),
}));

describe("Pet Profile Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setAuthCookie(mockAuthOwner);

        mockGetPet.mockResolvedValue(mockPets[0]);
        mockGetDiaryEntries.mockResolvedValue(MOCK_DIARY_ENTRIES);
        mockGetImageURL.mockResolvedValue("/test-image.jpg");
    });

    afterEach(() => {
        removeAuthCookie();
    });

    describe("Page rendering", () => {
        it("renders the back button", async () => {
            render(<PetProfilePage />);

            const backButton = await screen.findByRole("link", {
                name: /back to my pets/i,
            });
            expect(backButton).toBeInTheDocument();
            expect(backButton).toHaveAttribute("href", "/owner/pets/dashboard");
        });

        it("fetches and displays pet data", async () => {
            render(<PetProfilePage />);

            await waitFor(() => {
                expect(mockGetPet).toHaveBeenCalledWith("pet123");
            });

            const petName = await screen.findByText(/bella/i);
            expect(petName).toBeInTheDocument();
        });

        it("fetches and displays diary entries", async () => {
            render(<PetProfilePage />);

            await waitFor(() => {
                expect(mockGetDiaryEntries).toHaveBeenCalledWith("pet123");
            });
        });

        it("fetches pet image", async () => {
            render(<PetProfilePage />);

            await waitFor(() => {
                expect(mockGetImageURL).toHaveBeenCalled();
            });
        });
    });

    describe("Error handling", () => {
        it("displays error component when pet fetch fails", async () => {
            mockGetPet.mockRejectedValue("API Error");

            render(<PetProfilePage />);

            const errorComponent = await screen.findByText(/ruh roh/i);
            expect(errorComponent).toBeInTheDocument();
        });

        it("displays error component when diary entries fetch fails", async () => {
            mockGetDiaryEntries.mockRejectedValue("API Error");

            render(<PetProfilePage />);

            const errorComponent = await screen.findByText(/ruh roh/i);
            expect(errorComponent).toBeInTheDocument();
        });

        it("uses placeholder image when image fetch fails", async () => {
            mockGetImageURL.mockRejectedValue("API Error");

            render(<PetProfilePage />);

            await waitFor(() => {
                expect(mockGetImageURL).toHaveBeenCalled();
            });

            // Image should still render with placeholder
            const placeholderUrl = "/placeholder.jpg";
            const petImage = await screen.findByAltText("Pet profile picture");
            expect(petImage).toBeInTheDocument();
            expect(petImage).toHaveAttribute(
                "src",
                expect.stringContaining(placeholderUrl),
            );
        });

        it("displays error when user is not signed in", async () => {
            removeAuthCookie();

            render(<PetProfilePage />);

            const errorComponent = await screen.findByText(/ruh roh/i);
            expect(errorComponent).toBeInTheDocument();
        });
    });
});
