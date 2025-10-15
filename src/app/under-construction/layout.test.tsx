/**
 * Under Construction Layout Tests
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Testing layout structure and component rendering
 * - Verifying sidebar and main content placement
 * - Ensuring font variables and HTML attributes are applied correctly
 * - Mocking external dependencies (fonts and Sidebar)
 */

// app/under-construction/layout.test.tsx
import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import type { ReactNode } from "react";

// Mock fonts so the body className concatenation is predictable
jest.mock("../../lib/fonts", () => ({
    dmSans: { variable: "dmSansVar" },
    tsukimiRounded: { variable: "tsukimiRoundedVar" },
}));

// Mock Sidebar to a simple test double
jest.mock("../../components/sidebar", () => () => (
    <aside data-testid='sidebar-mock' />
));

import UnderConstructionLayout from "./layout";

const renderLayout = (children: ReactNode) =>
    render(<UnderConstructionLayout>{children}</UnderConstructionLayout>);

describe("UnderConstructionLayout", () => {
    it("renders html/body with lang and font variables", () => {
        renderLayout(<div>child</div>);
        const html = document.querySelector("html");
        const body = document.querySelector("body");

        expect(html).toHaveAttribute("lang", "en");
        expect(body?.className).toContain("dmSansVar");
        expect(body?.className).toContain("tsukimiRoundedVar");
    });

    it("renders grid with Sidebar and puts children inside <main>", () => {
        renderLayout(<div data-testid='child' />);

        // CSS modules are identity-mapped in tests, so these class names exist
        const grid = document.querySelector(".layoutGrid");
        expect(grid).toBeInTheDocument();

        expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();

        const main = document.querySelector("main.main");
        expect(main).toBeInTheDocument();
        expect(main).toContainElement(screen.getByTestId("child"));
    });
});
