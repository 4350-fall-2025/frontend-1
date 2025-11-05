import { fireEvent, screen } from "~tests/utils/custom-testing-library";

/**
 * Helper functions for testing the new diary entry form, based on patterns in new-pet-form-helper.ts
 * Generated with Claude Sonnet 4.5
 */

type NewDiaryFields = {
    pet?: string;
    noteType?: string;
    notes?: string;
};

export async function getNewDiaryElements() {
    const pet = screen.getByRole("textbox", { name: /pet/i });
    const noteType = screen.getByRole("textbox", { name: /note type/i });
    const notes = screen.getByLabelText(/notes/i);
    const resetMediaButton = screen.getByRole("button", { name: /reset/i });
    const uploadMediaButton = screen.getByRole("button", { name: /upload/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const saveButton = screen.getByRole("button", { name: /save/i });

    return {
        pet,
        noteType,
        notes,
        resetMediaButton,
        uploadMediaButton,
        cancelButton,
        saveButton,
    };
}

// Note: this does not fill select inputs; use pickSelectDefaults for those
export async function fillNewDiaryDefaults(overrides?: NewDiaryFields) {
    const { notes } = await getNewDiaryElements();

    fireEvent.change(notes, {
        target: { value: overrides?.notes ?? "Default diary notes" },
    });
}

/**
 * Helper to pick default Mantine select options in tests.
 *
 * @param user - userEvent instance from @testing-library/user-event
 * @param petEl - the pet select input element
 * @param noteTypeEl - the note type select input element
 * @param petText - visible text of the pet option to pick
 * @param noteTypeText - visible text of the note type option to pick
 */
export type pickSelectDefaultsOptions = {
    user: any;
    petEl: HTMLElement;
    noteTypeEl: HTMLElement;
    petText: string;
    noteTypeText: string;
};

export async function pickSelectDefaults(opts: pickSelectDefaultsOptions) {
    const { user, petEl, noteTypeEl, petText, noteTypeText } = opts;

    if (petText) {
        await user.click(petEl);
        await user.click(await screen.findByText(petText));
    }

    if (noteTypeText) {
        await user.click(noteTypeEl);
        await user.click(await screen.findByText(noteTypeText));
    }
}

export function submitNewDiary() {
    const submitBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(submitBtn);
}

export function cancelNewDiary() {
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);
}
