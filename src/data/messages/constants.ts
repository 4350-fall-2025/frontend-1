export function generateWebSocketUrl(id: string) {
    return `ws://localhost:3000/ws-chat/websocket?userId=${id}`;
}

export const websocketOwnerTopics = {
    availableVets: "/topic/online",
    onlineInit: "/user/queue/online-init",
    requestVet: "/app/vet/request",
    cancelRequest: "/app/owner/cancel",
    incomingRequests: "/user/queue/requests",
    sendChat: "/app/message",
    incomingChat: "/user/queue/message",
};

export const websocketVetTopics = {
    vetAnnounceOnline: "/app/vet/online",
    userRequests: "/user/queue/requests",
    acceptRequest: "/app/vet/accept",
    rejectRequest: "/app/vet/reject",
};

export interface RequestMessage {
    from: string;
    to: string;
    petId: string;
    status?: string;
}

export interface ChatMessage {
    from: string;
    to: string;
    message: string;
}

export enum RequestStatus {
    accepted = "ACCEPTED",
    rejected = "REJECTED",
    cancelled = "CANCELLED",
    pending = "PENDING",
}
