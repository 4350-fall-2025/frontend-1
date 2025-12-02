"use client";

import PetProfile from "~components/petProfile/petProfile";
import { useEffect, useState, useContext } from "react";
import styles from "./page.module.scss";
import { getAuthenticatedVet } from "~util/auth/getAuthenticatedUser";
import { Client } from "@stomp/stompjs";
import { Vet } from "src/models/vet";
import Chat from "~components/chat/chat";
import {
    generateWebSocketUrl,
    websocketVetTopics,
} from "~data/messages/constants";
import { ChatProvider, useSocket } from "~app/context/ChatContext";

export default function Messaging() {
    const { websocket, currentPartner, setCurrentPartner, petID, setPetID } =
        useSocket();

    console.log(typeof websocket);

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
