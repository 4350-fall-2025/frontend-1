import "@testing-library/jest-dom";
import {
    DEFAULT_EMAIL,
    DEFAULT_FIRST_NAME,
    DEFAULT_LAST_NAME,
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
import OwnerSignup from "./page";
import { OwnersAPI } from "src/api/OwnersAPI";

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

// jest.mock("src/api/OwnersAPI", () => ({
//     OwnersAPI: {
//         ownerSignUp: jest.fn(),
//     },
// }));

describe("Owner signup page", () => {
    let firstName: HTMLElement;
    let lastName: HTMLElement;
    let email: HTMLElement;
    let password: HTMLElement;

    beforeEach(() => {
        jest.clearAllMocks();
        OwnersAPI.ownerSignUp = jest.fn().mockResolvedValue({});
        render(<OwnerSignup />);
        ({ firstName, lastName, email, password } = getSignupElements());
    });

    it("renders", () => {
        const heading = screen.getByRole("heading", {
            name: "Sign Up to Track Your Pet's Needs!",
        });

        expect(heading).toBeInTheDocument();
    });

    describe("First name field", () => {
        beforeEach(() => {
            // Fill other fields with valid defaults so only first name errors
            fillSignupWithDefaults({ firstName: "" });
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
        beforeEach(() => {
            fillSignupWithDefaults({ lastName: "" });
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
        beforeEach(() => {
            fillSignupWithDefaults({ email: "" });
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
        beforeEach(() => {
            fillSignupWithDefaults({ password: "" });
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
            fillSignupWithDefaults();

            submitSignup();

            await waitFor(() => {
                expect(pushMock).toHaveBeenCalledWith("/");
            });
        });
    });
});
