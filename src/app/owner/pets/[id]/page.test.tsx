/* Tests written with help from Copilot GPT-5 mini
 * Code for spying on localStorage found from StackOverflow:
 * https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests
 **/

import { PetsAPI } from "~api/petsAPI";
import { mockOwner, mockOwnerId } from "~tests/__mocks__/ownersAPI";
import { mockPet, mockPetId } from "~tests/__mocks__/petsAPI";
import { render } from "~tests/utils/custom-testing-library";
import PetProfilePage from "./page";

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockRouter,
    }),
}));

jest.mock("~api/petsAPI");

describe("Pet Profile Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders", () => {
        render(<PetProfilePage params={Promise.resolve({ id: mockPetId })} />);

        expect(document.body).toBeDefined(); //TODO: add more specific rendering criteria
    });

    // it("calls PetsAPI successfully", async () => {
    //     render(<PetProfilePage params={Promise.resolve({ id: mockPetId })} />);

    //     expect(PetsAPI.getPet).toHaveReturnedWith(Promise.resolve(mockPet));
    // });
});
