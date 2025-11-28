"use client";

import PetProfile from "~components/petProfile/petProfile";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { Textarea, Button } from "@mantine/core";
import {
    getAuthenticatedOwner,
    getAuthenticatedVet,
} from "~util/auth/getAuthenticatedUser";
import { Owner } from "src/models/owner";
import { Client } from "@stomp/stompjs";
import { Vet } from "src/models/vet";

enum Sender {
    me = "me",
    other = "other",
}

// Lightweight interface instead of a class
interface Message {
    text: string;
    sender: Sender;
}

// Mock using interface
const messagesMock: Message[] = [
    { text: "wowowowow", sender: Sender.other },
    { text: "wowowowow", sender: Sender.me },
    {
        text: "A lack of economic opportunity among black men, and the shame and frustration...",
        sender: Sender.me,
    },
    {
        text: "When a new flu infects one human being, all are at risk...",
        sender: Sender.other,
    },
    { text: "abc", sender: Sender.me },
];
export default function Messaging() {
    const [messages, setMessages] = useState<Message[]>(messagesMock);
    const [input, setInput] = useState("");
    const [websocket, setWebsocket] = useState(null);

    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            text: input,
            sender: Sender.me,
        };

        setMessages((prev) => [...prev, newMessage]);
        websocket.send(input);
        setInput("");
    };

    useEffect(() => {
        let vet: Vet = getAuthenticatedVet();
        if (!websocket) {
            const connection = new Client({
                brokerURL: `ws://localhost:3000/ws-chat/websocket?userId=${vet.id}`,
                onConnect: () => {
                    console.log("connected :D ");
                    connection.publish({ destination: "/app/vet/online" });
                },
            });
            connection.onStompError = function (frame) {
                console.log(
                    "Broker reported error: " + frame.headers["message"],
                );
                console.log("Additional details: " + frame.body);
            };
            connection.activate();

            setWebsocket(connection);
        }
    }, []);

    console.log(websocket);

    return (
        <div className={styles.page}>
            <div className={styles.chat}>
                <div className={styles.chat_header}>
                    <h1 className={styles.chat_header_name}>Dr. Doctor</h1>
                    <span className={styles.chat_subheader}>
                        Chat about pet name
                    </span>
                </div>
                <div className={styles.chat_body}>
                    {messages.map((msg, index) => (
                        <div
                            className={styles["message_" + msg.sender]}
                            key={index}
                        >
                            {msg.text}
                        </div>
                    ))}
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
                        <Button size='xs' radius='xl' onClick={sendMessage}>
                            Send
                        </Button>
                    }
                />
            </div>
            <div className={styles.pet_profile}>
                <PetProfile id={"pbiTVPk5DfHe8NibJ3MK"} />
            </div>
        </div>
    );
}
