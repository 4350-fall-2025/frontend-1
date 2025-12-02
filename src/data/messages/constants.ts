export function generateWebSocketUrl(id: string) {
    return `ws://localhost:3000/ws-chat/websocket?userId=${id}`;
}

export const websocketOwnerTopics = {
    availableVets: "/topic/online",
    onlineInit: "/user/queue/online-init",
    sendRequest: "/app/owner/cancel",
    incomingRequests: "/user/queue/requests",
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

export enum RequestStatus {
    accepted = "ACCEPTED",
    rejected = "REJECTED",
    cancelled = "CANCELLED",
    pending = "PENDING",
}
