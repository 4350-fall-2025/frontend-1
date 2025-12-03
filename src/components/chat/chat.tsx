import { useState, useEffect, useRef } from "react";
import { Textarea, ActionIcon } from "@mantine/core";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import styles from "./chat.module.scss";
import { Client } from "@stomp/stompjs";
import { hasRole } from "~util/auth/authCookies";
import { UserRoles } from "~data/constants";
import { ChatMessage, websocketOwnerTopics } from "~data/messages/constants";
import {
    getAuthenticatedOwner,
    getAuthenticatedVet,
} from "~util/auth/getAuthenticatedUser";
import { VetsAPI } from "~api/vetsAPI";
import { Vet } from "src/models/vet";
import { OwnersAPI } from "~api/ownersAPI";
import { Owner } from "src/models/owner";

export enum Sender {
    me = "me",
    other = "other",
}

export interface Message {
    text: string;
    sender: Sender;
}

export default function Chat({
    websocket,
    otherId,
}: {
    websocket: Client;
    otherId: string;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const myID = useRef(null);
    const [name, setName] = useState("");
    const setupSub = useRef(false);

    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            text: input,
            sender: Sender.me,
        };

        setMessages((prev) => [...prev, newMessage]);
        const message: ChatMessage = {
            from: myID.current,
            to: otherId,
            message: input,
        };
        websocket.publish({
            destination: websocketOwnerTopics.sendChat,
            body: JSON.stringify(message),
            headers: { "content-type": "application/json" },
        });
        setInput("");
    };

    const getVetsName = async () => {
        const vet: Vet = await VetsAPI.getVet(otherId);
        setName(`Dr. ${vet.lastName}`);
    };

    const getOwnersName = async () => {
        const owner: Owner = await OwnersAPI.getOwner(otherId);
        setName(`${owner.firstName} ${owner.lastName}`);
    };

    useEffect(() => {
        if (hasRole(UserRoles.owner)) {
            const owner = getAuthenticatedOwner();
            myID.current = owner.id;
            getVetsName();
        } else {
            const vet = getAuthenticatedVet();
            myID.current = vet.id;
            getOwnersName();
        }
    }, []);

    useEffect(() => {
        if (websocket != null && !setupSub.current) {
            setupSub.current = true;
            websocket.subscribe(websocketOwnerTopics.incomingChat, (msg) => {
                const incoming: ChatMessage = JSON.parse(msg.body);
                setMessages((prev) => [
                    ...prev,
                    { text: incoming.message, sender: Sender.other },
                ]);
            });
        }
    }, [websocket]);

    return (
        <div className={styles.chat}>
            <div className={styles.chat_header}>
                <h1 className={styles.chat_header_name}>{name}</h1>
                <span className={styles.chat_subheader}>
                    Virtual Walk-In Appointment
                </span>
            </div>
            <div className={styles.chat_body}>
                {/* this inner div allows for scrolling to the bottom
                    credit to: https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up
                 */}
                <div className={styles.inner_body}>
                    {messages.map((msg, index) => (
                        <div
                            className={styles["message_" + msg.sender]}
                            key={index}
                            data-testid='message'
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>
            <Textarea
                variant='filled'
                value={input}
                onChange={(event) => setInput(event.currentTarget.value)}
                autosize
                maxRows={3}
                radius='xl'
                placeholder='Write your message here :3'
                rightSection={
                    <ActionIcon radius='xl' onClick={sendMessage}>
                        <ArrowUpIcon />
                    </ActionIcon>
                }
                onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                    }
                }}
            />
        </div>
    );
}
