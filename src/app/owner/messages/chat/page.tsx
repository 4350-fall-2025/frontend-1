"use client";

import PetProfile from "~components/petProfile/petProfile";
import Chat from "~components/chat/chat";
import styles from "./page.module.scss";
import { useSocket } from "~app/context/ChatContext";

export default function Messaging() {
    const { websocket, currentPartner, petID } = useSocket();

    return (
        <div className={styles.page}>
            <div className={styles.chat}>
                <Chat websocket={websocket} otherId={currentPartner.current} />
            </div>

            <div className={styles.pet_profile}>
                <PetProfile id={petID.current} />
            </div>
        </div>
    );
}
