import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import PetProfilePage from "./page";

const mockUseParams = jest.fn();
jest.mock("next/navigation", () => ({
    useParams: () => mockUseParams(),
}));

// Mock the PetProfile component since we're only testing the page wrapper
jest.mock("~components/petProfile/petProfile", () => {
    return function MockPetProfile({ id }: { id: string }) {
        return (
            <div data-testid='pet-profile-component'>
                Pet Profile with id: {id}
            </div>
        );
    };
});

describe("Pet Profile Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ id: "pet123" });
    });

    describe("Page layout", () => {
        it("renders the back button with correct link", () => {
            render(<PetProfilePage />);

            const backButton = screen.getByRole("link", {
                name: /back to my pets/i,
            });
            expect(backButton).toBeInTheDocument();
            expect(backButton).toHaveAttribute("href", "/owner/pets/dashboard");
        });

        it("renders the PetProfile component", () => {
            render(<PetProfilePage />);

            const petProfileComponent = screen.getByTestId(
                "pet-profile-component",
            );
            expect(petProfileComponent).toBeInTheDocument();
        });

        it("passes the correct pet id from params to PetProfile component", () => {
            render(<PetProfilePage />);

            const petProfileComponent = screen.getByTestId(
                "pet-profile-component",
            );
            expect(petProfileComponent).toHaveTextContent(
                "Pet Profile with id: pet123",
            );
        });
    });
});
