/**
 * Tests for Pet Diary Dashboard
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PetDiaryDashboard from "./page";

// Mock router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

describe("Pet Diary Dashboard", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        jest.clearAllMocks();
        user = userEvent.setup();
        render(<PetDiaryDashboard />);
    });

    describe("Page rendering", () => {
        it("renders the page title", () => {
            expect(screen.getByText("Pet Diary")).toBeInTheDocument();
        });

        it("renders the new entry button", () => {
            const newEntryBtn = screen.getByRole("button", {
                name: /new entry/i,
            });
            expect(newEntryBtn).toBeInTheDocument();
        });

        it("renders the placeholder for diary entries", () => {
            expect(
                screen.getByText("Diary entries will appear here"),
            ).toBeInTheDocument();
        });

        it("renders the Quick Add sidebar", () => {
            expect(screen.getByText("Quick Add")).toBeInTheDocument();
        });
    });

    describe("Filter functionality", () => {
        it("renders all filter buttons", () => {
            expect(
                screen.getByRole("button", { name: "All" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Weight" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Diet" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "Behaviour" }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: "General" }),
            ).toBeInTheDocument();
        });

        it("has 'All' filter active by default", () => {
            const allButton = screen.getByRole("button", { name: "All" });
            // Check if it has the active class
            expect(allButton.className).toContain("filterBtnActive");
        });

        it("changes active filter when clicked", async () => {
            const dietButton = screen.getByRole("button", { name: "Diet" });
            await user.click(dietButton);

            // Diet button should now have active class
            expect(dietButton.className).toContain("filterBtnActive");
        });

        it("removes active class from previous filter", async () => {
            const allButton = screen.getByRole("button", { name: "All" });
            const dietButton = screen.getByRole("button", { name: "Diet" });

            // All is active initially
            expect(allButton.className).toContain("filterBtnActive");

            // Click Diet
            await user.click(dietButton);

            // All should no longer be active
            expect(allButton.className).not.toContain("filterBtnActive");
        });
    });

    describe("Sort functionality", () => {
        it("renders the sort dropdown", () => {
            expect(screen.getByText("Sort by:")).toBeInTheDocument();
            const sortSelect = screen.getByRole("combobox");
            expect(sortSelect).toBeInTheDocument();
        });

        it("has 'Newest first' selected by default", () => {
            const sortSelect = screen.getByRole(
                "combobox",
            ) as HTMLSelectElement;
            expect(sortSelect.value).toBe("Newest first");
        });

        it("renders all sort options", () => {
            expect(screen.getByText("Newest first")).toBeInTheDocument();
            expect(screen.getByText("Oldest first")).toBeInTheDocument();
            expect(screen.getByText("Pet name")).toBeInTheDocument();
        });

        it("changes sort option when selected", async () => {
            const sortSelect = screen.getByRole(
                "combobox",
            ) as HTMLSelectElement;

            await user.selectOptions(sortSelect, "Oldest first");
            expect(sortSelect.value).toBe("Oldest first");
        });
    });

    describe("Navigation", () => {
        it("navigates to create page when 'New Entry' button is clicked", async () => {
            const newEntryBtn = screen.getByRole("button", {
                name: /new entry/i,
            });
            await user.click(newEntryBtn);

            expect(pushMock).toHaveBeenCalledWith("/owner/diary/create");
        });

        it("navigates to create page without query params for regular button", async () => {
            const newEntryBtn = screen.getByRole("button", {
                name: /new entry/i,
            });
            await user.click(newEntryBtn);

            // Should NOT have any query params
            expect(pushMock).toHaveBeenCalledWith("/owner/diary/create");
            expect(pushMock).not.toHaveBeenCalledWith(
                expect.stringContaining("?noteType="),
            );
        });
    });

    describe("Quick Add buttons", () => {
        it("renders all quick add buttons", () => {
            expect(
                screen.getByRole("button", { name: /add weight entry/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /add diet entry/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /add behaviour entry/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /add general entry/i }),
            ).toBeInTheDocument();
        });

        it("navigates to create page with Measurement query param when 'Add Weight entry' is clicked", async () => {
            const weightBtn = screen.getByRole("button", {
                name: /add weight entry/i,
            });
            await user.click(weightBtn);

            expect(pushMock).toHaveBeenCalledWith(
                "/owner/diary/create?noteType=MEASUREMENT",
            );
        });

        it("navigates to create page with Diet query param when 'Add Diet entry' is clicked", async () => {
            const dietBtn = screen.getByRole("button", {
                name: /add diet entry/i,
            });
            await user.click(dietBtn);

            expect(pushMock).toHaveBeenCalledWith(
                "/owner/diary/create?noteType=DIET",
            );
        });

        it("navigates to create page with Behaviour query param when 'Add Behaviour entry' is clicked", async () => {
            const behaviourBtn = screen.getByRole("button", {
                name: /add behaviour entry/i,
            });
            await user.click(behaviourBtn);

            expect(pushMock).toHaveBeenCalledWith(
                "/owner/diary/create?noteType=BEHAVIOUR",
            );
        });

        it("navigates to create page with General query param when 'Add General entry' is clicked", async () => {
            const generalBtn = screen.getByRole("button", {
                name: /add general entry/i,
            });
            await user.click(generalBtn);

            expect(pushMock).toHaveBeenCalledWith(
                "/owner/diary/create?noteType=GENERAL",
            );
        });
    });

    describe("Integration between filters and quick add", () => {
        it("maintains filter state while using quick add buttons", async () => {
            // Change filter to Diet
            const dietFilterBtn = screen.getByRole("button", { name: "Diet" });
            await user.click(dietFilterBtn);
            expect(dietFilterBtn.className).toContain("filterBtnActive");

            // Click quick add
            const dietQuickAddBtn = screen.getByRole("button", {
                name: /add diet entry/i,
            });
            await user.click(dietQuickAddBtn);

            // Filter should still be Diet (component doesn't re-render)
            expect(dietFilterBtn.className).toContain("filterBtnActive");
        });

        it("maintains sort state while using quick add buttons", async () => {
            // Change sort
            const sortSelect = screen.getByRole(
                "combobox",
            ) as HTMLSelectElement;
            await user.selectOptions(sortSelect, "Pet name");
            expect(sortSelect.value).toBe("Pet name");

            // Click quick add
            const generalBtn = screen.getByRole("button", {
                name: /add general entry/i,
            });
            await user.click(generalBtn);

            // Sort should still be Pet name
            expect(sortSelect.value).toBe("Pet name");
        });
    });
});
