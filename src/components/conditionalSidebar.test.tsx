/**
 * Conditional Sidebar Component Tests
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Tests for sidebar visibility based on route pathname
 * - Tests for query parameter handling (hideNav)
 */

import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import ConditionalSidebar from "./conditionalSidebar";

// Mock the Next.js navigation hooks
jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

// Mock the Sidebar component
jest.mock("./sidebar", () => () => (
    <aside data-testid='sidebar-mock'>Mocked Sidebar</aside>
));

const { usePathname, useSearchParams } = require("next/navigation");

describe("ConditionalSidebar Component", () => {
    beforeEach(() => {
        // Default mock: no query params
        useSearchParams.mockReturnValue({
            get: jest.fn().mockReturnValue(null),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Sidebar visibility on different routes", () => {
        it("should NOT render sidebar on root (sign-in) route", () => {
            usePathname.mockReturnValue("/");
            render(<ConditionalSidebar />);
            expect(
                screen.queryByTestId("sidebar-mock"),
            ).not.toBeInTheDocument();
        });

        it("should render sidebar on dashboard route", () => {
            usePathname.mockReturnValue("/dashboard/owner");
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });

        it("should render sidebar on under-construction route (without hideNav)", () => {
            usePathname.mockReturnValue("/under-construction");
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });

        it("should NOT render sidebar on under-construction with hideNav=true", () => {
            usePathname.mockReturnValue("/under-construction");
            useSearchParams.mockReturnValue({
                get: jest.fn((key) => (key === "hideNav" ? "true" : null)),
            });
            render(<ConditionalSidebar />);
            expect(
                screen.queryByTestId("sidebar-mock"),
            ).not.toBeInTheDocument();
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

        it("should NOT render sidebar on /signup/owner route", () => {
            usePathname.mockReturnValue("/signup/owner");
            render(<ConditionalSidebar />);
            expect(
                screen.queryByTestId("sidebar-mock"),
            ).not.toBeInTheDocument();
        });

        it("should render sidebar on /new-pet route", () => {
            usePathname.mockReturnValue("/new-pet");
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });
    });

    describe("Edge cases", () => {
        //         it("should handle null pathname gracefully", () => {
        //             usePathname.mockReturnValue(null);
        //             render(<ConditionalSidebar />);
        //             expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        //         });

        it("should render sidebar on routes that contain 'signup' but don't start with it", () => {
            usePathname.mockReturnValue("/admin/signup-management");
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });

        it("should render sidebar on under-construction when hideNav is false", () => {
            usePathname.mockReturnValue("/under-construction");
            useSearchParams.mockReturnValue({
                get: jest.fn((key) => (key === "hideNav" ? "false" : null)),
            });
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });

        it("should render sidebar on under-construction with other query params", () => {
            usePathname.mockReturnValue("/under-construction");
            useSearchParams.mockReturnValue({
                get: jest.fn((key) => (key === "other" ? "value" : null)),
            });
            render(<ConditionalSidebar />);
            expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
        });
    });
});
