import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Chat from "./chat";
import { Client, IMessage } from "@stomp/stompjs";
import { hasRole } from "~util/auth/authCookies";
import { MantineProvider } from "@mantine/core";

// --- Mocks ---
jest.mock("~util/auth/authCookies", () => ({
    hasRole: jest.fn(),
}));

// Helper to mock websocket client
const mockSubscribe = jest.fn();
const mockWebSocket = {
    subscribe: mockSubscribe,
} as unknown as Client;

describe("Chat Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("Message Input", () => {
        beforeEach(() => {
            (hasRole as jest.Mock).mockReturnValue(true);
            render(
                <MantineProvider>
                    <Chat websocket={mockWebSocket} />
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

            const button = screen.getByRole("button");
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

            const messagesBefore = screen.getAllByTestId("message");
            fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
            const messagesAfter = screen.getAllByTestId("message");

            expect(messagesBefore.length == messagesAfter.length);
        });

        test("sending an whitespace doesnt send message", () => {
            const messagesBefore = screen.getAllByTestId("message");
            const input = screen.getByRole("textbox");
            fireEvent.change(input, { target: { value: "  " } });

            fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
            const messagesAfter = screen.getAllByTestId("message");

            expect(messagesBefore.length == messagesAfter.length);
        });
    });

    describe("Websocket related", () => {
        test("does subscribe if user is an owner", () => {
            (hasRole as jest.Mock).mockReturnValue(true);
            render(
                <MantineProvider>
                    <Chat websocket={mockWebSocket} />
                </MantineProvider>,
            );
            expect(mockSubscribe).toHaveBeenCalled();
        });

        test("does not subscribe if user is not an owner", () => {
            (hasRole as jest.Mock).mockReturnValue(false);
            render(
                <MantineProvider>
                    <Chat websocket={mockWebSocket} />
                </MantineProvider>,
            );
            expect(mockSubscribe).not.toHaveBeenCalled();
        });

        test("websocket incoming message is appended", () => {
            (hasRole as jest.Mock).mockReturnValue(true);
            render(
                <MantineProvider>
                    <Chat websocket={mockWebSocket} />
                </MantineProvider>,
            );

            // Capture callback passed to websocket.subscribe
            const callback = mockSubscribe.mock.calls[0][1];

            act(() => {
                const msg = { body: "incoming message" } as IMessage;
                callback(msg);
            });

            expect(screen.getByText("incoming message")).toBeInTheDocument();
        });
    });
});
