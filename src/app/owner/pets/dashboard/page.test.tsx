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
jest.mock("./page.module.scss", () => ({}));

// Mock the pets data - use actual data from the mock file
jest.mock("../../../../data/pets/mock", () => {
    const actual = jest.requireActual("../../../../data/pets/mock");
    return {
        mockPets: actual.mockPets,
    };
});

// Mock the age calculator utility
jest.mock("../../../../util/ageCalculator", () => ({
    __esModule: true,
    default: jest.fn((birthdate: string) => {
        // Simple mock that returns a fixed age for testing
        return "5y 3m";
    }),
}));

// Mock the placeholder image
jest.mock("~public/placeholder.jpg", () => ({
    default: { src: "/placeholder.jpg" },
}));

// Mock next/navigation
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

// Mock @mantine/core components
jest.mock("@mantine/core", () => ({
    Image: ({ src, alt }: { src: string; alt: string }) => (
        <img src={src} alt={alt} />
    ),
    Card: ({ children }: any) => <div data-testid='card'>{children}</div>,
    Text: ({ children }: { children: React.ReactNode }) => (
        <span>{children}</span>
    ),
    Button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
    MantineProvider: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
    ),
}));

// Mock Next.js Link
jest.mock("next/link", () => ({
    __esModule: true,
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => <a href={href}>{children}</a>,
}));

describe("Pet Dashboard page", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        jest.clearAllMocks();
        user = userEvent.setup();
    });

    it("renders", () => {
        render(<PetDashboard />);
        expect(
            screen.getByRole("heading", { name: /my pets/i }),
        ).toBeInTheDocument();
    });

    describe("Page header", () => {
        beforeEach(() => {
            render(<PetDashboard />);
        });

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

        it("navigates to create pet page when add button is clicked", async () => {
            const addButton = screen.getByRole("button", {
                name: /add a new pet/i,
            });
            await user.click(addButton);
            expect(pushMock).toHaveBeenCalledWith("/owner/pets/create");
        });
    });

    describe("Pet cards display", () => {
        beforeEach(() => {
            render(<PetDashboard />);
        });

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

    describe("Pet information display", () => {
        beforeEach(() => {
            render(<PetDashboard />);
        });

        it("displays pet information correctly", () => {
            // Verify that info rows are rendered
            const ageLabels = screen.getAllByText(/Age:/);
            const sexLabels = screen.getAllByText(/Sex:/);
            const groupLabels = screen.getAllByText(/Animal group:/);
            const speciesLabels = screen.getAllByText(/Species:/);
            const breedLabels = screen.getAllByText(/Breed\/Variety:/);

            expect(ageLabels.length).toBeGreaterThan(0);
            expect(sexLabels.length).toBeGreaterThan(0);
            expect(groupLabels.length).toBeGreaterThan(0);
            expect(speciesLabels.length).toBeGreaterThan(0);
            expect(breedLabels.length).toBeGreaterThan(0);
        });
    });

    describe("Pet card interactions", () => {
        beforeEach(() => {
            render(<PetDashboard />);
        });

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
        beforeEach(() => {
            render(<PetDashboard />);
        });

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
});
