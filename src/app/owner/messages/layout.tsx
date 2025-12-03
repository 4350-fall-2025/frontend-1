import { ChatProvider } from "~app/context/ChatContext";

export default function ChatLayout({ children }) {
    return <ChatProvider>{children}</ChatProvider>;
}
