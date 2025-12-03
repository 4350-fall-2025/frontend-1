import "@testing-library/jest-dom";
import { renderHook, waitFor } from "@testing-library/react";
import { ChatProvider, useSocket } from "./ChatContext";
import { Client } from "@stomp/stompjs";
import { mockOwner } from "~data/owner/mock";
import { mockVet } from "~data/vets/mock";

jest.mock("@stomp/stompjs");
jest.mock("~data/messages/constants", () => ({
    generateWebSocketUrl: jest.fn(
        (userId) => `ws://localhost:3000/ws-chat/${userId}`,
    ),
}));

const mockActivate = jest.fn();
const mockDeactivate = jest.fn();

const mockHasRole = jest.fn();
const mockGetAuthenticatedOwner = jest.fn();
const mockGetAuthenticatedVet = jest.fn();

jest.mock("~util/auth/authCookies", () => ({
    hasRole: (...args: any[]) => mockHasRole(...args),
}));

jest.mock("~util/auth/getAuthenticatedUser", () => ({
    getAuthenticatedOwner: () => mockGetAuthenticatedOwner(),
    getAuthenticatedVet: () => mockGetAuthenticatedVet(),
}));

describe("ChatContext", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockHasRole.mockReturnValue(false);
        mockGetAuthenticatedOwner.mockReturnValue(mockOwner);
        mockGetAuthenticatedVet.mockReturnValue(mockVet);

        (Client as jest.Mock).mockImplementation(function (config) {
            this.brokerURL = config.brokerURL;
            this.onConnect = config.onConnect;
            this.onStompError = config.onStompError || jest.fn();
            this.activate = mockActivate.mockImplementation(() => {
                if (this.onConnect) {
                    this.onConnect();
                }
            });
            this.deactivate = mockDeactivate;
            return this;
        });
    });

    describe("Provider initialization", () => {
        it("creates WebSocket connection for owner on mount", async () => {
            mockHasRole.mockReturnValue(false);
            mockGetAuthenticatedOwner.mockReturnValue(mockOwner);

            renderHook(() => useSocket(), {
                wrapper: ChatProvider,
            });

            await waitFor(() => {
                expect(Client).toHaveBeenCalledWith(
                    expect.objectContaining({
                        brokerURL: expect.stringContaining(mockOwner.id),
                    }),
                );
            });

            expect(mockActivate).toHaveBeenCalled();
        });

        it("creates WebSocket connection for vet when vet role is present", async () => {
            mockHasRole.mockReturnValue(true);
            mockGetAuthenticatedVet.mockReturnValue(mockVet);

            renderHook(() => useSocket(), {
                wrapper: ChatProvider,
            });

            await waitFor(() => {
                expect(mockGetAuthenticatedVet).toHaveBeenCalled();
                expect(Client).toHaveBeenCalledWith(
                    expect.objectContaining({
                        brokerURL: expect.stringContaining(mockVet.id),
                    }),
                );
            });
        });

        it("provides websocket, currentPartner, and petID through context", async () => {
            mockHasRole.mockReturnValue(false);
            mockGetAuthenticatedOwner.mockReturnValue(mockOwner);

            const { result } = renderHook(() => useSocket(), {
                wrapper: ChatProvider,
            });

            await waitFor(() => {
                expect(result.current).toHaveProperty("websocket");
                expect(result.current).toHaveProperty("currentPartner");
                expect(result.current).toHaveProperty("petID");
            });

            expect(result.current.currentPartner).toHaveProperty(
                "current",
                null,
            );
            expect(result.current.petID).toHaveProperty("current", null);
        });
    });

    describe("Error handling", () => {
        it("handles authentication error for owner", () => {
            mockHasRole.mockReturnValue(false);
            mockGetAuthenticatedOwner.mockImplementation(() => {
                throw new Error("Not authenticated");
            });

            expect(() => {
                renderHook(() => useSocket(), {
                    wrapper: ChatProvider,
                });
            }).toThrow("Not authenticated");
        });

        it("handles authentication error for vet", () => {
            mockHasRole.mockReturnValue(true);
            mockGetAuthenticatedVet.mockImplementation(() => {
                throw new Error("Not authenticated");
            });

            expect(() => {
                renderHook(() => useSocket(), {
                    wrapper: ChatProvider,
                });
            }).toThrow("Not authenticated");
        });

        it("configures onStompError handler", async () => {
            mockHasRole.mockReturnValue(false);
            mockGetAuthenticatedOwner.mockReturnValue(mockOwner);

            renderHook(() => useSocket(), {
                wrapper: ChatProvider,
            });

            await waitFor(() => {
                expect(Client).toHaveBeenCalled();
            });

            const clientInstance = (Client as jest.Mock).mock.results[0].value;
            expect(clientInstance.onStompError).toBeDefined();
        });
    });

    describe("Cleanup", () => {
        it("deactivates connection on unmount", async () => {
            mockHasRole.mockReturnValue(false);
            mockGetAuthenticatedOwner.mockReturnValue(mockOwner);

            const { unmount } = renderHook(() => useSocket(), {
                wrapper: ChatProvider,
            });

            await waitFor(() => {
                expect(mockActivate).toHaveBeenCalled();
            });

            unmount();

            expect(mockDeactivate).toHaveBeenCalled();
        });
    });

    describe("Edge cases", () => {
        it("does not create duplicate connections", async () => {
            mockHasRole.mockReturnValue(false);
            mockGetAuthenticatedOwner.mockReturnValue(mockOwner);

            renderHook(() => useSocket(), {
                wrapper: ChatProvider,
            });

            await waitFor(() => {
                expect(Client).toHaveBeenCalledTimes(1);
            });
        });
    });
});
