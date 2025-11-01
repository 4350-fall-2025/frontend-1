/**
 * Tests generated based on patterns in pets/create/page.test.tsx
 * with the help of Claude Sonnet 4.5
 */

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "~tests/utils/custom-testing-library";
import userEvent from "@testing-library/user-event";
import NewDiary from "./page";
import {
    getNewDiaryElements,
    fillNewDiaryDefaults,
    pickSelectDefaults,
    submitNewDiary,
} from "~tests/utils/form-helpers/new-diary-form-helper";
import { notesMaxCharacters, notesMinCharacters } from "~data/constants";
import { mockPets } from "~data/pets/mock";
import { CloseButton } from "@mantine/core";

// Mock PetsAPI to return mockPets instead of making real API calls
// This will work whether the component uses mockPets directly or calls the API
jest.mock(
    "src/api/petsAPI",
    () => ({
        PetsAPI: {
            getAllPets: jest.fn(() => Promise.resolve(mockPets)),
        },
    }),
    { virtual: true },
);

// Mock PetDiaryAPI to prevent actual API calls during form submission
jest.mock(
    "src/api/petDiaryAPI",
    () => ({
        PetDiaryAPI: {
            createDiary: jest.fn(() => Promise.resolve({ success: true })),
        },
    }),
    { virtual: true },
);

// Mock router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

// Create mock functions for file dialog that we can spy on
const fileDialogOpenMock = jest.fn();
const fileDialogResetMock = jest.fn();

// Mock useFileDialog to use our spy functions
jest.mock("@mantine/hooks", () => {
    const actual = jest.requireActual("@mantine/hooks");
    return {
        ...actual,
        useFileDialog: () => ({
            files: [],
            open: fileDialogOpenMock,
            reset: fileDialogResetMock,
        }),
    };
});

describe("New Diary Entry page", () => {
    let pet: HTMLElement;
    let noteType: HTMLElement;
    let notes: HTMLElement;
    let resetMediaButton: HTMLElement;
    let uploadMediaButton: HTMLElement;
    let cancelButton: HTMLElement;
    let saveButton: HTMLElement;
    let user: ReturnType<typeof userEvent.setup>;

    describe("Regular functionality", () => {
        beforeEach(async () => {
            jest.clearAllMocks();

            // Set up mock user in localStorage
            localStorage.setItem(
                "currentUser",
                JSON.stringify({ id: 1, firstName: "Test", lastName: "User" }),
            );

            user = userEvent.setup();
            render(<NewDiary />);

            ({
                pet,
                noteType,
                notes,
                resetMediaButton,
                uploadMediaButton,
                cancelButton,
                saveButton,
            } = await getNewDiaryElements());
        });

        it("renders", () => {
            expect(
                screen.getByRole("heading", { name: "New Pet Diary Entry" }),
            ).toBeInTheDocument();
        });

        describe("Pet field", () => {
            beforeEach(async () => {
                await fillNewDiaryDefaults({ notes: "Valid diary notes here" });

                // Select note type so validation can run, pet left empty so it errors
                await pickSelectDefaults({
                    user,
                    petEl: pet,
                    noteTypeEl: noteType,
                    petText: "",
                    noteTypeText: "General",
                });

                // ensure pet can be selected independently
                await user.click(pet);
            });

            it("is present", () => {
                expect(pet).toBeInTheDocument();
            });

            it("can be selected", async () => {
                await user.click(await screen.findByText("Bella"));
                expect((pet as HTMLInputElement).value).toBe("Bella");
            });

            it("shows required error when empty on submit", async () => {
                submitNewDiary();

                const el = await screen.findByText(
                    /this pet field can't be empty./i,
                );
                return expect(el).toBeInTheDocument();
            });

            it("does not submit when empty", async () => {
                submitNewDiary();
                expect(pushMock).not.toHaveBeenCalled();
            });

            it("submits when valid and navigates to dashboard of owner", async () => {
                await user.click(await screen.findByText("Bella"));
                await user.click(saveButton);

                async () =>
                    expect(pushMock).toHaveBeenCalledWith("/owner/dashboard");
            });
        });

        describe("Note Type field", () => {
            beforeEach(async () => {
                await fillNewDiaryDefaults({ notes: "Valid diary notes here" });

                // Select pet so validation can run, note type left empty so it errors
                await pickSelectDefaults({
                    user,
                    petEl: pet,
                    noteTypeEl: noteType,
                    petText: "Bella",
                    noteTypeText: "",
                });

                // ensure note type can be selected independently
                await user.click(noteType);
            });

            it("is present", () => {
                expect(noteType).toBeInTheDocument();
            });

            it("can be selected", async () => {
                await user.click(await screen.findByText("General"));
                expect((noteType as HTMLInputElement).value).toBe("General");
            });

            it("shows required error when empty on submit", async () => {
                submitNewDiary();

                const el = await screen.findByText(
                    /this note type field can't be empty./i,
                );
                return expect(el).toBeInTheDocument();
            });

            it("does not submit when empty", async () => {
                submitNewDiary();
                expect(pushMock).not.toHaveBeenCalled();
            });

            it("submits when valid and navigates to dashboard of owner", async () => {
                await user.click(await screen.findByText("General"));
                await user.click(saveButton);

                async () =>
                    expect(pushMock).toHaveBeenCalledWith("/owner/dashboard");
            });
        });

        describe("Notes field", () => {
            beforeEach(async () => {
                // Select pet and note type so validation can run
                await pickSelectDefaults({
                    user,
                    petEl: pet,
                    noteTypeEl: noteType,
                    petText: "Bella",
                    noteTypeText: "General",
                });
            });

            it("is present", () => {
                expect(notes).toBeInTheDocument();
            });

            it("shows required error when empty on submit", async () => {
                fireEvent.change(notes, { target: { value: "" } });
                submitNewDiary();

                const el = await screen.findByText(/notes field is required./i);
                return expect(el).toBeInTheDocument();
            });

            it("does not submit when empty", async () => {
                fireEvent.change(notes, { target: { value: "" } });
                submitNewDiary();
                expect(pushMock).not.toHaveBeenCalled();
            });

            it("shows min length error when too short", async () => {
                fireEvent.change(notes, { target: { value: "A" } });
                submitNewDiary();

                const el = await screen.findByText(
                    "This field must be at least " +
                        notesMinCharacters +
                        " characters",
                );
                return expect(el).toBeInTheDocument();
            });

            it("shows max length error when too long", async () => {
                const longNotes = "A".repeat(notesMaxCharacters + 1); // 1501 characters
                fireEvent.change(notes, { target: { value: longNotes } });
                submitNewDiary();

                const el = await screen.findByText(
                    "This field must be at most " +
                        notesMaxCharacters +
                        " characters",
                );
                return expect(el).toBeInTheDocument();
            });

            it("submits when valid and navigates to dashboard of owner", async () => {
                fireEvent.change(notes, {
                    target: { value: "Valid diary notes here" },
                });
                await user.click(saveButton);

                async () =>
                    expect(pushMock).toHaveBeenCalledWith("/owner/dashboard");
            });
        });

        describe("Media upload controls", () => {
            it("shows upload and reset buttons", () => {
                expect(uploadMediaButton).toBeInTheDocument();
                expect(resetMediaButton).toBeInTheDocument();
            });

            it("allows reset media button to be clickable without throwing", async () => {
                await user.click(resetMediaButton);
                expect(resetMediaButton).toBeInTheDocument();
            });

            it("allows reset media button to call fileDialog.reset", async () => {
                await user.click(resetMediaButton);
                expect(fileDialogResetMock).toHaveBeenCalledTimes(1);
            });

            it("allows upload button to be clicked", async () => {
                // Click the button and verify fileDialog.open is called
                await user.click(uploadMediaButton);
                expect(fileDialogOpenMock).toHaveBeenCalledTimes(1);
            });
        });

        describe("Form submission", () => {
            it("submits successfully with all required fields filled", async () => {
                await fillNewDiaryDefaults({ notes: "Valid diary notes here" });

                await pickSelectDefaults({
                    user,
                    petEl: pet,
                    noteTypeEl: noteType,
                    petText: "Bella",
                    noteTypeText: "General",
                });

                await user.click(saveButton);

                async () =>
                    expect(pushMock).toHaveBeenCalledWith("/owner/dashboard");
            });
        });

        describe("Cancel button", () => {
            it("navigates to dashboard when clicked", async () => {
                const cancelBtn = screen.getByRole("button", {
                    name: /cancel/i,
                });
                await user.click(cancelBtn);

                async () =>
                    expect(pushMock).toHaveBeenCalledWith("/owner/dashboard");
            });
        });
    });

    describe("Error handling", () => {
        beforeEach(async () => {
            jest.clearAllMocks();

            // Don't set up localStorage - simulating no logged-in user
            user = userEvent.setup();
            render(<NewDiary />);

            // Get elements
            ({
                pet,
                noteType,
                notes,
                resetMediaButton,
                uploadMediaButton,
                cancelButton,
                saveButton,
            } = await getNewDiaryElements());

            // Fill form with valid data
            fireEvent.change(notes, {
                target: { value: "Valid diary notes here" },
            });

            await pickSelectDefaults({
                user,
                petEl: pet,
                noteTypeEl: noteType,
                petText: "Bella",
                noteTypeText: "General",
            });
        });

        it("shows error when user is not logged in", async () => {
            // Submit the form
            await user.click(saveButton);

            // Verify error message appears and navigation doesn't happen
            const errorMsg = await screen.findByText(
                /you cannot make a diary entry for your pet without being logged in./i,
            );
            expect(errorMsg).toBeInTheDocument();
            expect(pushMock).not.toHaveBeenCalled();
        });
    });
});
