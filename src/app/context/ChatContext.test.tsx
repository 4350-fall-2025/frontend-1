import "@testing-library/jest-dom";
import { renderHook, waitFor } from "@testing-library/react";
import { ChatProvider, useSocket } from "./ChatContext";
import { Client } from "@stomp/stompjs";
import { mockAuthOwner, mockOwner } from "~data/owner/mock";
import { mockAuthVet } from "~data/vets/mock";
import { setAuthCookie } from "~util/auth/authCookies";

const mockActivate = jest.fn();
const mockDeactivate = jest.fn();
jest.mock("@stomp/stompjs");

describe("ChatContext", () => {
    beforeEach(() => {
        jest.clearAllMocks();

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
            setAuthCookie(mockAuthOwner);
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
            setAuthCookie(mockAuthVet);

            renderHook(() => useSocket(), {
                wrapper: ChatProvider,
            });

            await waitFor(() => {
                expect(Client).toHaveBeenCalledWith(
                    expect.objectContaining({
                        brokerURL: expect.stringContaining(mockAuthVet.userId),
                    }),
                );
            });
        });

        it("provides websocket, currentPartner, and petID through context", async () => {
            setAuthCookie(mockAuthOwner);
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
            expect(() => {
                renderHook(() => useSocket(), {
                    wrapper: ChatProvider,
                });
            }).toThrow();
        });

        it("handles authentication error for vet", () => {
            expect(() => {
                renderHook(() => useSocket(), {
                    wrapper: ChatProvider,
                });
            }).toThrow();
        });

        it("configures onStompError handler", async () => {
            setAuthCookie(mockAuthOwner);

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
            setAuthCookie(mockAuthOwner);

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
            setAuthCookie(mockAuthOwner);

            renderHook(() => useSocket(), {
                wrapper: ChatProvider,
            });

            await waitFor(() => {
                expect(Client).toHaveBeenCalledTimes(1);
            });
        });
    });
});
