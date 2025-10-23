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
const backMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
        back: backMock,
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

        it("should render the back to previous button", () => {
            const button = screen.getByRole("button", {
                name: /Back to Previous/i,
            });
            expect(button).toBeInTheDocument();
        });
    });

    describe("Button Functionality", () => {
        it("back to sign-in should link to home page", () => {
            const button = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            expect(button).toHaveAttribute("href", "/");
        });

        it("back to previous should call router.back when clicked", async () => {
            const button = screen.getByRole("button", {
                name: /Back to Previous/i,
            });
            expect(button).toBeInTheDocument();
            button.click();
            expect(backMock).toHaveBeenCalled();
        });

        it("buttons should be clickable", () => {
            const backToSignin = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            const backToPrevious = screen.getByRole("button", {
                name: /Back to Previous/i,
            });

            expect(backToSignin).toBeEnabled();
            expect(backToPrevious).toBeEnabled();
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

        it("buttons should be keyboard accessible", () => {
            const backToSignin = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            backToSignin.focus();
            expect(backToSignin).toHaveFocus();

            const backToPrevious = screen.getByRole("button", {
                name: /Back to Previous/i,
            });
            backToPrevious.focus();
            expect(backToPrevious).toHaveFocus();
        });

        it("buttons should have accessible text", () => {
            const backToSignin = screen.getByRole("link", {
                name: /Back to Sign-in/i,
            });
            expect(backToSignin).toHaveAccessibleName();

            const backToPrevious = screen.getByRole("button", {
                name: /Back to Previous/i,
            });
            expect(backToPrevious).toHaveAccessibleName();
        });

        it("heading should be visible to screen readers", () => {
            const heading = screen.getByRole("heading", {
                name: /This page is currently under construction/i,
            });
            expect(heading).toBeVisible();
        });
    });
});
