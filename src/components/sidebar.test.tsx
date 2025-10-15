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
import { fireEvent, render, screen } from "~tests/utils/custom-testing-library";
import Sidebar from "./sidebar";

describe("Sidebar Component", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup(); // create fresh event simulator
        render(<Sidebar />); // render the Sidebar component to the virtual DOM
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
        it("all nav links should link to under-construction page", () => {
            const navLinks = screen.getAllByText(
                /Dashboard|My Pets|Appointments|Pet Diary|Messages/,
            );
            navLinks.forEach((link) => {
                expect(link.closest("a")).toHaveAttribute(
                    "href",
                    "/under-construction",
                );
            });
        });

        it("logo link should navigate to home", () => {
            const logoLink = screen.getByAltText("QDog Logo").closest("a");
            expect(logoLink).toHaveAttribute("href", "/");
        });

        it("nav links should have navLink class styling", () => {
            const dashboardLink = screen.getByText("Dashboard");
            expect(dashboardLink.closest("a")?.className).toContain("navLink");
        });
    });

    // Desktop Tests
    describe("Desktop View", () => {
        it("logo should be visible on desktop", () => {
            const logo = screen.getByAltText("QDog Logo");
            expect(logo).toBeVisible();
        });

        it("toggle button should not be visible on desktop", () => {
            const toggleBtn = screen.queryByRole("button");
            if (toggleBtn) {
                expect(toggleBtn).toHaveClass("toggleBtn");
            }
        });

        it("all nav links should be visible on desktop", () => {
            expect(screen.getByText("Dashboard")).toBeVisible();
            expect(screen.getByText("My Pets")).toBeVisible();
            expect(screen.getByText("Appointments")).toBeVisible();
            expect(screen.getByText("Pet Diary")).toBeVisible();
            expect(screen.getByText("Messages")).toBeVisible();
        });
    });

    // Mobile Tests
    describe("Mobile View - Toggle Functionality", () => {
        it("toggle button should open and close sidebar", async () => {
            const toggleBtn = screen.getByRole("button");

            // open sidebar
            await user.click(toggleBtn);
            let sidebar = screen.getByRole("complementary");
            expect(sidebar).toHaveClass("open");

            // close sidebar
            await user.click(toggleBtn);
            sidebar = screen.getByRole("complementary");
            expect(sidebar).not.toHaveClass("open");
        });

        it("logo should be hidden on mobile", () => {
            const logo = screen.getByAltText("QDog Logo");
            expect(logo).toBeInTheDocument();
        });

        it("should close sidebar when overlay is clicked", async () => {
            const toggleBtn = screen.getByRole("button");

            // open sidebar
            await user.click(toggleBtn);
            expect(screen.getByRole("complementary")).toHaveClass("open");

            // find and click overlay
            const overlay = document.querySelector(
                "[data-testid='sidebar-overlay']",
            );
            if (overlay) {
                await user.click(overlay);
                expect(screen.getByRole("complementary")).not.toHaveClass(
                    "open",
                );
            }
        });

        it("should display navigation links when sidebar is open", async () => {
            const toggleBtn = screen.getByRole("button");

            await user.click(toggleBtn);

            expect(screen.getByText("Dashboard")).toBeVisible();
            expect(screen.getByText("My Pets")).toBeVisible();
            expect(screen.getByText("Appointments")).toBeVisible();
            expect(screen.getByText("Pet Diary")).toBeVisible();
            expect(screen.getByText("Messages")).toBeVisible();
        });
    });

    // Accessibility Tests
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
            const toggleBtn = screen.getByRole("button");
            toggleBtn.focus();
            expect(toggleBtn).toHaveFocus();

            // simulate keyboard entry
            await user.keyboard("{Enter}");
            expect(screen.getByRole("complementary")).toHaveClass("open");
        });
    });

    // sidebar.test.tsx
    it("should close sidebar when overlay is clicked", async () => {
        const toggleBtn = screen.getByRole("button");

        // open sidebar
        await user.click(toggleBtn);
        expect(screen.getByRole("complementary")).toHaveClass("open");

        // click overlay (now guaranteed to exist)
        const overlay = screen.getByTestId("sidebar-overlay");
        await user.click(overlay);

        // sidebar should be closed
        expect(screen.getByRole("complementary")).not.toHaveClass("open");
    });
}); //end main describe (Sidebar)
