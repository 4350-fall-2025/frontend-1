import calculateAge from "./ageCalculator";

describe("calculateAge", () => {
    it("calculates age in years and months", () => {
        const birthdate = new Date("2020-01-15");
        const age = calculateAge(birthdate);
        expect(age).toMatch(/^\d+y \d+m$/); // matches format like "4y 10m"
    });

    it("returns months only for age less than 1 year", () => {
        const birthdate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000); // ~6 months ago
        const age = calculateAge(birthdate);
        expect(age).toMatch(/^\d+m$/); // matches format like "6m"
    });
});
