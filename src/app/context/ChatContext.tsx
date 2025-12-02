"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Vet } from "src/models/vet";
import {
    getAuthenticatedOwner,
    getAuthenticatedVet,
} from "~util/auth/getAuthenticatedUser";
import { Client } from "@stomp/stompjs";
import { generateWebSocketUrl } from "~data/messages/constants";
import { hasRole } from "~util/auth/authCookies";
import { UserRoles } from "~data/constants";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [websocket, setWebsocket] = useState<Client>(null);
    const currentPartner = useRef(null);
    const petID = useRef(null);

    useEffect(() => {
        if (!websocket) {
            let user;
            if (hasRole(UserRoles.vet)) {
                user = getAuthenticatedVet();
            } else {
                user = getAuthenticatedOwner();
            }

            const connection = new Client({
                brokerURL: generateWebSocketUrl(user.id),
                onConnect: () => {
                    console.log("connected :D ");
                    setWebsocket(connection);
                },
            });

            connection.onStompError = function (frame) {
                console.log(
                    "Broker reported error: " + frame.headers["message"],
                );
                console.log("Additional details: " + frame.body);
            };
            connection.activate();
            return () => {
                connection.deactivate();
            };
        }
        return () => {
            websocket.deactivate();
        };
    }, []);

    return (
        <ChatContext.Provider
            value={{
                websocket,
                currentPartner,
                petID,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useSocket = () => useContext(ChatContext);
