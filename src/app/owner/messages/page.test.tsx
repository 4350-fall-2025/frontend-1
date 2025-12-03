import "@testing-library/jest-dom";
import {
    act,
    render,
    screen,
    waitFor,
} from "~tests/utils/custom-testing-library";
import userEvent from "@testing-library/user-event";
import Messages from "./page";
import { mockAuthOwner } from "~data/owner/mock";
import { mockPets } from "~data/pets/mock";
import { PetsAPI } from "~api/petsAPI";
import { setAuthCookie } from "~util/auth/authCookies";
import { RequestMessage, RequestStatus } from "~data/messages/constants";
import { IMessage } from "@stomp/stompjs";

const mockPush = jest.fn();
const mockSubscribe = jest.fn();
const mockPublish = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock("~app/context/ChatContext", () => ({
    useSocket: () => ({
        websocket: {
            subscribe: mockSubscribe,
            publish: mockPublish,
        },
        currentPartner: { current: null },
        petID: { current: null },
    }),
}));

jest.mock("~api/petsAPI");

const mockGetImageURL = jest.fn();

jest.mock("../../../firebase.ts", () => ({
    auth: {},
    storage: {},
}));

describe("Messages Page", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
        setAuthCookie(mockAuthOwner);
        (PetsAPI.getAllPets as jest.Mock).mockResolvedValue(mockPets);
    });

    describe("Pet selection", () => {
        it("renders pet selection card initially", async () => {
            render(<Messages />);

            expect(await screen.findByText("Select a Pet")).toBeInTheDocument();
            expect(
                screen.getByText(/Tell us which pet you are chatting about/i),
            ).toBeInTheDocument();
        });

        it("loads and displays owner's pets", async () => {
            render(<Messages />);

            await waitFor(() => {
                expect(PetsAPI.getAllPets).toHaveBeenCalledWith(
                    mockAuthOwner.userId,
                );
            });

            expect(
                await screen.findByText(mockPets[0].name),
            ).toBeInTheDocument();
        });

        it("disables Next button when no pet is selected", async () => {
            render(<Messages />);

            const nextButton = await screen.findByRole("button", {
                name: /next/i,
            });
            expect(nextButton).toBeDisabled();
        });

        it("enables Next button when a pet is selected", async () => {
            render(<Messages />);

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);

            const nextButton = screen.getByRole("button", { name: /next/i });
            expect(nextButton).toBeEnabled();
        });

        it("allows deselecting a pet by clicking again", async () => {
            render(<Messages />);

            const petCheckbox = await screen.findByText(mockPets[0].name);

            await user.click(petCheckbox);
            const nextButton = screen.getByRole("button", { name: /next/i });
            expect(nextButton).toBeEnabled();

            await user.click(petCheckbox);
            expect(nextButton).toBeDisabled();
        });
    });

    describe("Connect with vet flow", () => {
        it("shows connect with vet card when Next is clicked", async () => {
            render(<Messages />);

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);

            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);

            expect(
                await screen.findByText("Connect with a Vet"),
            ).toBeInTheDocument();
        });

        it("displays vet count correctly for single vet", async () => {
            render(<Messages />);
            const vetOnlineCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                let vetList = ["vet1"];
                const msg = { body: JSON.stringify(vetList) } as IMessage;
                vetOnlineCallback(msg);
            });

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);

            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);

            expect(await screen.findByText("1 vet online")).toBeInTheDocument();
        });

        it("displays vet count correctly for multiple vets", async () => {
            render(<Messages />);
            const vetOnlineCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                let vetList = ["vet1", "vet2", "vet3"];
                const msg = { body: JSON.stringify(vetList) } as IMessage;
                vetOnlineCallback(msg);
            });

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);

            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);

            expect(
                await screen.findByText("3 vets online"),
            ).toBeInTheDocument();
        });

        it("disables Connect button when no vets are online", async () => {
            render(<Messages />);

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);

            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);

            const connectButton = await screen.findByRole("button", {
                name: /^connect$/i,
            });
            expect(connectButton).toBeDisabled();
            expect(
                screen.getByText(/Can't connect yet, no vets are online/i),
            ).toBeInTheDocument();
        });

        it("sends request to vet when Connect is clicked", async () => {
            render(<Messages />);
            const vetOnlineCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                let vetList = ["vet1"];
                const msg = { body: JSON.stringify(vetList) } as IMessage;
                vetOnlineCallback(msg);
            });

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);

            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);

            const connectButton = await screen.findByRole("button", {
                name: /^connect$/i,
            });
            await user.click(connectButton);

            expect(mockPublish).toHaveBeenCalledWith(
                expect.objectContaining({
                    body: expect.stringContaining("vet1"),
                }),
            );
        });

        it("shows loading modal after sending request", async () => {
            render(<Messages />);
            const vetOnlineCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                let vetList = ["vet1"];
                const msg = { body: JSON.stringify(vetList) } as IMessage;
                vetOnlineCallback(msg);
            });

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);

            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);

            const connectButton = await screen.findByRole("button", {
                name: /^connect$/i,
            });
            await user.click(connectButton);

            expect(
                await screen.findByText(/We are looking for a vet for you/i),
            ).toBeInTheDocument();
        });
    });

    describe("Request responses", () => {
        beforeEach(async () => {
            const user = userEvent.setup();
            render(<Messages />);

            const vetOnlineCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                let vetList = ["vet1"];
                const msg = { body: JSON.stringify(vetList) } as IMessage;
                vetOnlineCallback(msg);
            });

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);
            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);
            const connectButton = await screen.findByRole("button", {
                name: /^connect$/i,
            });
            await user.click(connectButton);
        });
        it("navigates to chat when vet accepts request", async () => {
            const acceptedCallback = mockSubscribe.mock.calls[2][1];

            act(() => {
                let innerMessage: RequestMessage = {
                    from: "vet1",
                    to: mockAuthOwner.userId,
                    petId: mockPets[0].id,
                    status: RequestStatus.accepted,
                };
                const msg = { body: JSON.stringify(innerMessage) } as IMessage;
                acceptedCallback(msg);
            });

            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith("/owner/messages/chat");
            });
        });

        it("shows dialog when vet rejects request", async () => {
            const rejectedCallback = mockSubscribe.mock.calls[2][1];
            act(() => {
                let innerMessage: RequestMessage = {
                    from: "vet1",
                    to: mockAuthOwner.userId,
                    petId: mockPets[0].id,
                    status: RequestStatus.rejected,
                };
                const msg = { body: JSON.stringify(innerMessage) } as IMessage;
                rejectedCallback(msg);
            });

            expect(
                await screen.findByText(/The Vet rejected your request/i),
            ).toBeInTheDocument();
        });

        it("shows dialog when vet disconnects", async () => {
            const cancelledCallback = mockSubscribe.mock.calls[2][1];
            act(() => {
                let innerMessage: RequestMessage = {
                    from: "vet1",
                    to: mockAuthOwner.userId,
                    petId: "empty",
                    status: RequestStatus.cancelled,
                };
                const msg = { body: JSON.stringify(innerMessage) } as IMessage;
                cancelledCallback(msg);
            });
            expect(
                await screen.findByText(/The Vet has disconnected/i),
            ).toBeInTheDocument();
        });
    });

    describe("Error handling", () => {
        it("displays error message when pets fetch fails", async () => {
            (PetsAPI.getAllPets as jest.Mock).mockRejectedValue(
                new Error("API Error"),
            );

            render(<Messages />);

            expect(
                await screen.findByText(/We can't retrieve all your pets/i),
            ).toBeInTheDocument();
        });

        it("uses placeholder image when pet image fetch fails", async () => {
            mockGetImageURL.mockRejectedValue(new Error("Image not found"));

            render(<Messages />);

            await waitFor(() => {
                expect(PetsAPI.getAllPets).toHaveBeenCalled();
            });

            // Component should still render without crashing
            expect(
                await screen.findByText(mockPets[0].name),
            ).toBeInTheDocument();
        });
    });

    describe("Cancel functionality", () => {
        it("goes back to pet selection when Cancel is clicked", async () => {
            render(<Messages />);

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);

            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);

            expect(
                await screen.findByText("Connect with a Vet"),
            ).toBeInTheDocument();

            const cancelButton = screen.getByRole("button", {
                name: /cancel/i,
            });
            await user.click(cancelButton);

            expect(await screen.findByText("Select a Pet")).toBeInTheDocument();
        });

        it("sends cancel request when canceling vet search", async () => {
            const user = userEvent.setup();
            render(<Messages />);

            const vetOnlineCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                let vetList = ["vet1"];
                const msg = { body: JSON.stringify(vetList) } as IMessage;
                vetOnlineCallback(msg);
            });

            const petCheckbox = await screen.findByText(mockPets[0].name);
            await user.click(petCheckbox);
            const nextButton = screen.getByRole("button", { name: /next/i });
            await user.click(nextButton);
            const connectButton = await screen.findByRole("button", {
                name: /^connect$/i,
            });
            await user.click(connectButton);

            // Modal should be visible
            expect(
                await screen.findByText(/We are looking for a vet for you/i),
            ).toBeInTheDocument();

            await waitFor(() => {
                expect(mockPublish).toHaveBeenCalledTimes(1);
            });

            // Clear the mock to track only the cancel call
            mockPublish.mockClear();

            // Find cancel button in modal
            const modalCancelButton = screen.getByTestId("modal_cancel");
            await user.click(modalCancelButton);

            // Check that publish was called for cancel
            await waitFor(() => {
                expect(mockPublish).toHaveBeenCalledTimes(1);
            });
            const cancelCall = mockPublish.mock.calls[0][0];
            expect(cancelCall.body).toContain("vet1");
            expect(cancelCall.body).toContain(RequestStatus.cancelled);
        });
    });
});
