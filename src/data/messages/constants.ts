export function generateWebSocketUrl(id: string) {
    return `ws://localhost:3000/ws-chat/websocket?userId=${id}`;
}

export const websocketOwnerTopics = {
    availableVets: "/topic/online",
    onlineInit: "/user/queue/online-init",
};

export const websocketVetTopics = {
    vetAnnounceOnline: "/app/vet/online",
};
