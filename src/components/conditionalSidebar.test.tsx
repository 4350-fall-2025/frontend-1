/**
 * Conditional Sidebar Component Tests
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Tests for sidebar visibility based on route pathname
 */

import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import ConditionalSidebar from "./conditionalSidebar";

// Mock the Next.js navigation hook
jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}));

// Mock the Sidebar component
jest.mock("./sidebar", () => () => (
    <aside data-testid='sidebar-mock'>Mocked Sidebar</aside>
));

const { usePathname } = require("next/navigation");

describe("ConditionalSidebar Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Sidebar visibility on different routes", () => {
        it("should render sidebar on home route", () => {
            usePathname.mockReturnValue("/");
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });

        it("should render sidebar on dashboard route", () => {
            usePathname.mockReturnValue("/dashboard/owner");
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });

        it("should render sidebar on any non-signup route", () => {
            usePathname.mockReturnValue("/under-construction");
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });

        it("should NOT render sidebar on /signup route", () => {
            usePathname.mockReturnValue("/signup");
            render(<ConditionalSidebar />);
            expect(
                screen.queryByTestId("sidebar-mock"),
            ).not.toBeInTheDocument();
        });

        it("should NOT render sidebar on /signup/vet route", () => {
            usePathname.mockReturnValue("/signup/vet");
            render(<ConditionalSidebar />);
            expect(
                screen.queryByTestId("sidebar-mock"),
            ).not.toBeInTheDocument();
        });

        it("should NOT render sidebar on any /signup/* route", () => {
            usePathname.mockReturnValue("/signup/owner");
            render(<ConditionalSidebar />);
            expect(
                screen.queryByTestId("sidebar-mock"),
            ).not.toBeInTheDocument();
        });
    });

    describe("Edge cases", () => {
        it("should handle null pathname gracefully", () => {
            usePathname.mockReturnValue(null);
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });

        it("should render sidebar on routes that contain 'signup' but don't start with it", () => {
            usePathname.mockReturnValue("/admin/signup-management");
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });
    });
});
