import { fireEvent, screen } from "~tests/utils/custom-testing-library";
import {
    DEFAULT_NAME,
    DEFAULT_SPECIES,
    DEFAULT_BREED_OR_VARIETY,
} from "../defaults";

/**
 * Helper functions generated with the help of GPT-5 mini, also based on patterns in signup-form-helper.ts
 */

type NewPetFields = {
    name?: string;
    animalGroup?: string;
    species?: string;
    breedOrVariety?: string;
    sex?: string;
    spayedOrNeutered?: string;
    birthDate?: string;
    adoptionDate?: string;
};

export async function getNewPetElements() {
    const name = screen.getByLabelText(/name/i);
    const resetImageButton = screen.getByRole("button", {
        name: /reset image/i,
    });
    const pickImageButton = screen.getByRole("button", { name: /pick image/i });
    const animalGroup = screen.getByRole("textbox", { name: /animal group/i });
    const sex = screen.getByRole("textbox", { name: /sex/i });
    const spayedOrNeutered = screen.getByRole("textbox", {
        name: /spayed\/neutered/i,
    });
    const species = screen.getByLabelText(/species/i);
    const breedOrVariety = screen.queryByLabelText(/breed or variety/i);
    const birthDate = screen.getByLabelText(/date of birth/i);
    const estimatedBirthDateToggle = screen.getByLabelText(/estimated/i);
    const adoptionDate = screen.queryByLabelText(/date of adoption/i);

    return {
        name,
        resetImageButton,
        pickImageButton,
        animalGroup,
        species,
        breedOrVariety,
        birthDate,
        estimatedBirthDateToggle,
        adoptionDate,
        sex,
        spayedOrNeutered,
    };
}

// Note: this does not fill select inputs; use pickSelectDefaults for those
export async function fillNewPetDefaults(overrides?: NewPetFields) {
    const { name, species, breedOrVariety } = await getNewPetElements();

    fireEvent.change(name, {
        target: { value: overrides?.name ?? DEFAULT_NAME },
    });
    fireEvent.change(species, {
        target: { value: overrides?.species ?? DEFAULT_SPECIES },
    });
    fireEvent.change(breedOrVariety, {
        target: {
            value: overrides?.breedOrVariety ?? DEFAULT_BREED_OR_VARIETY,
        },
    });
}

/**
 * Helper to pick default Mantine select options in tests.
 *
 * @param user - userEvent instance from @testing-library/user-event
 * @param animalGroupEl - the animal group select input element
 * @param sexEl - the sex select input element
 * @param spayedEl - the spayed/neutered select input element
 * @param animalGroupText - visible text of the animal group option to pick
 * @param sexText - visible text of the sex option to pick
 * @param spayedText - visible text of the spayed/neutered option to pick
 */
export type pickSelectDefaultsOptions = {
    user: any;
    animalGroupEl: HTMLElement;
    sexEl: HTMLElement;
    spayedEl: HTMLElement;
    animalGroupText: string;
    sexText: string;
    spayedText: string;
};

export async function pickSelectDefaults(opts: pickSelectDefaultsOptions) {
    const {
        user,
        animalGroupEl,
        sexEl,
        spayedEl,
        animalGroupText,
        sexText,
        spayedText,
    } = opts;

    if (animalGroupText) {
        await user.click(animalGroupEl);
        await user.click(await screen.findByText(animalGroupText));
    }

    if (sexText) {
        await user.click(sexEl);
        await user.click(await screen.findByText(sexText));
    }

    if (spayedText) {
        await user.click(spayedEl);
        await user.click(await screen.findByText(spayedText));
    }
}

export function submitNewPet() {
    const submitBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(submitBtn);
}
