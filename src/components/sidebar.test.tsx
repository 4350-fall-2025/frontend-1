/**
 * Sidebar Navigation Component Tests
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Testing responsive sidebar behavior
 * - Testing mobile menu toggle
 * - Testing navigation links
 * - Testing logo visibility
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

/**
 * Test suites and mock functions generated with GPT-5 mini and help from:
 * https://stackoverflow.com/questions/76858797/error-invariant-expected-app-router-to-be-mounted-why-this-happened-when-using
 */
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

window.confirm = jest.fn(() => true);

describe("Sidebar Component", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        render(<Sidebar />);
    });

    describe("Rendering Side NavBar", () => {
        it("should render the sidebar", () => {
            const sidebar = screen.getByRole("complementary");
            expect(sidebar).toBeInTheDocument();
        });

        it("should render the QDog logo", () => {
            const logo = screen.getByAltText("QDog Logo");
            expect(logo).toBeInTheDocument();
        });

        it("should render all navigation links", () => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
            expect(screen.getByText("My Pets")).toBeInTheDocument();
            expect(screen.getByText("Appointments")).toBeInTheDocument();
            expect(screen.getByText("Pet Diary")).toBeInTheDocument();
            expect(screen.getByText("Messages")).toBeInTheDocument();
        });
    });

    describe("Navigation Links", () => {
        it("Dashboard link should navigate to /owner/dashboard", () => {
            const dashboardLink = screen.getByText("Dashboard").closest("a");
            expect(dashboardLink).toHaveAttribute("href", "/owner/dashboard");
        });

        it("My Pets link should navigate to /owner/pets/create", () => {
            const myPetsLink = screen.getByText("My Pets").closest("a");
            expect(myPetsLink).toHaveAttribute("href", "/owner/pets/create");
        });

        it("Sign Out Button should navigate back to log in", () => {
            fireEvent.click(screen.getByText("Sign Out"));
            expect(window.confirm).toHaveBeenCalledWith(
                "Are you sure you want to sign out?",
            );
            expect(pushMock).toHaveBeenCalledWith("/");
        });

        it("other nav links should link to under-construction page", () => {
            const appointmentsLink = screen
                .getByText("Appointments")
                .closest("a");
            const petDiaryLink = screen.getByText("Pet Diary").closest("a");
            const messagesLink = screen.getByText("Messages").closest("a");

            expect(appointmentsLink).toHaveAttribute(
                "href",
                "/under-construction",
            );
            expect(petDiaryLink).toHaveAttribute("href", "/under-construction");
            expect(messagesLink).toHaveAttribute("href", "/under-construction");
        });

        it("nav links should have navLink class styling", () => {
            const dashboardLink = screen.getByText("Dashboard");
            expect(dashboardLink.closest("a")?.className).toContain("navLink");
        });
    });

    describe("Desktop View", () => {
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
});
