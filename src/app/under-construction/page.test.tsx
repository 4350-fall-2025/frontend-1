/**
 * Under Construction Page Tests
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Testing page layout and centering
 * - Testing content rendering
 * - Testing button functionality
 * - Testing font styling
 */

import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import Page from "./page";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

describe("Under Construction Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        render(<Page />);
    });

    describe("Rendering", () => {
        it("should render the page content", () => {
            const container = screen
                .getByText(/This page is currently under construction/i)
                .closest("div");
            expect(container).toBeInTheDocument();
        });

        it("should display the main heading", () => {
            const heading = screen.getByRole("heading", {
                name: /This page is currently under construction/i,
            });
            expect(heading).toBeInTheDocument();
        });

        it("should display the subtext message", () => {
            const message = screen.getByText(
                /We're working hard to bring this page to life\. Check back soon!/i,
            );
            expect(message).toBeInTheDocument();
        });

        it("should render the back to sign-in button", () => {
            const button = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            expect(button).toBeInTheDocument();
        });
    });

    describe("Button Functionality", () => {
        it("button should link to home page", () => {
            const button = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            expect(button).toHaveAttribute("href", "/");
        });

        it("button should have Mantine button classes", () => {
            const button = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            expect(button.className).toContain("mantine-Button-root");
        });

        it("button should be clickable", () => {
            const button = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            expect(button).toBeEnabled();
        });
    });

    describe("Typography & Styling", () => {
        it("heading should have heading class", () => {
            const heading = screen.getByRole("heading", {
                name: /This page is currently under construction/i,
            });
            expect(heading).toHaveClass("heading");
        });

        it("paragraph should have text class", () => {
            const paragraph = screen.getByText(
                /We're working hard to bring this page to life\. Check back soon!/i,
            );
            expect(paragraph).toHaveClass("text");
        });

        it("container should have container class", () => {
            const heading = screen.getByRole("heading", {
                name: /This page is currently under construction/i,
            });
            const container = heading.closest(".container");
            expect(container).toBeInTheDocument();
        });

        it("content wrapper should have content class", () => {
            const heading = screen.getByRole("heading", {
                name: /This page is currently under construction/i,
            });
            const content = heading.parentElement;
            expect(content).toHaveClass("content");
        });
    });

    describe("Content Structure", () => {
        it("heading should be level 1", () => {
            const heading = screen.getByRole("heading", {
                level: 1,
                name: /This page is currently under construction/i,
            });
            expect(heading).toBeInTheDocument();
        });

        it("heading should come before paragraph", () => {
            const heading = screen.getByRole("heading", {
                name: /This page is currently under construction/i,
            });
            const paragraph = screen.getByText(
                /We're working hard to bring this page to life\. Check back soon!/i,
            );
            expect(
                heading.compareDocumentPosition(paragraph) &
                    Node.DOCUMENT_POSITION_FOLLOWING,
            ).toBeTruthy();
        });

        it("button should come after paragraph", () => {
            const paragraph = screen.getByText(
                /We're working hard to bring this page to life\. Check back soon!/i,
            );
            const button = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            expect(
                paragraph.compareDocumentPosition(button) &
                    Node.DOCUMENT_POSITION_FOLLOWING,
            ).toBeTruthy();
        });
    });

    describe("Accessibility", () => {
        it("heading should have appropriate semantic level", () => {
            const heading = screen.getByRole("heading", {
                level: 1,
                name: /This page is currently under construction/i,
            });
            expect(heading).toBeInTheDocument();
        });

        it("button should be keyboard accessible", () => {
            const button = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            button.focus();
            expect(button).toHaveFocus();
        });

        it("button should have accessible text", () => {
            const button = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            expect(button).toHaveAccessibleName();
        });

        it("heading should be visible to screen readers", () => {
            const heading = screen.getByRole("heading", {
                name: /This page is currently under construction/i,
            });
            expect(heading).toBeVisible();
        });
    });

    describe("Component Integration", () => {
        it("all elements should be present in the DOM", () => {
            expect(
                screen.getByRole("heading", {
                    name: /This page is currently under construction/i,
                }),
            ).toBeInTheDocument();

            expect(
                screen.getByText(
                    /We're working hard to bring this page to life\. Check back soon!/i,
                ),
            ).toBeInTheDocument();

            expect(
                screen.getByRole("link", {
                    name: /Back to Sign-in/i,
                }),
            ).toBeInTheDocument();
        });

        it("content should be properly nested", () => {
            const heading = screen.getByRole("heading", {
                name: /This page is currently under construction/i,
            });
            const contentDiv = heading.parentElement;
            expect(contentDiv).toHaveClass("content");

            const containerDiv = contentDiv?.parentElement;
            expect(containerDiv).toHaveClass("container");
        });
    });
});
