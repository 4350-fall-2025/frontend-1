import "@testing-library/jest-dom";

import { render, screen } from "~tests/utils/custom-testing-library";
import PasswordRequirements from "./passwordRequirements";

describe("PasswordRequirements component", () => {
    it("renders all requirements", () => {
        render(<PasswordRequirements password='Test123!' />);

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

    it("shows correct requirements met for given password", () => {
        render(<PasswordRequirements password='Test123!' />);

        expect(screen.getByText("At least 8 characters")).toHaveStyle({
            color: "rgb(0, 128, 128)",
        });
    });

    it("shows missing requirements for for given password", () => {
        render(<PasswordRequirements password='weakpassword' />);

        expect(screen.getByText("Includes number")).toHaveStyle({
            color: "rgb(255, 0, 0)",
        });
    });
});
