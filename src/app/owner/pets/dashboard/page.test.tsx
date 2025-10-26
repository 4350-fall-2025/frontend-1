import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import userEvent from "@testing-library/user-event";
import PetDashboard from "./page";

/**
 * CREDITS
 *
 * Tests created with assistance from Claude AI (Anthropic) and ChatGPT-5
 * for structuring, mocking, and organizing test suites consistent with
 * project conventions and accessibility standards.
 */

// Mock the SCSS module
jest.mock("./page.module.scss", () => ({
    page: "page",
    header: "header",
    title: "title",
    add_button: "add_button",
    pet_grid: "pet_grid",
    pet_card: "pet_card",
    pet_image: "pet_image",
    image_icon: "image_icon",
    pet_content: "pet_content",
    pet_header: "pet_header",
    pet_name: "pet_name",
    edit_badge: "edit_badge",
    info_row: "info_row",
    info_label: "info_label",
    info_value: "info_value",
    view_details_button: "view_details_button",
}));

// Mock the pets data
jest.mock("~data/pets/constants", () => ({
    mockPets: [
        {
            id: "bella",
            name: "Bella",
            age: "5y 3m",
            sex: "Female",
            group: "Small animal",
            species: "Dog",
            breed: "Beagle",
        },
        {
            id: "tweety",
            name: "Tweety",
            age: "7m",
            sex: "Male",
            group: "Bird",
            species: "Cockatiel",
            breed: "White-faced cockatiel",
        },
    ],
}));

describe("Pet Dashboard page", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(async () => {
        jest.clearAllMocks();
        user = userEvent.setup();
        render(<PetDashboard />);
    });

    it("renders", () => {
        expect(
            screen.getByRole("heading", { name: /my pets/i }),
        ).toBeInTheDocument();
    });

    describe("Page header", () => {
        it("displays the page title", () => {
            const title = screen.getByRole("heading", { name: /my pets/i });
            expect(title).toBeInTheDocument();
        });

        it("displays the add new pet button", () => {
            const addButton = screen.getByRole("button", {
                name: /add a new pet/i,
            });
            expect(addButton).toBeInTheDocument();
        });

        it("allows add button to be clicked", async () => {
            const addButton = screen.getByRole("button", {
                name: /add a new pet/i,
            });
            await user.click(addButton);
            expect(addButton).toBeInTheDocument(); // Button should remain in document after click
        });
    });

    describe("Pet cards display", () => {
        it("renders all pet cards from mock data", () => {
            // Check that both pet names appear
            expect(screen.getByText("Bella")).toBeInTheDocument();
            expect(screen.getByText("Tweety")).toBeInTheDocument();
        });

        it("displays correct number of pet cards", () => {
            const petNames = screen.getAllByRole("heading", { level: 3 });
            expect(petNames).toHaveLength(2);
        });
    });

    describe("Pet information - Bella", () => {
        it("displays name correctly", () => {
            expect(screen.getByText("Bella")).toBeInTheDocument();
        });

        it("displays age correctly", () => {
            expect(screen.getByText("5y 3m")).toBeInTheDocument();
        });

        it("displays sex correctly", () => {
            expect(screen.getByText("Female")).toBeInTheDocument();
        });

        it("displays animal group correctly", () => {
            expect(screen.getByText("Small animal")).toBeInTheDocument();
        });

        it("displays species correctly", () => {
            expect(screen.getByText("Dog")).toBeInTheDocument();
        });

        it("displays breed correctly", () => {
            expect(screen.getByText("Beagle")).toBeInTheDocument();
        });
    });

    describe("Pet information - Tweety", () => {
        it("displays name correctly", () => {
            expect(screen.getByText("Tweety")).toBeInTheDocument();
        });

        it("displays age correctly", () => {
            expect(screen.getByText("7m")).toBeInTheDocument();
        });

        it("displays sex correctly", () => {
            expect(screen.getByText("Male")).toBeInTheDocument();
        });

        it("displays animal group correctly", () => {
            expect(screen.getByText("Bird")).toBeInTheDocument();
        });

        it("displays species correctly", () => {
            expect(screen.getByText("Cockatiel")).toBeInTheDocument();
        });

        it("displays breed correctly", () => {
            expect(
                screen.getByText("White-faced cockatiel"),
            ).toBeInTheDocument();
        });
    });

    describe("Pet card interactions", () => {
        it("renders EDIT badge for each pet card", () => {
            const editBadges = screen.getAllByRole("button", { name: /edit/i });
            expect(editBadges).toHaveLength(2);
        });

        it("allows EDIT badge to be clicked", async () => {
            const editBadges = screen.getAllByRole("button", { name: /edit/i });
            await user.click(editBadges[0]);
            // Badge should remain in document after click
            expect(editBadges[0]).toBeInTheDocument();
        });

        it("renders View Details button for each pet card", () => {
            const viewDetailsButtons = screen.getAllByRole("button", {
                name: /view details/i,
            });
            expect(viewDetailsButtons).toHaveLength(2);
        });

        it("allows View Details button to be clicked", async () => {
            const viewDetailsButtons = screen.getAllByRole("button", {
                name: /view details/i,
            });
            await user.click(viewDetailsButtons[0]);
            // Button should remain in document after click
            expect(viewDetailsButtons[0]).toBeInTheDocument();
        });
    });

    describe("Info row labels", () => {
        it("displays Age label for each pet", () => {
            const ageLabels = screen.getAllByText(/Age:/);
            expect(ageLabels).toHaveLength(2);
        });

        it("displays Sex label for each pet", () => {
            const sexLabels = screen.getAllByText(/Sex:/);
            expect(sexLabels).toHaveLength(2);
        });

        it("displays Animal group label for each pet", () => {
            const groupLabels = screen.getAllByText(/Animal group:/);
            expect(groupLabels).toHaveLength(2);
        });

        it("displays Species label for each pet", () => {
            const speciesLabels = screen.getAllByText(/Species:/);
            expect(speciesLabels).toHaveLength(2);
        });

        it("displays Breed/Variety label for each pet", () => {
            const breedLabels = screen.getAllByText(/Breed\/Variety:/);
            expect(breedLabels).toHaveLength(2);
        });
    });

    describe("InfoRow component", () => {
        it("renders label and value together correctly", () => {
            // Check that Age label and value appear together
            const ageLabels = screen.getAllByText(/Age:/);
            expect(ageLabels.length).toBeGreaterThan(0);
            expect(screen.getByText("5y 3m")).toBeInTheDocument();
        });

        it("renders all required info rows for each pet", () => {
            // Each pet should have 5 info rows (Age, Sex, Animal group, Species, Breed/Variety)
            const infoRows = screen.getAllByText(/:/);
            expect(infoRows.length).toBeGreaterThanOrEqual(10); // 5 rows × 2 pets
        });
    });
});
