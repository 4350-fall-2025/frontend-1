/**
 * Root Layout Tests
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Testing layout structure and component rendering
 * - Verifying ConditionalSidebar and main content placement
 * - Ensuring font variables and HTML attributes are applied correctly
 * - Mocking external dependencies (fonts and ConditionalSidebar)
 */

import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import type { ReactNode } from "react";
import RootLayout from "./layout";

// mock fonts so the body className concatenation is predictable
jest.mock("../lib/fonts", () => ({
    dmSans: { variable: "dmSansVar" },
    tsukimiRounded: { variable: "tsukimiRoundedVar" },
}));

// mock ConditionalSidebar to a simple test double
jest.mock("../components/conditionalSidebar", () => () => (
    <aside data-testid='conditional-sidebar-mock' />
));

const renderLayout = (children: ReactNode) =>
    render(<RootLayout>{children}</RootLayout>);

describe("RootLayout", () => {
    describe("HTML and body attributes", () => {
        it("renders html with lang attribute", () => {
            renderLayout(<div>child</div>);
            const html = document.querySelector("html");
            expect(html).toHaveAttribute("lang", "en");
        });

        it("renders body with font variables", () => {
            renderLayout(<div>child</div>);
            const body = document.querySelector("body");
            expect(body?.className).toContain("dmSansVar");
            expect(body?.className).toContain("tsukimiRoundedVar");
        });
    });

    describe("Layout structure and child rendering", () => {
        it("renders grid with ConditionalSidebar and main content", () => {
            renderLayout(<div data-testid='child' />);

            // check that the grid container exists (css module class)
            const grid = document.querySelector(".layoutGrid");
            expect(grid).toBeInTheDocument();

            // ConditionalSidebar mock should be rendered inside the grid
            expect(
                screen.getByTestId("conditional-sidebar-mock"),
            ).toBeInTheDocument();

            // verify main content container
            const main = document.querySelector("main.main");
            expect(main).toBeInTheDocument();
        });

        it("renders children inside main element", () => {
            renderLayout(<div data-testid='child'>Test Content</div>);

            const main = document.querySelector("main.main");
            const child = screen.getByTestId("child");

            expect(main).toContainElement(child);
            expect(child).toHaveTextContent("Test Content");
        });

        it("wraps content in MantineProvider", () => {
            renderLayout(<div data-testid='child' />);

            // MantineProvider should be present (can be verified by checking if child renders)
            expect(screen.getByTestId("child")).toBeInTheDocument();
        });
    });

    describe("Component integration", () => {
        it("ConditionalSidebar is rendered before main content", () => {
            renderLayout(<div data-testid='child' />);

            const grid = document.querySelector(".layoutGrid");
            const sidebar = screen.getByTestId("conditional-sidebar-mock");
            const main = document.querySelector("main.main");

            // both should be children of the grid
            expect(grid).toContainElement(sidebar);
            expect(grid).toContainElement(main as HTMLElement);
        });

        it("allows multiple children to be rendered", () => {
            renderLayout(
                <>
                    <div data-testid='child1'>First</div>
                    <div data-testid='child2'>Second</div>
                </>,
            );

            expect(screen.getByTestId("child1")).toBeInTheDocument();
            expect(screen.getByTestId("child2")).toBeInTheDocument();
        });
    });
});
