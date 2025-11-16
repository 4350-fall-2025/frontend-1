import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import userEvent from "@testing-library/user-event";
import OwnerDashboard from "./page";
import { owner } from "~data/owner/mock";
import { mockPets } from "~data/pets/mock";
import { PetsAPI } from "~api/petsAPI";

/**
 * CREDITS
 *
 * Used Claude AI (Anthropic) to assist with:
 * - Creating comprehensive test suite for owner dashboard component
 * - Setting up localStorage mocking patterns consistent with project conventions
 * - Writing tests for conditional rendering based on user data
 * - Ensuring proper component integration testing with PetDashboard
 */


// Mock the SCSS module
jest.mock("./page.module.scss", () => ({}));

// Mock the pets dashboard page module SCSS
jest.mock("../pets/dashboard/page.module.scss", () => ({}));

// Mock next/navigation
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

// Mock the pets data
jest.mock("~data/pets/mock", () => {
    const actual = jest.requireActual("../../../../data/pets/mock");
    return {
        mockPets: actual.mockPets,
    };
});

// Mock the age calculator utility
jest.mock("~util/ageCalculator", () => ({
    __esModule: true,
    default: jest.fn((birthdate: string) => {
        return "5y 3m";
    }),
}));

// Mock the placeholder image
jest.mock("~public/placeholder.jpg", () => ({
    default: { src: "/placeholder.jpg" },
}));

// Mock firebase
jest.mock("../../../../firebase", () => ({
    auth: {},
    storage: {},
    getImageURL: jest.fn(() => Promise.resolve("placeholder.jpeg")),
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

describe("Owner Dashboard page", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem("currentUser", JSON.stringify(owner));
        PetsAPI.getAllPets = jest.fn().mockResolvedValue(mockPets);
        user = userEvent.setup();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("renders", () => {
        render(<OwnerDashboard />);
        expect(
            screen.getByRole("heading", { name: /welcome back/i }),
        ).toBeInTheDocument();
    });

    describe("Welcome header", () => {
        it("displays welcome message with owner's first name", () => {
            render(<OwnerDashboard />);
            expect(
                screen.getByRole("heading", {
                    name: new RegExp(`Welcome back, ${owner.firstName}!`, "i"),
                }),
            ).toBeInTheDocument();
        });

        it("displays subtitle text", () => {
            render(<OwnerDashboard />);
            expect(
                screen.getByText("Welcome to the pet owner dashboard."),
            ).toBeInTheDocument();
        });

        it("displays welcome message without name when no user in localStorage", () => {
            localStorage.clear();
            render(<OwnerDashboard />);
            expect(
                screen.getByRole("heading", { name: /welcome back,/i }),
            ).toBeInTheDocument();
        });
    });

    describe("PetDashboard integration", () => {
        it("renders PetDashboard component content", async () => {
            render(<OwnerDashboard />);
            // Wait for pets to load
            await screen.findByText("Bella");
            expect(screen.getByText("Bella")).toBeInTheDocument();
        });

        it("does not display 'My Pets' heading (hideTitle prop)", () => {
            render(<OwnerDashboard />);
            // The "My Pets" heading should not be present
            expect(
                screen.queryByRole("heading", { name: /my pets/i }),
            ).not.toBeInTheDocument();
        });

        it("displays add new pet button from PetDashboard", async () => {
            render(<OwnerDashboard />);
            const addButton = await screen.findByRole("button", {
                name: /add a new pet/i,
            });
            expect(addButton).toBeInTheDocument();
        });

        it("navigates to create pet page when add button is clicked", async () => {
            render(<OwnerDashboard />);
            const addButton = await screen.findByRole("button", {
                name: /add a new pet/i,
            });
            await user.click(addButton);
            expect(pushMock).toHaveBeenCalledWith("/owner/pets/create");
        });
    });

    describe("Pet cards display from embedded dashboard", () => {
        beforeEach(async () => {
            render(<OwnerDashboard />);
            await screen.findByText("Bella");
        });

        it("renders all pet cards", () => {
            expect(screen.getByText("Bella")).toBeInTheDocument();
            expect(screen.getByText("Tweety")).toBeInTheDocument();
        });

        it("displays correct number of pet cards", () => {
            const petNames = screen.getAllByRole("heading", { level: 3 });
            expect(petNames).toHaveLength(2);
        });

        it("displays pet information for each pet", () => {
            const ageLabels = screen.getAllByText(/Age:/);
            const sexLabels = screen.getAllByText(/Sex:/);
            const groupLabels = screen.getAllByText(/Animal group:/);
            const speciesLabels = screen.getAllByText(/Species:/);
            const breedLabels = screen.getAllByText(/Breed\/Variety:/);

            expect(ageLabels.length).toBe(2);
            expect(sexLabels.length).toBe(2);
            expect(groupLabels.length).toBe(2);
            expect(speciesLabels.length).toBe(2);
            expect(breedLabels.length).toBe(2);
        });
    });

    describe("LocalStorage handling", () => {
        it("handles missing owner data gracefully", () => {
            localStorage.clear();
            expect(() => render(<OwnerDashboard />)).not.toThrow();
        });

        it("handles invalid JSON in localStorage", () => {
            localStorage.setItem("currentUser", "invalid-json");
            expect(() => render(<OwnerDashboard />)).not.toThrow();
        });

        it("handles owner data without firstName", () => {
            const ownerWithoutName = { ...owner, firstName: undefined };
            localStorage.setItem("currentUser", JSON.stringify(ownerWithoutName));
            render(<OwnerDashboard />);
            expect(
                screen.getByRole("heading", { name: /welcome back,/i }),
            ).toBeInTheDocument();
        });
    });

    describe("Component structure", () => {
        it("renders with dashboard_container class", () => {
            const { container } = render(<OwnerDashboard />);
            const dashboardContainer = container.querySelector(
                ".dashboard_container",
            );
            expect(dashboardContainer).toBeInTheDocument();
        });

        it("renders header with welcome_header class", () => {
            const { container } = render(<OwnerDashboard />);
            const welcomeHeader = container.querySelector(".welcome_header");
            expect(welcomeHeader).toBeInTheDocument();
        });

        it("renders pet dashboard wrapper with correct class", () => {
            const { container } = render(<OwnerDashboard />);
            const petDashboardWrapper = container.querySelector(
                ".pet_dashboard_wrapper",
            );
            expect(petDashboardWrapper).toBeInTheDocument();
        });
    });

    describe("Empty state", () => {
        it("displays no pets message when user has no pets", async () => {
            PetsAPI.getAllPets = jest.fn().mockResolvedValue([]);
            render(<OwnerDashboard />);
            const noPetsMessage = await screen.findByText(
                /no pets found. add yours now!/i,
            );
            expect(noPetsMessage).toBeInTheDocument();
        });
    });
});