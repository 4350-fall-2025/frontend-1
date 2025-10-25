// Integration tests created with help from GPT-5 mini
import "@testing-library/jest-dom";

import userEvent from "@testing-library/user-event";
import { render, screen } from "~tests/utils/custom-testing-library";

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

import OwnerSignup from "~app/auth/sign-up/owner/page";
import VetSignup from "~app/auth/sign-up/vet/page";

describe("Owner Signup", () => {
    it("shows requirements as red when unmet", async () => {
        const user = userEvent.setup();

        render(<OwnerSignup />);

        const passwordInput = screen.getByLabelText(/password/i);
        const atLeast = screen.getByText("At least 8 characters");

        await user.type(passwordInput, "test");
        expect(atLeast.parentElement).toHaveStyle({ color: "rgb(255, 0, 0)" });
    });

    it("shows requirements as red when met but not dirty", async () => {
        render(<OwnerSignup />);

        const passwordInput = screen.getByLabelText(/password/i);
        const atMost = screen.getByText("At most 120 characters");
        expect(passwordInput).toHaveAttribute("value", "");
        expect(atMost.parentElement).toHaveStyle({ color: "rgb(255, 0, 0)" });
    });

    it("shows requirements as teal when met and dirty", async () => {
        const user = userEvent.setup();

        render(<OwnerSignup />);

        const passwordInput = screen.getByLabelText(/password/i);
        const atMost = screen.getByText("At most 120 characters");

        await user.type(passwordInput, "test");
        expect(atMost.parentElement).toHaveStyle({ color: "rgb(0, 128, 128)" });
    });
});

describe("Vet Signup", () => {
    it("shows requirements as red when unmet", async () => {
        const user = userEvent.setup();

        render(<VetSignup />);

        const passwordInput = screen.getByLabelText(/password/i);
        const atLeast = screen.getByText("At least 8 characters");

        await user.type(passwordInput, "test");
        expect(atLeast.parentElement).toHaveStyle({ color: "rgb(255, 0, 0)" });
    });

    it("shows requirements as red when met but not dirty", async () => {
        render(<VetSignup />);

        const passwordInput = screen.getByLabelText(/password/i);
        const atMost = screen.getByText("At most 120 characters");
        expect(passwordInput).toHaveAttribute("value", "");
        expect(atMost.parentElement).toHaveStyle({ color: "rgb(255, 0, 0)" });
    });

    it("shows requirements as teal when met and dirty", async () => {
        const user = userEvent.setup();

        render(<VetSignup />);

        const passwordInput = screen.getByLabelText(/password/i);
        const atMost = screen.getByText("At most 120 characters");

        await user.type(passwordInput, "test");
        expect(atMost.parentElement).toHaveStyle({ color: "rgb(0, 128, 128)" });
    });
});
