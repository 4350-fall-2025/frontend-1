import { fireEvent, screen } from "~tests/utils/custom-testing-library";
import {
    DEFAULT_FIRST_NAME,
    DEFAULT_LAST_NAME,
    DEFAULT_EMAIL,
    DEFAULT_PASSWORD,
} from "./defaults";

type SignupFields = {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
};

/**
 * Helper functions generated with GPT-5 mini
 */

export function getSignupElements() {
    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    return { firstName, lastName, email, password };
}

export function fillSignupWithDefaults(overrides?: SignupFields) {
    const { firstName, lastName, email, password } = getSignupElements();

    fireEvent.change(firstName, {
        target: { value: overrides?.firstName ?? DEFAULT_FIRST_NAME },
    });
    fireEvent.change(lastName, {
        target: { value: overrides?.lastName ?? DEFAULT_LAST_NAME },
    });
    fireEvent.change(email, {
        target: { value: overrides?.email ?? DEFAULT_EMAIL },
    });
    fireEvent.change(password, {
        target: { value: overrides?.password ?? DEFAULT_PASSWORD },
    });
}

export function submitSignup() {
    const submitBtn = screen.getByRole("button", { name: /i'm ready!/i });
    fireEvent.click(submitBtn);
}

export default {
    getSignupElements,
    fillSignupWithDefaults,
    submitSignup,
};
