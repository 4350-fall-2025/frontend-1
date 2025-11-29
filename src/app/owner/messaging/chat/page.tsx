"use client";

import PetProfile from "~components/petProfile/petProfile";
import Chat from "~components/chat/chat";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { getAuthenticatedOwner } from "~util/auth/getAuthenticatedUser";
import { Owner } from "src/models/owner";
import { Client } from "@stomp/stompjs";

export default function Messaging() {
    const [websocket, setWebsocket] = useState<Client>(null);

    useEffect(() => {
        let owner: Owner = getAuthenticatedOwner();
        if (!websocket) {
            const connection = new Client({
                brokerURL: `ws://localhost:3000/ws-chat/websocket?userId=${owner.id}`,
                onConnect: () => {
                    console.log("connected :D ");
                    // connection.subscribe("/queue/online-init", (msg) => {
                    //     console.log("init" + msg);
                    // });
                    // connection.subscribe("/topic/online", (msg) => {
                    //     console.log(msg.body);
                    // });
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
        }
    }, []);

    return (
        <div className={styles.page}>
            <Chat websocket={websocket} />
            <div className={styles.pet_profile}>
                <PetProfile id={"pbiTVPk5DfHe8NibJ3MK"} />
            </div>
        </div>
    );
}
