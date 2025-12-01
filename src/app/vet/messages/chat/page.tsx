"use client";

import PetProfile from "~components/petProfile/petProfile";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { getAuthenticatedVet } from "~util/auth/getAuthenticatedUser";
import { Client } from "@stomp/stompjs";
import { Vet } from "src/models/vet";
import Chat from "~components/chat/chat";
import {
    generateWebSocketUrl,
    websocketVetTopics,
} from "~data/messages/constants";

export default function Messaging() {
    const [websocket, setWebsocket] = useState(null);

    useEffect(() => {
        let vet: Vet = getAuthenticatedVet();
        if (!websocket) {
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
        }
    }, []);

    console.log(websocket);

    return (
        <div className={styles.page}>
            <div className={styles.chat}>
                <Chat websocket={websocket} />
            </div>

            <div className={styles.pet_profile}>
                <PetProfile id={"pbiTVPk5DfHe8NibJ3MK"} />
            </div>
        </div>
    );
}
