// Unit tests created and/or modified with Copilot on GPT-5 mini

import "@testing-library/jest-dom";

import { render, screen } from "~tests/utils/custom-testing-library";
import PasswordRequirements from "./passwordRequirements";

describe("PasswordRequirements component", () => {
    it("renders all requirements", () => {
        render(<PasswordRequirements password='Test123!' isDirty={false} />);

        expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
        expect(screen.getByText("At most 120 characters")).toBeInTheDocument();
        expect(
            screen.getByText("Includes uppercase letter"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("Includes lowercase letter"),
        ).toBeInTheDocument();
        expect(screen.getByText("Includes number")).toBeInTheDocument();
        expect(screen.getByText("Includes symbol")).toBeInTheDocument();
    });

    it("does not show a requirement as met when field is not dirty", () => {
        render(<PasswordRequirements password='Test123!' isDirty={false} />);

        // The label element is wrapped by the colored container; check parent for color
        const atLeastEl = screen.getByText("At least 8 characters");
        expect(atLeastEl.parentElement).toHaveStyle({
            color: "rgb(255, 0, 0)",
        });
    });

    it("shows unmet requirements as red when dirty or not dirty", () => {
        // when password doesn't include a number, it should be red whether dirty or not
        render(<PasswordRequirements password='weakpassword' isDirty={true} />);
        const includesNumber = screen.getByText("Includes number");
        expect(includesNumber.parentElement).toHaveStyle({
            color: "rgb(255, 0, 0)",
        });
    });

    it("shows requirement as met with sufficient password and dirty field", () => {
        render(<PasswordRequirements password='Test123!' isDirty={true} />);
        const includesSymbol = screen.getByText("At most 120 characters");
        expect(includesSymbol.parentElement).toHaveStyle({
            color: "rgb(0, 128, 128)",
        });
    });
});
