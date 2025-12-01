import { useState, useEffect } from "react";
import { Textarea, ActionIcon } from "@mantine/core";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import styles from "./chat.module.scss";
import { Client } from "@stomp/stompjs";
import { hasRole } from "~util/auth/authCookies";
import { UserRoles } from "~data/constants";
enum Sender {
    me = "me",
    other = "other",
}

// Lightweight interface instead of a class
interface Message {
    text: string;
    sender: Sender;
}

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
export default function Chat({ websocket }: { websocket: Client }) {
    const [messages, setMessages] = useState<Message[]>(messagesMock);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            text: input,
            sender: Sender.me,
        };
        console.log(input);

        setMessages((prev) => [...prev, newMessage]);
        //TODO: once the messaging socket is set up uncomment this code
        // websocket.publish({
        //     destination: null,
        //     body: input
        // });
        setInput("");
    };

    useEffect(() => {
        if (hasRole(UserRoles.owner)) {
            if (websocket != null) {
                websocket.subscribe("/topic/online", (msg) => {
                    setMessages((prev) => [
                        ...prev,
                        { text: msg.body, sender: Sender.other },
                    ]);
                });
            }
        }
    }, [websocket]);

    return (
        <div className={styles.chat}>
            <div className={styles.chat_header}>
                <h1 className={styles.chat_header_name}>Dr. Doctor</h1>
                <span className={styles.chat_subheader}>
                    Chat about pet name
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
