import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import {
    DEFAULT_EMAIL,
    DEFAULT_FIRST_NAME,
    DEFAULT_LAST_NAME,
    DEFAULT_PASSWORD,
} from "~tests/utils/defaults";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "~tests/utils/custom-testing-library";
import {
    getSignupElements,
    fillSignupWithDefaults,
    submitSignup,
} from "~tests/utils/form-helpers";
import VetSignup from "./page";
import { VetsAPI } from "src/api/VetsAPI";
/**
 * Test suites and mock functions generated with GPT-5 mini and help from:
 * https://stackoverflow.com/questions/76858797/error-invariant-expected-app-router-to-be-mounted-why-this-happened-when-using
 */
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

// jest.mock("src/api/VetsAPI", () => ({
//     VetsAPI: {
//         vetSignUp: jest.fn(),
//     },
// }));

// Some strange errors caused by scrollIntoView when testing password happy path
// possibly due to open listboxs in Mantine Select component
// Debugged with help from copilot
HTMLElement.prototype.scrollIntoView = jest.fn();

describe("Vet signup page", () => {
    const DEFAULT_PROVINCE = "MB";
    const DEFAULT_LICENSE_ID = "VET123";

    let firstName: HTMLElement;
    let lastName: HTMLElement;
    let email: HTMLElement;
    let password: HTMLElement;
    let licenseId: HTMLElement;
    let province: HTMLElement;
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        jest.clearAllMocks();
        user = userEvent.setup();
        render(<VetSignup />);
        VetsAPI.vetSignUp = jest.fn().mockResolvedValue({});

        ({ firstName, lastName, email, password } = getSignupElements());

        licenseId = screen.getByLabelText(/license id/i);
        province = screen.getByRole("textbox", { name: /province/i });
    });

    it("renders", () => {
        const heading = screen.getByRole("heading", {
            name: "Sign Up to Start Treating Patients!",
        });

        expect(heading).toBeInTheDocument();
    });

    describe("First name field", () => {
        beforeEach(async () => {
            // Fill other fields with valid defaults so only first name errors
            fillSignupWithDefaults({ firstName: "" });
            fireEvent.change(licenseId, {
                target: { value: DEFAULT_LICENSE_ID },
            });

            // Select province using the async user so Mantine internal handlers fire
            await user.click(province);
            // The options are rendered in a portal; find the option by text and click it
            await user.click(await screen.findByText(DEFAULT_PROVINCE));
        });

        it("is present", () => {
            expect(firstName).toBeInTheDocument();
        });

        it("shows required error when empty on submit", () => {
            submitSignup();

            return expect(
                screen.findByText("Name is required"),
            ).resolves.toBeInTheDocument();
        });

        it("shows min length error when too short", () => {
            fireEvent.change(firstName, { target: { value: "A" } });

            submitSignup();

            return expect(
                screen.findByText("Name must be at least 2 characters"),
            ).resolves.toBeInTheDocument();
        });

        it("shows invalid character error when numbers present", () => {
            fireEvent.change(firstName, { target: { value: "John123" } });

            submitSignup();

            return expect(
                screen.findByText(
                    "Name may only contain letters, spaces and dashes",
                ),
            ).resolves.toBeInTheDocument();
        });

        it("shows invalid character error when symbols present", () => {
            fireEvent.change(firstName, { target: { value: "John!" } });

            submitSignup();

            return expect(
                screen.findByText(
                    "Name may only contain letters, spaces and dashes",
                ),
            ).resolves.toBeInTheDocument();
        });

        it("shows max length error when too long", () => {
            const longName = "John".repeat(10); // 40 characters
            fireEvent.change(firstName, { target: { value: longName } });
            submitSignup();

            return expect(
                screen.findByText("Name must be at most 32 characters"),
            ).resolves.toBeInTheDocument();
        });

        it("submits when valid and navigates home", async () => {
            fireEvent.change(firstName, {
                target: { value: DEFAULT_FIRST_NAME },
            });
            submitSignup();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith("/");
            });
        });
    });

    describe("Last name field", () => {
        beforeEach(async () => {
            fillSignupWithDefaults({ lastName: "" });
            fireEvent.change(licenseId, {
                target: { value: DEFAULT_LICENSE_ID },
            });
            await user.click(province);
            await user.click(await screen.findByText(DEFAULT_PROVINCE));
        });

        it("is present", () => {
            expect(lastName).toBeInTheDocument();
        });

        it("shows required error when empty on submit", () => {
            submitSignup();

            return expect(
                screen.findByText("Name is required"),
            ).resolves.toBeInTheDocument();
        });

        it("shows min length error when too short", () => {
            fireEvent.change(lastName, { target: { value: "B" } });
            submitSignup();

            return expect(
                screen.findByText("Name must be at least 2 characters"),
            ).resolves.toBeInTheDocument();
        });

        it("shows invalid character error when numbers present", () => {
            fireEvent.change(lastName, { target: { value: "Smith2" } });
            submitSignup();

            return expect(
                screen.findByText(
                    "Name may only contain letters, spaces and dashes",
                ),
            ).resolves.toBeInTheDocument();
        });

        it("shows max length error when too long", () => {
            const longName = "Smith".repeat(10); // 50 characters
            fireEvent.change(lastName, { target: { value: longName } });
            submitSignup();

            return expect(
                screen.findByText("Name must be at most 32 characters"),
            ).resolves.toBeInTheDocument();
        });

        it("submits when valid and navigates home", async () => {
            fireEvent.change(lastName, {
                target: { value: DEFAULT_LAST_NAME },
            });
            submitSignup();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith("/");
            });
        });
    });

    describe("Email field", () => {
        beforeEach(async () => {
            fillSignupWithDefaults({ email: "" });
            fireEvent.change(licenseId, {
                target: { value: DEFAULT_LICENSE_ID },
            });
            await user.click(province);
            await user.click(await screen.findByText(DEFAULT_PROVINCE));
        });

        it("is present", () => {
            expect(email).toBeInTheDocument();
        });

        it("shows invalid error when empty on submit", () => {
            submitSignup();

            return expect(
                screen.findByText("Invalid email format"),
            ).resolves.toBeInTheDocument();
        });

        it("shows invalid error for malformed email", () => {
            fireEvent.change(email, { target: { value: "not-an-email" } });
            submitSignup();

            return expect(
                screen.findByText("Invalid email format"),
            ).resolves.toBeInTheDocument();
        });

        it("submits when valid and navigates home", async () => {
            fireEvent.change(email, { target: { value: DEFAULT_EMAIL } });
            submitSignup();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith("/");
            });
        });
    });

    describe("Password field", () => {
        beforeEach(async () => {
            fillSignupWithDefaults({ password: "" });
            fireEvent.change(licenseId, {
                target: { value: DEFAULT_LICENSE_ID },
            });

            await user.click(province);
            await user.click(await screen.findByText(DEFAULT_PROVINCE));
        });

        it("is present", () => {
            expect(password).toBeInTheDocument();

            const reqIndicator = screen.getByText("At least 8 characters");
            expect(reqIndicator).toBeInTheDocument();
        });

        it("shows required error when empty on submit", () => {
            submitSignup();

            return expect(
                screen.findByText("Password is required"),
            ).resolves.toBeInTheDocument();
        });

        it("shows min length error when too short", () => {
            fireEvent.change(password, { target: { value: "John1!" } });

            submitSignup();

            return expect(
                screen.findByText("Password must be at least 8 characters"),
            ).resolves.toBeInTheDocument();
        });

        it("shows max length error when too long", () => {
            const longPassword = "John1!".repeat(21); // 126 characters
            fireEvent.change(password, { target: { value: longPassword } });

            submitSignup();
            return expect(
                screen.findByText("Password must be at most 120 characters"),
            ).resolves.toBeInTheDocument();
        });

        it("shows missing lowercase error", () => {
            fireEvent.change(password, { target: { value: "PASSWORD1!" } });

            submitSignup();

            return expect(
                screen.findByText(
                    "Password must include at least one lowercase letter",
                ),
            ).resolves.toBeInTheDocument();
        });

        it("shows missing uppercase error", () => {
            fireEvent.change(password, { target: { value: "password1!" } });

            submitSignup();

            return expect(
                screen.findByText(
                    "Password must include at least one uppercase letter",
                ),
            ).resolves.toBeInTheDocument();
        });

        it("shows missing number error", () => {
            fireEvent.change(password, { target: { value: "Password!" } });

            submitSignup();

            return expect(
                screen.findByText("Password must include at least one number"),
            ).resolves.toBeInTheDocument();
        });

        it("shows missing symbol error", () => {
            fireEvent.change(password, { target: { value: "Password1" } });

            submitSignup();

            return expect(
                screen.findByText("Password must include at least one symbol"),
            ).resolves.toBeInTheDocument();
        });

        it("submits when valid and navigates home", async () => {
            fireEvent.change(password, { target: { value: DEFAULT_PASSWORD } });

            submitSignup();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith("/");
            });
        });
    });

    describe("License ID field", () => {
        beforeEach(async () => {
            // Fill other fields with valid defaults so only licenseId errors
            fillSignupWithDefaults();
            await user.click(province);
            await user.click(await screen.findByText(DEFAULT_PROVINCE));
        });

        it("is present", () => {
            expect(licenseId).toBeInTheDocument();
        });

        it("shows required error when empty on submit", () => {
            submitSignup();

            return expect(
                screen.findByText("License ID is required"),
            ).resolves.toBeInTheDocument();
        });

        it("shows invalid characters error when symbols present", () => {
            fireEvent.change(licenseId, { target: { value: "ABC-123" } });

            submitSignup();

            return expect(
                screen.findByText(
                    "License ID may only contain letters and numbers",
                ),
            ).resolves.toBeInTheDocument();
        });

        it("shows too short error when under minimum length", () => {
            fireEvent.change(licenseId, { target: { value: "A1" } });

            submitSignup();

            return expect(
                screen.findByText(
                    "License ID must be between 5 and 20 characters",
                ),
            ).resolves.toBeInTheDocument();
        });

        it("shows too long error when over maximum length", () => {
            const longId = "A".repeat(21);
            fireEvent.change(licenseId, { target: { value: longId } });

            submitSignup();

            return expect(
                screen.findByText(
                    "License ID must be between 5 and 20 characters",
                ),
            ).resolves.toBeInTheDocument();
        });

        it("submits when valid and navigates home", async () => {
            fireEvent.change(licenseId, {
                target: { value: DEFAULT_LICENSE_ID },
            });
            submitSignup();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith("/");
            });
        });
    });

    describe("Province field", () => {
        beforeEach(() => {
            fillSignupWithDefaults();
            fireEvent.change(licenseId, {
                target: { value: DEFAULT_LICENSE_ID },
            });
        });

        it("is present", () => {
            expect(province).toBeInTheDocument();
        });

        it("shows required error when empty on submit", () => {
            submitSignup();

            return expect(
                screen.findByText("Please select a province"),
            ).resolves.toBeInTheDocument();
        });

        it("submits when valid and navigates home", async () => {
            await user.click(province);
            await user.click(await screen.findByText(DEFAULT_PROVINCE));
            submitSignup();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith("/");
            });
        });
    });
});
