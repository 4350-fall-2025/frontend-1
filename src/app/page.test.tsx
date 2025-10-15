/**
 * Sign-in/Landing Page Test
 *
 * Developed with assistance from Claude AI and ChatGPT for:
 * - Renders tabs with Pet Owner (default) and Veterinarian
 * - "Sign up" link targets /signup/owner by default and /signup/vet after switching tab
 * - Submitting the form routes to /dashboard/owner (owner tab) and /dashboard/vet (vet tab)
 * - Backdrop image alt text updates with the selected tab
 * - Forgot password link routes to /under-construction?hideNav=true
 */

import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen, within } from "~tests/utils/custom-testing-library";

// ---- Mocks ----

// next/navigation: capture router.push calls
const push = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
}));

// next/image: render as a plain <img> so we can assert on alt attribute
jest.mock("next/image", () => (props: any) => {
    // filter out Next.js-only props to avoid React warnings in tests
    const { fill, ...rest } = props;
    return <img {...rest} />;
});

// password validator: make everything valid unless the password is "badpass"
jest.mock("~util/validation/validate-signin", () => ({
    validatePassword: (value: string) =>
        value === "badpass" ? "Invalid password" : null,
}));

// ---- SUT ----
import Home from "./page";

const setup = () => {
    push.mockClear();
    return render(<Home />);
};

describe("Login page (src/app/page.tsx)", () => {
    it("renders tabs and defaults to Pet Owner", () => {
        setup();

        const tablist = screen.getByRole("tablist");
        const ownerTab = within(tablist).getByRole("tab", {
            name: /pet owner/i,
        });
        const vetTab = within(tablist).getByRole("tab", {
            name: /veterinarian/i,
        });

        expect(ownerTab).toBeInTheDocument();
        expect(vetTab).toBeInTheDocument();
        // Mantine marks the selected tab with aria-selected="true"
        expect(ownerTab).toHaveAttribute("aria-selected", "true");
        expect(vetTab).toHaveAttribute("aria-selected", "false");
    });

    it("sign up link points to /signup/owner by default", () => {
        setup();
        const link = screen.getByRole("link", { name: /sign up!/i });
        expect(link).toHaveAttribute("href", "/signup/owner");
    });

    it("switching to Veterinarian updates the sign up link to /signup/vet", async () => {
        setup();
        const user = userEvent.setup();

        const vetTab = screen.getByRole("tab", { name: /veterinarian/i });
        await user.click(vetTab);

        const link = screen.getByRole("link", { name: /sign up!/i });
        expect(link).toHaveAttribute("href", "/signup/vet");
    });

    it("submits and routes to /dashboard/owner when Pet Owner is selected", async () => {
        setup();
        const user = userEvent.setup();

        // Fill form
        await user.type(screen.getByLabelText(/email/i), "test@example.com");
        await user.type(screen.getByLabelText(/password/i), "ok-password");

        // Submit
        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(push).toHaveBeenCalledWith("/dashboard/owner");
    });

    it("submits and routes to /dashboard/vet when Veterinarian is selected", async () => {
        setup();
        const user = userEvent.setup();

        // Switch tab
        await user.click(screen.getByRole("tab", { name: /veterinarian/i }));

        // Fill form
        await user.type(screen.getByLabelText(/email/i), "vet@example.com");
        await user.type(screen.getByLabelText(/password/i), "ok-password");

        // Submit
        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(push).toHaveBeenCalledWith("/dashboard/vet");
    });

    it("updates backdrop image alt text when switching tabs", async () => {
        setup();
        const user = userEvent.setup();

        // Owner by default – should show dog/owner alt
        expect(
            screen.getByRole("img", { name: /dog with the pet owner/i }),
        ).toBeInTheDocument();

        // Switch to vet – alt should change to cat/vets
        await user.click(screen.getByRole("tab", { name: /veterinarian/i }));
        expect(
            screen.getByRole("img", { name: /cat with vets/i }),
        ).toBeInTheDocument();
    });

    it("shows email validation error for bad format", async () => {
        setup();
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/email/i), "not-an-email");
        await user.type(screen.getByLabelText(/password/i), "ok-password");
        await user.click(screen.getByRole("button", { name: /login/i }));

        // Mantine shows validation error text; assert it appears
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });

    it("shows password validation error when validator returns error", async () => {
        setup();
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/email/i), "user@example.com");
        await user.type(screen.getByLabelText(/password/i), "badpass");
        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(screen.getByText(/invalid password/i)).toBeInTheDocument();
        expect(push).not.toHaveBeenCalled();
    });

    it("forgot password link should route to /under-construction with hideNav=true", () => {
        setup();
        const forgotPasswordLink = screen.getByText(/forgot password/i);
        expect(forgotPasswordLink).toHaveAttribute(
            "href",
            "/under-construction?hideNav=true",
        );
    });
});
