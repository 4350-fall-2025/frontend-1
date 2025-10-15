/**
 * Under Construction Layout Tests
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Testing layout structure and component rendering
 * - Verifying sidebar and main content placement
 * - Ensuring font variables and HTML attributes are applied correctly
 * - Mocking external dependencies (fonts and sidebar)
 */

import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import type { ReactNode } from "react";
import UnderConstructionLayout from "./layout";

// mock fonts so the body className concatenation is predictable
jest.mock("../../lib/fonts", () => ({
    dmSans: { variable: "dmSansVar" },
    tsukimiRounded: { variable: "tsukimiRoundedVar" },
}));

// mock Sidebar to a simple test double
jest.mock("../../components/sidebar", () => () => (
    <aside data-testid='sidebar-mock' />
));

const renderLayout = (children: ReactNode) =>
    render(<UnderConstructionLayout>{children}</UnderConstructionLayout>);

describe("UnderConstructionLayout", () => {
    // HTML and body attributes
    it("renders html/body with lang and font variables", () => {
        renderLayout(<div>child</div>);
        const html = document.querySelector("html");
        const body = document.querySelector("body");

        // ensure the language attribute & font variables are applied
        expect(html).toHaveAttribute("lang", "en");
        expect(body?.className).toContain("dmSansVar");
        expect(body?.className).toContain("tsukimiRoundedVar");
    });

    // Layout structure and child rendering
    it("renders grid with Sidebar and puts children inside <main>", () => {
        renderLayout(<div data-testid='child' />);

        //check that the grid container exists (css module class)
        const grid = document.querySelector(".layoutGrid");
        expect(grid).toBeInTheDocument();

        // sidebar mock should be rendered inside the grid
        expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();

        // verify main content container & check that it holds the children
        const main = document.querySelector("main.main");
        expect(main).toBeInTheDocument();
        expect(main).toContainElement(screen.getByTestId("child"));
    });
});
