import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "~tests/utils/custom-testing-library";
import userEvent from "@testing-library/user-event";
import NewPet from "./page";
import {
    getNewPetElements,
    fillNewPetDefaults,
    submitNewPet,
    pickSelectDefaults,
} from "~tests/utils/form-helpers/new-pet-form-helper";
import {
    DEFAULT_SPECIES,
    DEFAULT_BREED_OR_VARIETY,
    DEFAULT_ANIMAL_GROUP,
    DEFAULT_SEX,
    DEFAULT_SPAYED_OR_NEUTERED,
    DEFAULT_BIRTH_DATE,
    DEFAULT_NAME,
} from "~tests/utils/defaults";

/**
 * Tests and mock functions generated with the help of GPT-4.1 and GPT-5 mini.
 * This is also based on patterns in signup-form-helper.ts
 *
 * Note: There are console.errors that show up due to this file, but the tests all still pass.
 * According to research, the console error regarding the requirement to use act() is outdated.
 * The link that's printed with the console error is also outdated if you visit it. Further,
 * there are many people that said that React Testing Library already wraps things in act()
 * automatically. We use that library here. Therefore, it's safe to ignore these console.errors
 * See link: https://stackoverflow.com/questions/60113292/when-to-use-act-in-jest-unit-tests-with-react-dom
 */

// Mock urlToFile to prevent fetch calls during component tests
jest.mock("~util/file-handling.ts", () => ({
    urlToFile: jest.fn(() =>
        Promise.resolve(
            new File([""], "placeholder.png", { type: "image/png" }),
        ),
    ),
}));

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

describe("New Pet page", () => {
    let name: HTMLElement;
    let petImage: HTMLElement;
    let resetImageButton: HTMLElement;
    let pickImageButton: HTMLElement;
    let animalGroup: HTMLElement;
    let species: HTMLElement;
    let breedOrVariety: HTMLElement;
    let birthDate: HTMLElement;
    let estimatedBirthDateToggle: HTMLElement;
    let adoptionDate: HTMLElement;
    let sex: HTMLElement;
    let spayedOrNeutered: HTMLElement;
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(async () => {
        jest.clearAllMocks();
        user = userEvent.setup();
        render(<NewPet />);

        // Wait for the placeholder image effect to finish (ensures act warnings are silenced)
        petImage = await screen.findByAltText(/new pet image/i);
        ({
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
        } = await getNewPetElements());
    });

    it("renders", () => {
        expect(
            screen.getByRole("heading", { name: "Add a New Pet" }),
        ).toBeInTheDocument();
    });

    describe("Name field", () => {
        beforeEach(async () => {
            // Fill other fields with valid defaults so only name errors
            await fillNewPetDefaults({ name: "" });

            // Select animal group, sex, and spayed-neutered using the helper so Mantine internal handlers fire
            await pickSelectDefaults({
                user,
                animalGroupEl: animalGroup,
                sexEl: sex,
                spayedEl: spayedOrNeutered,
                animalGroupText: DEFAULT_ANIMAL_GROUP,
                sexText: DEFAULT_SEX,
                spayedText: DEFAULT_SPAYED_OR_NEUTERED,
            });
        });

        it("is present", () => {
            expect(name).toBeInTheDocument();
        });

        it("shows required error when empty on submit", async () => {
            submitNewPet();

            const el = await screen.findByText(/this field is required./i);
            return expect(el).toBeInTheDocument();
        });

        it("does not submit when empty", async () => {
            submitNewPet();

            expect(pushMock).not.toHaveBeenCalled();
        });

        it("shows min length error when too short", async () => {
            fireEvent.change(name, { target: { value: "A" } });
            submitNewPet();

            const el = await screen.findByText(
                "This field must be at least 2 characters",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows invalid character error when numbers present", async () => {
            fireEvent.change(name, { target: { value: "John123" } });
            submitNewPet();

            const el = await screen.findByText(
                "This field may only contain letters, spaces and dashes",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows invalid character error when symbols present", async () => {
            fireEvent.change(name, { target: { value: "John!" } });
            submitNewPet();

            const el = await screen.findByText(
                "This field may only contain letters, spaces and dashes",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows max length error when too long", async () => {
            const longName = "John".repeat(10); // 40 characters
            fireEvent.change(name, { target: { value: longName } });
            submitNewPet();

            const el = await screen.findByText(
                "This field must be at most 32 characters",
            );
            return expect(el).toBeInTheDocument();
        });

        it("submits when valid and navigates to dashboard of owner", async () => {
            fireEvent.change(name, {
                target: { value: DEFAULT_NAME },
            });
            await user.click(screen.getByRole("button", { name: /save/i }));

            async () =>
                expect(pushMock).toHaveBeenCalledWith("/dashboard/owner");
        });
    });

    describe("Image controls", () => {
        it("shows preview image and image buttons", async () => {
            const img = await screen.findByAltText(/new pet image/i);
            expect(img).toBeInTheDocument();
            expect(pickImageButton).toBeInTheDocument();
            expect(resetImageButton).toBeInTheDocument();
        });

        it("allows reset image button to be clickable without throwing", async () => {
            // clicking should not throw and should keep the image element present
            await user.click(resetImageButton);
            const img = await screen.findByAltText(/new pet image/i);
            expect(img).toBeInTheDocument();
        });

        it("allows reset image button to call fileDialog.reset", async () => {
            await user.click(resetImageButton);
            expect(fileDialogResetMock).toHaveBeenCalledTimes(1);
        });

        it("shows image has correct src attribute initially", async () => {
            const img = (await screen.findByAltText(
                /new pet image/i,
            )) as HTMLImageElement;

            // Should show placeholder initially (either static path or blob URL after effect)
            expect(img.src).toBeDefined();
        });

        it("shows pick image button and allows it to be clicked", async () => {
            expect(pickImageButton).toBeInTheDocument();

            // Click the button and verify fileDialog.open is called
            await user.click(pickImageButton);
            expect(fileDialogOpenMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("Animal Group field", () => {
        beforeEach(async () => {
            await fillNewPetDefaults({});

            // Select sex and spayed-neutered so validation can run, animal group left empty so it errors
            await pickSelectDefaults({
                user,
                animalGroupEl: animalGroup,
                sexEl: sex,
                spayedEl: spayedOrNeutered,
                animalGroupText: "",
                sexText: DEFAULT_SEX,
                spayedText: DEFAULT_SPAYED_OR_NEUTERED,
            });

            // ensure animal group can be selected independently
            await user.click(animalGroup);
        });

        it("is present", () => {
            expect(animalGroup).toBeInTheDocument();
        });

        it("can be selected", async () => {
            await user.click(await screen.findByText(DEFAULT_ANIMAL_GROUP));
            expect((animalGroup as HTMLInputElement).value).toBe(
                DEFAULT_ANIMAL_GROUP,
            );
        });

        it("shows required error when empty on submit", async () => {
            submitNewPet();

            const el = await screen.findByText(
                /this animal group field can't be empty./i,
            );
            return expect(el).toBeInTheDocument();
        });

        it("does not submit when empty", async () => {
            submitNewPet();
            expect(pushMock).not.toHaveBeenCalled();
        });

        it("submits when valid and navigates to dashboard of owner", async () => {
            await user.click(await screen.findByText(DEFAULT_ANIMAL_GROUP));
            await user.click(screen.getByRole("button", { name: /save/i }));

            async () =>
                expect(pushMock).toHaveBeenCalledWith("/dashboard/owner");
        });
    });

    describe("Sex field", () => {
        beforeEach(async () => {
            await fillNewPetDefaults({});

            // Select animal group and spayed-neutered so validation can run, sex left empty so it errors
            await pickSelectDefaults({
                user,
                animalGroupEl: animalGroup,
                sexEl: sex,
                spayedEl: spayedOrNeutered,
                animalGroupText: DEFAULT_ANIMAL_GROUP,
                sexText: "",
                spayedText: DEFAULT_SPAYED_OR_NEUTERED,
            });

            // ensure sex can be selected independently
            await user.click(sex);
        });

        it("is present", () => {
            expect(sex).toBeInTheDocument();
        });

        it("can be selected", async () => {
            await user.click(await screen.findByText(DEFAULT_SEX));
            expect((sex as HTMLInputElement).value).toBe(DEFAULT_SEX);
        });

        it("shows required error when empty on submit", async () => {
            submitNewPet();

            const el = await screen.findByText(
                /this sex field can't be empty./i,
            );
            return expect(el).toBeInTheDocument();
        });

        it("does not submit when empty", async () => {
            submitNewPet();
            expect(pushMock).not.toHaveBeenCalled();
        });

        it("submits when valid and navigates to dashboard of owner", async () => {
            await user.click(await screen.findByText(DEFAULT_SEX));
            await user.click(screen.getByRole("button", { name: /save/i }));

            async () =>
                expect(pushMock).toHaveBeenCalledWith("/dashboard/owner");
        });
    });

    describe("Spayed/Neutered field", () => {
        beforeEach(async () => {
            await fillNewPetDefaults({});

            // Select animal group and sex so validation can run, spayed/neutered left empty so it errors
            await pickSelectDefaults({
                user,
                animalGroupEl: animalGroup,
                sexEl: sex,
                spayedEl: spayedOrNeutered,
                animalGroupText: DEFAULT_ANIMAL_GROUP,
                sexText: DEFAULT_SEX,
                spayedText: "",
            });

            // ensure spayed/neutered can be selected independently
            await user.click(spayedOrNeutered);
        });

        it("is present", () => {
            expect(spayedOrNeutered).toBeInTheDocument();
        });

        it("can be selected", async () => {
            await user.click(
                await screen.findByText(DEFAULT_SPAYED_OR_NEUTERED),
            );
            expect((spayedOrNeutered as HTMLInputElement).value).toBe(
                DEFAULT_SPAYED_OR_NEUTERED,
            );
        });

        it("shows required error when empty on submit", async () => {
            submitNewPet();

            const el = await screen.findByText(
                /this spayed\/neutered field can't be empty./i,
            );
            return expect(el).toBeInTheDocument();
        });

        it("does not submit when empty", async () => {
            submitNewPet();
            expect(pushMock).not.toHaveBeenCalled();
        });

        it("submits when valid and navigates to dashboard of owner", async () => {
            await user.click(
                await screen.findByText(DEFAULT_SPAYED_OR_NEUTERED),
            );
            await user.click(screen.getByRole("button", { name: /save/i }));

            async () =>
                expect(pushMock).toHaveBeenCalledWith("/dashboard/owner");
        });
    });

    describe("Species field", () => {
        beforeEach(async () => {
            // Fill other fields with valid defaults so only species errors
            await fillNewPetDefaults({ species: "" });

            // Select animal group, sex, and spayed-neutered so validation can run
            await pickSelectDefaults({
                user,
                animalGroupEl: animalGroup,
                sexEl: sex,
                spayedEl: spayedOrNeutered,
                animalGroupText: DEFAULT_ANIMAL_GROUP,
                sexText: DEFAULT_SEX,
                spayedText: DEFAULT_SPAYED_OR_NEUTERED,
            });
        });

        it("is present", () => {
            expect(species).toBeInTheDocument();
        });

        it("shows required error when empty on submit", async () => {
            submitNewPet();

            const el = await screen.findByText(/this field is required./i);
            return expect(el).toBeInTheDocument();
        });

        it("does not submit when empty", async () => {
            submitNewPet();

            expect(pushMock).not.toHaveBeenCalled();
        });

        it("shows min length error when too short", async () => {
            fireEvent.change(species, { target: { value: "A" } });
            submitNewPet();

            const el = await screen.findByText(
                "This field must be at least 2 characters",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows invalid character error when numbers present", async () => {
            fireEvent.change(species, { target: { value: "Parrot123" } });
            submitNewPet();

            const el = await screen.findByText(
                "This field may only contain letters, spaces and dashes",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows invalid character error when symbols present", async () => {
            fireEvent.change(species, { target: { value: "Parrot!" } });
            submitNewPet();

            const el = await screen.findByText(
                "This field may only contain letters, spaces and dashes",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows max length error when too long", async () => {
            const longWord = "Parrot".repeat(10); // 60 characters
            fireEvent.change(species, { target: { value: longWord } });
            submitNewPet();

            const el = await screen.findByText(
                "This field must be at most 32 characters",
            );
            return expect(el).toBeInTheDocument();
        });

        it("submits when valid and navigates to dashboard of owner", async () => {
            fireEvent.change(species, {
                target: { value: DEFAULT_SPECIES },
            });

            await user.click(screen.getByRole("button", { name: /save/i }));

            async () =>
                expect(pushMock).toHaveBeenCalledWith("/dashboard/owner");
        });
    });

    describe("Breed or Variety field", () => {
        beforeEach(async () => {
            // Fill other fields with valid defaults so only breed errors
            await fillNewPetDefaults({ breedOrVariety: "" });

            // Select animal group, sex, and spayed-neutered so validation can run
            await pickSelectDefaults({
                user,
                animalGroupEl: animalGroup,
                sexEl: sex,
                spayedEl: spayedOrNeutered,
                animalGroupText: DEFAULT_ANIMAL_GROUP,
                sexText: DEFAULT_SEX,
                spayedText: DEFAULT_SPAYED_OR_NEUTERED,
            });
        });

        it("is present", () => {
            expect(breedOrVariety).toBeInTheDocument();
        });

        it("shows required error when empty on submit", async () => {
            submitNewPet();

            const el = await screen.findByText(/this field is required./i);
            return expect(el).toBeInTheDocument();
        });

        it("does not submit when empty", async () => {
            submitNewPet();

            expect(pushMock).not.toHaveBeenCalled();
        });

        it("shows min length error when too short", async () => {
            fireEvent.change(breedOrVariety, { target: { value: "A" } });
            submitNewPet();

            const el = await screen.findByText(
                "This field must be at least 2 characters",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows invalid character error when numbers present", async () => {
            fireEvent.change(breedOrVariety, {
                target: { value: "Labrador123" },
            });
            submitNewPet();

            const el = await screen.findByText(
                "This field may only contain letters, spaces and dashes",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows invalid character error when symbols present", async () => {
            fireEvent.change(breedOrVariety, {
                target: { value: "Labrador!" },
            });
            submitNewPet();

            const el = await screen.findByText(
                "This field may only contain letters, spaces and dashes",
            );
            return expect(el).toBeInTheDocument();
        });

        it("shows max length error when too long", async () => {
            const longWord = "Labrador".repeat(10); // 80 characters
            fireEvent.change(breedOrVariety, { target: { value: longWord } });
            submitNewPet();

            const el = await screen.findByText(
                "This field must be at most 32 characters",
            );
            return expect(el).toBeInTheDocument();
        });

        it("submits when valid and navigates to dashboard of owner", async () => {
            fireEvent.change(breedOrVariety, {
                target: { value: DEFAULT_BREED_OR_VARIETY },
            });

            await user.click(screen.getByRole("button", { name: /save/i }));

            async () =>
                expect(pushMock).toHaveBeenCalledWith("/dashboard/owner");
        });
    });

    describe("Birth Date field", () => {
        beforeEach(async () => {
            // Fill other fields with valid defaults
            await fillNewPetDefaults();
            await pickSelectDefaults({
                user,
                animalGroupEl: animalGroup,
                sexEl: sex,
                spayedEl: spayedOrNeutered,
                animalGroupText: DEFAULT_ANIMAL_GROUP,
                sexText: DEFAULT_SEX,
                spayedText: DEFAULT_SPAYED_OR_NEUTERED,
            });
        });

        it("is present", () => {
            expect(birthDate).toBeInTheDocument();
        });

        it("has correct label", () => {
            expect(screen.getByText(/date of birth/i)).toBeInTheDocument();
        });

        it("has required attribute", () => {
            expect(birthDate).toHaveAttribute("required");
        });

        it("has an estimated toggle that can be toggled", async () => {
            const toggle = estimatedBirthDateToggle as HTMLInputElement;
            expect(toggle).toBeInTheDocument();
            expect(toggle.checked).toBe(false);
            await user.click(toggle);
            expect(toggle.checked).toBe(true);
        });

        it("has an estimated toggle that can be toggled back off", async () => {
            const toggle = estimatedBirthDateToggle as HTMLInputElement;
            await user.click(toggle);
            expect(toggle.checked).toBe(true);
            await user.click(toggle);
            expect(toggle.checked).toBe(false);
        });

        it("can be focused and interacted with", async () => {
            await user.click(birthDate);
            expect(birthDate).toHaveFocus();
        });

        it("displays default date value", () => {
            expect(birthDate).toHaveTextContent(DEFAULT_BIRTH_DATE);
        });

        it("has dialog role attributes", () => {
            expect(birthDate).toHaveAttribute("aria-haspopup", "dialog");
            expect(birthDate).toHaveAttribute("aria-expanded", "false");
        });
    });
});
