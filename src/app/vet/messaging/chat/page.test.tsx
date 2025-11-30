import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import Messaging from "./page";
import { Client } from "@stomp/stompjs";
import { mockAuthVet } from "~data/vets/mock";
import { setAuthCookie } from "~util/auth/authCookies";

jest.mock("@stomp/stompjs");

// Mock the PetProfile component since we're only testing the page wrapper
jest.mock("~components/petProfile/petProfile", () => {
    return function MockPetProfile({ id }: { id: string }) {
        return (
            <div data-testid='pet-profile-component'>
                Pet Profile with id: {id}
            </div>
        );
    };
});

jest.mock("~components/chat/chat", () => {
    return function MockChat({ websocket }) {
        return (
            <div data-testid='chat' data-ws={!!websocket}>
                Chat
            </div>
        );
    };
});

describe("Messaging page", () => {
    let mockClient: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock owner
        setAuthCookie(mockAuthVet);

        // Mock STOMP client instance behavior
        mockClient = {
            activate: jest.fn(),
            onStompError: null,
        };
        (Client as jest.Mock).mockImplementation((config) => {
            mockClient.onConnect = config.onConnect;
            mockClient.config = config;
            mockClient.publish = jest.fn();
            return mockClient;
        });
    });

    test("calls getAuthenticatedVet and creates websocket client", () => {
        render(<Messaging />);

        expect(Client).toHaveBeenCalledTimes(1);

        const config = (Client as jest.Mock).mock.calls[0][0];
        expect(config.brokerURL).toBe(
            `ws://localhost:3000/ws-chat/websocket?userId=${mockAuthVet.userId}`,
        );
    });

    test("activates websocket on mount", () => {
        render(<Messaging />);

        expect(mockClient.activate).toHaveBeenCalledTimes(1);
    });

    test("onConnect triggers setWebsocket and passes websocket to Chat", async () => {
        render(<Messaging />);

        // Simulate successful connection
        act(() => {
            mockClient.onConnect();
        });

        const chat = screen.getByTestId("chat");
        expect(chat).toBeInTheDocument();
        expect(chat.dataset.ws).toBe("true");
    });

    test("renders PetProfile with correct id", () => {
        render(<Messaging />);
        const profile = screen.getByTestId("pet-profile-component");

        expect(profile).toBeInTheDocument();
        expect(profile).toHaveTextContent("pbiTVPk5DfHe8NibJ3MK");
    });
});
