"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Vet } from "src/models/vet";
import { getAuthenticatedVet } from "~util/auth/getAuthenticatedUser";
import { Client } from "@stomp/stompjs";
import {
    generateWebSocketUrl,
    websocketVetTopics,
} from "~data/messages/constants";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [websocket, setWebsocket] = useState<Client>(null);
    const [currentPartner, setCurrentPartner] = useState(null);
    const [petID, setPetID] = useState(null);

    useEffect(() => {
        if (!websocket) {
            let vet: Vet = getAuthenticatedVet();
            const connection = new Client({
                brokerURL: generateWebSocketUrl(vet.id),
                onConnect: () => {
                    console.log("connected :D ");
                    setWebsocket(connection);

                    connection.publish({
                        destination: websocketVetTopics.vetAnnounceOnline,
                    });
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
                setCurrentPartner,
                petID,
                setPetID,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useSocket = () => useContext(ChatContext);
