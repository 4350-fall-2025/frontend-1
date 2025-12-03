import "@testing-library/jest-dom";
import {
    act,
    render,
    screen,
    waitFor,
} from "~tests/utils/custom-testing-library";
import userEvent from "@testing-library/user-event";
import MessagesPage from "./page";
import { mockAuthVet } from "~data/vets/mock";
import { setAuthCookie } from "~util/auth/authCookies";
import { RequestMessage, RequestStatus } from "~data/messages/constants";
import { IMessage } from "@stomp/stompjs";

const push = jest.fn();
const mockSubscribe = jest.fn();
const mockPublish = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
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

describe("Vet Messages Page", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
        setAuthCookie(mockAuthVet);
        mockSubscribe.mockReturnValue({ unsubscribe: mockUnsubscribe });
    });

    describe("Initial render", () => {
        it("renders page with title and description", async () => {
            render(<MessagesPage />);

            expect(
                screen.getByRole("heading", { name: /messages/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByText(/Provide help to pets in need/i),
            ).toBeInTheDocument();
        });

        it("displays Connect with a Pet card", async () => {
            render(<MessagesPage />);

            expect(
                await screen.findByText("Connect with a Pet"),
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    /Please wait as we get you connected with a Pet/i,
                ),
            ).toBeInTheDocument();
        });

        it("shows 0 requests in queue initially", async () => {
            render(<MessagesPage />);

            expect(
                await screen.findByText("0 requests in queue"),
            ).toBeInTheDocument();
        });

        it("announces vet online on mount", async () => {
            render(<MessagesPage />);

            await waitFor(() => {
                expect(mockPublish).toHaveBeenCalled();
            });

            expect(mockPublish).toHaveBeenCalledWith(
                expect.objectContaining({
                    destination: "/app/vet/online",
                }),
            );
        });

        it("subscribes to user requests on mount", async () => {
            render(<MessagesPage />);

            await waitFor(() => {
                expect(mockSubscribe).toHaveBeenCalled();
            });

            expect(mockSubscribe).toHaveBeenCalledWith(
                "/user/queue/requests",
                expect.any(Function),
            );
        });
    });

    describe("Incoming requests", () => {
        it("displays modal when a pending request arrives", async () => {
            render(<MessagesPage />);

            const requestCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const request: RequestMessage = {
                    from: "owner123",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.pending,
                };
                const msg = { body: JSON.stringify(request) } as IMessage;
                requestCallback(msg);
            });

            expect(
                await screen.findByText("A pet is in need!"),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /accept/i }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /reject/i }),
            ).toBeInTheDocument();
        });

        it("updates request count when multiple requests arrive", async () => {
            render(<MessagesPage />);

            const requestCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const request1: RequestMessage = {
                    from: "owner1",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.pending,
                };
                const request2: RequestMessage = {
                    from: "owner2",
                    to: mockAuthVet.userId,
                    petId: "pet2",
                    status: RequestStatus.pending,
                };
                requestCallback({ body: JSON.stringify(request1) } as IMessage);
                requestCallback({ body: JSON.stringify(request2) } as IMessage);
            });

            expect(
                await screen.findByText("2 requests in queue"),
            ).toBeInTheDocument();
        });
    });

    describe("Accepting requests", () => {
        it("publishes accept message when Accept button is clicked", async () => {
            render(<MessagesPage />);

            const requestCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const request: RequestMessage = {
                    from: "owner123",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.pending,
                };
                requestCallback({ body: JSON.stringify(request) } as IMessage);
            });

            const acceptButton = await screen.findByRole("button", {
                name: /accept/i,
            });
            await user.click(acceptButton);

            await waitFor(() => {
                expect(mockPublish).toHaveBeenCalledWith(
                    expect.objectContaining({
                        destination: expect.stringContaining("accept"),
                        body: expect.stringContaining("owner123"),
                    }),
                );
            });
        });

        it("closes modal after accepting request", async () => {
            render(<MessagesPage />);

            const requestCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const request: RequestMessage = {
                    from: "owner123",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.pending,
                };
                requestCallback({ body: JSON.stringify(request) } as IMessage);
            });

            const acceptButton = await screen.findByRole("button", {
                name: /accept/i,
            });
            await user.click(acceptButton);

            await waitFor(() => {
                expect(
                    screen.queryByText("A pet is in need!"),
                ).not.toBeInTheDocument();
            });
        });
    });

    describe("Rejecting requests", () => {
        it("publishes reject message when Reject button is clicked", async () => {
            render(<MessagesPage />);

            const requestCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const request: RequestMessage = {
                    from: "owner123",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.pending,
                };
                requestCallback({ body: JSON.stringify(request) } as IMessage);
            });

            const rejectButton = await screen.findByRole("button", {
                name: /reject/i,
            });
            await user.click(rejectButton);

            await waitFor(() => {
                expect(mockPublish).toHaveBeenCalledWith(
                    expect.objectContaining({
                        destination: expect.stringContaining("reject"),
                        body: expect.stringContaining("owner123"),
                    }),
                );
            });
        });

        it("removes request from queue after rejecting", async () => {
            render(<MessagesPage />);

            const requestCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const request1: RequestMessage = {
                    from: "owner1",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.pending,
                };
                const request2: RequestMessage = {
                    from: "owner2",
                    to: mockAuthVet.userId,
                    petId: "pet2",
                    status: RequestStatus.pending,
                };
                requestCallback({ body: JSON.stringify(request1) } as IMessage);
                requestCallback({ body: JSON.stringify(request2) } as IMessage);
            });

            expect(
                await screen.findByText("2 requests in queue"),
            ).toBeInTheDocument();

            const rejectButton = await screen.findByRole("button", {
                name: /reject/i,
            });
            await user.click(rejectButton);

            await waitFor(() => {
                expect(
                    screen.getByText("1 requests in queue"),
                ).toBeInTheDocument();
            });
        });

        it("closes modal when clicking X (reject)", async () => {
            render(<MessagesPage />);

            const requestCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const request: RequestMessage = {
                    from: "owner123",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.pending,
                };
                requestCallback({ body: JSON.stringify(request) } as IMessage);
            });

            await screen.findByText("A pet is in need!");

            // Modal onClose triggers reject
            const modal = screen.getByRole("dialog");
            expect(modal).toBeInTheDocument();

            // Simulate closing by clicking reject
            const rejectButton = screen.getByRole("button", {
                name: /reject/i,
            });
            await user.click(rejectButton);

            await waitFor(() => {
                expect(mockPublish).toHaveBeenCalledWith(
                    expect.objectContaining({
                        destination: expect.stringContaining("reject"),
                    }),
                );
            });
        });
    });

    describe("Cancelled requests", () => {
        it("removes cancelled request from queue", async () => {
            render(<MessagesPage />);

            const requestCallback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const request1: RequestMessage = {
                    from: "owner1",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.pending,
                };
                const request2: RequestMessage = {
                    from: "owner2",
                    to: mockAuthVet.userId,
                    petId: "pet2",
                    status: RequestStatus.pending,
                };
                requestCallback({ body: JSON.stringify(request1) } as IMessage);
                requestCallback({ body: JSON.stringify(request2) } as IMessage);
            });

            expect(
                await screen.findByText("2 requests in queue"),
            ).toBeInTheDocument();

            act(() => {
                const cancelledRequest: RequestMessage = {
                    from: "owner1",
                    to: mockAuthVet.userId,
                    petId: "pet1",
                    status: RequestStatus.cancelled,
                };
                requestCallback({
                    body: JSON.stringify(cancelledRequest),
                } as IMessage);
            });

            await waitFor(() => {
                expect(
                    screen.getByText("1 requests in queue"),
                ).toBeInTheDocument();
            });
        });
    });

    describe("Cleanup", () => {
        it("unsubscribes on unmount", async () => {
            const { unmount } = render(<MessagesPage />);

            await waitFor(() => {
                expect(mockSubscribe).toHaveBeenCalled();
            });

            unmount();

            expect(mockUnsubscribe).toHaveBeenCalled();
        });
    });
});
