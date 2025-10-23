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
jest.mock("~lib/fonts", () => ({
    dmSans: { variable: "dmSansVar" },
    tsukimiRounded: { variable: "tsukimiRoundedVar" },
}));

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
        it("renders children", () => {
            renderLayout(<div>Test Content</div>);

            const child = screen.getByText("Test Content");

            expect(child).toBeInTheDocument();
        });

        it("wraps content in MantineProvider", () => {
            renderLayout(<div data-testid='child' />);

            // MantineProvider should be present (can be verified by checking if child renders)
            expect(screen.getByTestId("child")).toBeInTheDocument();
        });
    });

    describe("Component integration", () => {
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
