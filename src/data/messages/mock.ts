import { Message, Sender } from "~components/chat/chat";

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
