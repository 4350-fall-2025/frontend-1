/**
 * Sidebar Navigation Component Tests
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Testing responsive sidebar behavior
 * - Testing mobile menu toggle
 * - Testing navigation links
 * - Testing logo visibility
 * - Testing dynamic link rendering based on props
 * - Testing different user type configurations (owner/vet)
 *
 * Testing patterns and best practices from:
 * - https://testing-library.com/docs/react-testing-library/intro
 * - https://testing-library.com/docs/queries/about
 * - also referenced "signup/vet/page.test.tsx"
 */

import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "~tests/utils/custom-testing-library";
import Sidebar from "./sidebar";
import { fireEvent } from "~tests/utils/custom-testing-library";
import { ownerNavLinks, vetNavLinks } from "./sidebar-config";

/**
 * Test suites and mock functions generated with GPT-5 mini and help from:
 * https://stackoverflow.com/questions/76858797/error-invariant-expected-app-router-to-be-mounted-why-this-happened-when-using
 */
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
    usePathname: () => "/owner/dashboard",
}));

jest.mock("../../firebase", () => ({
    auth: {},
    storage: {},
    signOutOfFirebase: jest.fn(() => Promise.resolve()),
}));

window.confirm = jest.fn(() => true);

describe("Sidebar Component", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        jest.clearAllMocks();
    });

    describe("Rendering Side NavBar - Owner", () => {
        beforeEach(() => {
            render(<Sidebar navLinks={ownerNavLinks} variant='owner' />);
        });

        it("should render the sidebar", () => {
            const sidebar = screen.getByRole("complementary");
            expect(sidebar).toBeInTheDocument();
        });

        it("should render the QDog logo", () => {
            const logo = screen.getByAltText("QDog Logo");
            expect(logo).toBeInTheDocument();
        });

        it("should render all owner navigation links", () => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
            expect(screen.getByText("My Pets")).toBeInTheDocument();
            expect(screen.getByText("Appointments")).toBeInTheDocument();
            expect(screen.getByText("Pet Diary")).toBeInTheDocument();
            expect(screen.getByText("Messages")).toBeInTheDocument();
        });

        it("should render correct number of navigation links", () => {
            const navLinks = screen.getAllByRole("link");
            // ownerNavLinks has 5 links
            expect(navLinks).toHaveLength(5);
        });
    });

    describe("Rendering Side NavBar - Vet", () => {
        beforeEach(() => {
            render(<Sidebar navLinks={vetNavLinks} variant='vet' />);
        });

        it("should render all vet navigation links", () => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
            expect(screen.getByText("Appointments")).toBeInTheDocument();
            expect(screen.getByText("Patients")).toBeInTheDocument();
            expect(screen.getByText("Messages")).toBeInTheDocument();
        });

        it("should not render owner-specific links", () => {
            expect(screen.queryByText("My Pets")).not.toBeInTheDocument();
            expect(screen.queryByText("Pet Diary")).not.toBeInTheDocument();
        });

        it("should render correct number of navigation links", () => {
            const navLinks = screen.getAllByRole("link");
            // vetNavLinks has 5 links
            expect(navLinks).toHaveLength(4);
        });
    });

    describe("Navigation Links - Owner", () => {
        beforeEach(() => {
            render(<Sidebar navLinks={ownerNavLinks} variant='owner' />);
        });

        it("Dashboard link should navigate to /owner/dashboard", () => {
            const dashboardLink = screen.getByText("Dashboard").closest("a");
            expect(dashboardLink).toHaveAttribute("href", "/owner/dashboard");
        });

        it("My Pets link should navigate to /owner/pets/dashboard", () => {
            const myPetsLink = screen.getByText("My Pets").closest("a");
            expect(myPetsLink).toHaveAttribute("href", "/owner/pets/dashboard");
        });

        it("Pet Diary link should navigate to /owner/diary/dashboard", () => {
            const petDiaryLink = screen.getByText("Pet Diary").closest("a");
            expect(petDiaryLink).toHaveAttribute(
                "href",
                "/owner/diary/dashboard",
            );
        });

        it("other nav links should link to under-construction page", () => {
            const appointmentsLink = screen
                .getByText("Appointments")
                .closest("a");
            const messagesLink = screen.getByText("Messages").closest("a");

            expect(appointmentsLink).toHaveAttribute(
                "href",
                "/under-construction",
            );
            expect(messagesLink).toHaveAttribute("href", "/under-construction");
        });

        it("nav links should have navLink class styling", () => {
            const dashboardLink = screen.getByText("Dashboard");
            expect(dashboardLink.closest("a")?.className).toContain("navLink");
        });
    });

    describe("Navigation Links - Vet", () => {
        beforeEach(() => {
            render(<Sidebar navLinks={vetNavLinks} variant='vet' />);
        });

        it("Dashboard link should navigate to /vet/dashboard", () => {
            const dashboardLink = screen.getByText("Dashboard").closest("a");
            expect(dashboardLink).toHaveAttribute("href", "/vet/dashboard");
        });

        it("Patients link should navigate to under-construction", () => {
            const patientsLink = screen.getByText("Patients").closest("a");
            expect(patientsLink).toHaveAttribute("href", "/under-construction");
        });
    });

    describe("Sign Out Functionality", () => {
        beforeEach(() => {
            render(<Sidebar navLinks={ownerNavLinks} variant='owner' />);
        });

        it("Sign Out Button should navigate back to log in", () => {
            fireEvent.click(screen.getByText("Sign Out"));
            expect(window.confirm).toHaveBeenCalledWith(
                "Are you sure you want to sign out?",
            );
            expect(pushMock).toHaveBeenCalledWith("/");
        });

        it("should call signOutOfFirebase when signing out", () => {
            const signOutMock = require("../../firebase").signOutOfFirebase;
            fireEvent.click(screen.getByText("Sign Out"));
            expect(signOutMock).toHaveBeenCalled();
        });
    });

    describe("Desktop View", () => {
        beforeEach(() => {
            render(<Sidebar navLinks={ownerNavLinks} variant='owner' />);
        });

        it("logo should be visible on desktop", () => {
            const logo = screen.getByAltText("QDog Logo");
            expect(logo).toBeVisible();
        });

        it("toggle button should be present", () => {
            const toggleBtn = screen.getByRole("button", { name: /menu/i });
            expect(toggleBtn).toBeInTheDocument();
            expect(toggleBtn).toHaveClass("toggleBtn");
        });

        it("all nav links should be visible on desktop", () => {
            expect(screen.getByText("Dashboard")).toBeVisible();
            expect(screen.getByText("My Pets")).toBeVisible();
            expect(screen.getByText("Appointments")).toBeVisible();
            expect(screen.getByText("Pet Diary")).toBeVisible();
            expect(screen.getByText("Messages")).toBeVisible();
            expect(screen.getByText("Sign Out")).toBeVisible();
        });
    });

    describe("Mobile View - Toggle Functionality", () => {
        beforeEach(() => {
            render(<Sidebar navLinks={ownerNavLinks} variant='owner' />);
        });

        it("toggle button should open and close sidebar", async () => {
            const toggleBtn = screen.getByRole("button", { name: /menu/i });

            // sidebar should be closed initially
            let sidebar = screen.getByRole("complementary");
            expect(sidebar).not.toHaveClass("open");

            // open sidebar
            await user.click(toggleBtn);
            sidebar = screen.getByRole("complementary");
            expect(sidebar).toHaveClass("open");

            // close sidebar
            await user.click(toggleBtn);
            sidebar = screen.getByRole("complementary");
            expect(sidebar).not.toHaveClass("open");
        });

        it("logo should be in the document on mobile", () => {
            const logo = screen.getByAltText("QDog Logo");
            expect(logo).toBeInTheDocument();
        });

        it("should close sidebar when overlay is clicked", async () => {
            const toggleBtn = screen.getByRole("button", { name: /menu/i });

            // open sidebar first
            await user.click(toggleBtn);
            expect(screen.getByRole("complementary")).toHaveClass("open");

            // click overlay to close
            const overlay = screen.getByTestId("sidebar-overlay");
            await user.click(overlay);

            // sidebar should be closed
            expect(screen.getByRole("complementary")).not.toHaveClass("open");
        });

        it("overlay should only appear when sidebar is open", async () => {
            const toggleBtn = screen.getByRole("button", { name: /menu/i });

            // overlay should not exist initially
            expect(
                screen.queryByTestId("sidebar-overlay"),
            ).not.toBeInTheDocument();

            // open sidebar
            await user.click(toggleBtn);
            expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();

            // close sidebar
            await user.click(toggleBtn);
            expect(
                screen.queryByTestId("sidebar-overlay"),
            ).not.toBeInTheDocument();
        });

        it("should display navigation links when sidebar is open", async () => {
            const toggleBtn = screen.getByRole("button", { name: /menu/i });

            await user.click(toggleBtn);

            expect(screen.getByText("Dashboard")).toBeVisible();
            expect(screen.getByText("My Pets")).toBeVisible();
            expect(screen.getByText("Appointments")).toBeVisible();
            expect(screen.getByText("Pet Diary")).toBeVisible();
            expect(screen.getByText("Messages")).toBeVisible();
        });
    });

    describe("Accessibility", () => {
        beforeEach(() => {
            render(<Sidebar navLinks={ownerNavLinks} variant='owner' />);
        });

        it("sidebar should be a complementary landmark", () => {
            const sidebar = screen.getByRole("complementary");
            expect(sidebar).toBeInTheDocument();
        });

        it("nav links should be keyboard accessible", async () => {
            const firstLink = screen.getByText("Dashboard").closest("a");
            firstLink?.focus();
            expect(firstLink).toHaveFocus();
        });

        it("toggle button should be keyboard accessible", async () => {
            const toggleBtn = screen.getByRole("button", { name: /menu/i });
            toggleBtn.focus();
            expect(toggleBtn).toHaveFocus();

            // simulate keyboard entry
            await user.keyboard("{Enter}");
            expect(screen.getByRole("complementary")).toHaveClass("open");
        });

        it("toggle button should have descriptive text", () => {
            const toggleBtn = screen.getByRole("button", { name: /menu/i });
            expect(toggleBtn).toHaveTextContent("Menu");
        });
    });

    describe("Dynamic Link Rendering", () => {
        it("should render custom links when provided", () => {
            const customLinks = [
                { label: "Custom Link 1", href: "/custom1" },
                { label: "Custom Link 2", href: "/custom2" },
            ];

            render(<Sidebar navLinks={customLinks} />);

            expect(screen.getByText("Custom Link 1")).toBeInTheDocument();
            expect(screen.getByText("Custom Link 2")).toBeInTheDocument();
            expect(screen.getAllByRole("link")).toHaveLength(2);
        });

        it("should handle empty navLinks array", () => {
            render(<Sidebar navLinks={[]} />);

            // Should still render sidebar structure
            expect(screen.getByRole("complementary")).toBeInTheDocument();
            expect(screen.getByAltText("QDog Logo")).toBeInTheDocument();
            expect(screen.getByText("Sign Out")).toBeInTheDocument();

            // But no nav links
            expect(screen.queryAllByRole("link")).toHaveLength(0);
        });
    });
});
