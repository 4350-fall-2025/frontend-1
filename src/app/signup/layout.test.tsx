import "@testing-library/jest-dom";
import { render, screen } from "~tests/utils/custom-testing-library";
import SignupLayout from "./layout";

describe("Signup Layout", () => {
    const children = <h1>Test Child</h1>;

    it("renders", () => {
        render(<SignupLayout>{children}</SignupLayout>);

        expect(screen.getByText("Test Child")).toBeInTheDocument();
    });
});
