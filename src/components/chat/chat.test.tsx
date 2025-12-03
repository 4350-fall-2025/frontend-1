import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Chat from "./chat";
import { Client, IMessage } from "@stomp/stompjs";
import { setAuthCookie, removeAuthCookie } from "~util/auth/authCookies";
import { MantineProvider } from "@mantine/core";
import { mockAuthOwner, mockOwner } from "~data/owner/mock";
import { OwnersAPI } from "~api/ownersAPI";
import { VetsAPI } from "~api/vetsAPI";
import { mockAuthVet, mockVet } from "~data/vets/mock";
import { ChatMessage, websocketOwnerTopics } from "~data/messages/constants";

const push = jest.fn();
const refresh = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push, refresh }),
}));

// Helper to mock websocket client
const mockSubscribe = jest.fn();
const mockPublish = jest.fn();
const mockWebSocket = {
    subscribe: mockSubscribe,
    publish: mockPublish,
    connected: true,
} as unknown as Client;

//Helpers for the API calls
const mockGetOwner = jest.fn();
OwnersAPI.getOwner = mockGetOwner;

const mockGetVet = jest.fn();
VetsAPI.getVet = mockGetVet;

describe("Chat Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
        removeAuthCookie();
    });

    describe("Name Display", () => {
        test("displays vet name when user is owner", async () => {
            setAuthCookie(mockAuthOwner);
            mockGetVet.mockResolvedValue(mockVet);

            render(
                <MantineProvider>
                    <Chat websocket={mockWebSocket} otherId={mockVet.id} />
                </MantineProvider>,
            );

            expect(mockGetVet).toHaveBeenCalledWith(mockVet.id);
            expect(
                await screen.findByText(`Dr. ${mockVet.lastName}`),
            ).toBeInTheDocument();
        });

        test("displays owner name when user is vet", async () => {
            setAuthCookie(mockAuthVet);
            mockGetOwner.mockResolvedValue(mockOwner);

            render(
                <MantineProvider>
                    <Chat websocket={mockWebSocket} otherId={mockOwner.id} />
                </MantineProvider>,
            );

            expect(mockGetOwner).toHaveBeenCalledWith(mockOwner.id);
            expect(
                await screen.findByText(
                    `${mockOwner.firstName} ${mockOwner.lastName}`,
                ),
            ).toBeInTheDocument();
        });
    });

    describe("Message Input", () => {
        beforeEach(() => {
            setAuthCookie(mockAuthOwner);
            mockGetVet.mockResolvedValue(mockVet);
            render(
                <MantineProvider>
                    <Chat websocket={mockWebSocket} otherId={mockVet.id} />
                </MantineProvider>,
            );
        });

        test("user can type a message", () => {
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "hello" } });

            expect(input).toHaveValue("hello");
        });

        test("clicking send adds a new message", () => {
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "test abc" } });

            const button = screen.getByTestId("send");
            fireEvent.click(button);

            expect(screen.getByText("test abc")).toBeInTheDocument();
            expect(input).toHaveValue("");
        });

        test("pressing Enter sends message", () => {
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "test" } });

            fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
            const messages = screen.getAllByTestId("message");
            expect(messages.at(-1)).toHaveTextContent("test");
        });

        test("pressing Shift+Enter doesnt send message", () => {
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "enter test" } });

            const messagesBefore = screen.queryAllByTestId("message");
            fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
            const messagesAfter = screen.queryAllByTestId("message");

            expect(messagesBefore.length == messagesAfter.length);
        });

        test("sending an whitespace doesnt send message", () => {
            const messagesBefore = screen.queryAllByTestId("message");
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "  " } });

            fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
            const messagesAfter = screen.queryAllByTestId("message");

            expect(messagesBefore.length == messagesAfter.length);
        });
    });

    describe("Websocket related", () => {
        beforeEach(() => {
            setAuthCookie(mockAuthOwner);
            mockGetVet.mockResolvedValue(mockVet);
            render(
                <MantineProvider>
                    <Chat websocket={mockWebSocket} otherId={mockVet.id} />
                </MantineProvider>,
            );
        });

        test("does subscribe upon loading", () => {
            expect(mockSubscribe).toHaveBeenCalled();
        });

        test("publishes when sending a message", () => {
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "test message" } });

            const button = screen.getByTestId("send");
            fireEvent.click(button);
            expect(mockPublish).toHaveBeenCalledWith({
                destination: websocketOwnerTopics.sendChat,
                body: JSON.stringify({
                    from: mockAuthOwner.userId,
                    to: mockVet.id,
                    message: "test message",
                }),
                headers: { "content-type": "application/json" },
            });
        });

        test("websocket incoming message is appended", () => {
            const callback = mockSubscribe.mock.calls[0][1];

            act(() => {
                let innerMessage: ChatMessage = {
                    from: mockVet.id,
                    to: mockAuthOwner.userId,
                    message: "incoming message",
                };
                const msg = { body: JSON.stringify(innerMessage) } as IMessage;
                callback(msg);
            });

            expect(screen.getByText("incoming message")).toBeInTheDocument();
        });
    });
});
