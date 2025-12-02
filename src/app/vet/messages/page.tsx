"use client";
import { Badge, Button, Card, Modal, Dialog, Text } from "@mantine/core";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "~app/context/ChatContext";
import {
    RequestMessage,
    RequestStatus,
    websocketVetTopics,
} from "~data/messages/constants";
import { getAuthenticatedVet } from "~util/auth/getAuthenticatedUser";
import { Vet } from "src/models/vet";
import { useRouter } from "next/navigation";

const testRequest: RequestMessage = {
    from: "WawrgHPyixxQoKQtaOuT",
    to: "123",
    petId: "pbiTVPk5DfHe8NibJ3MK",
    status: RequestStatus.pending,
};

export default function MessagesPage() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [vet, setVet] = useState<Vet>(null);

    const [acceptedRequest, setAcceptedRequest] = useState(false);
    const [requests, setRequests] = useState<RequestMessage[]>([
        testRequest,
        testRequest,
    ]);
    const [cancelDialogVisible, setDialogVisible] = useState(false);
    const { websocket, currentPartner, petID } = useSocket();

    const modalOpen = requests.length > 0 && !acceptedRequest;

    const handleRequests = (msg) => {
        const request: RequestMessage = JSON.parse(msg.body);

        if (request.status == RequestStatus.pending) {
            setRequests((prev) => [...prev, request]);
        } else if (request.status == RequestStatus.accepted) {
            if (petID.current != null && petID.current == request.petId) {
                router.push("/vet/messages/chat");
            }
        } else if (request.status == RequestStatus.cancelled) {
            if (petID.current == request.petId) {
                setAcceptedRequest(false); //very unlikely outcome
            } else {
                setRequests((arr) =>
                    arr.filter((items) => items.petId !== request.petId),
                );
            }
        }
    };

    useEffect(() => {
        if (websocket != null) {
            websocket.publish({
                destination: websocketVetTopics.vetAnnounceOnline,
            });

            websocket.subscribe(websocketVetTopics.userRequests, (msg) => {
                handleRequests(msg);
            });
            console.log("subscribed");
        }
    }, [websocket]);

    useEffect(() => {
        try {
            const user: Vet = getAuthenticatedVet();
            setVet(user);
        } catch (error) {
            setError(error);
        }
    }, []);

    const sendResponse = (request: RequestMessage, status: RequestStatus) => {
        const response = {
            from: vet.id,
            to: request.from,
            petId: request.petId,
            status: status,
        };

        websocket.publish({
            destination:
                status == RequestStatus.accepted
                    ? websocketVetTopics.acceptRequest
                    : websocketVetTopics.rejectRequest,
            body: JSON.stringify(response),
            headers: { "content-type": "application/json" },
        });
    };

    const acceptRequest = () => {
        let request: RequestMessage = requests[0];
        sendResponse(request, RequestStatus.accepted);

        setAcceptedRequest(true);
        currentPartner.current = request.from;
        petID.current = request.petId;
        setRequests(requests.slice(1));
    };

    const rejectRequest = () => {
        sendResponse(requests[0], RequestStatus.rejected);

        setRequests(requests.slice(1));
    };

    return (
        <div className={styles.page}>
            <h1>Messages</h1>
            <p>Provide help to pets in need.</p>

            <div className={styles.page_content}>
                <Card padding='sm'>
                    <div className={styles.card}>
                        <div className={styles.card_title}>
                            <h2>Connect with a Pet</h2>
                            <Badge variant='light' color='green'>
                                {requests.length} requests in queue
                            </Badge>
                        </div>

                        <p>Please wait as we get you connected with a Pet.</p>
                        <Modal
                            opened={modalOpen}
                            onClose={() => rejectRequest()}
                            title='Connection Request'
                            centered
                            closeOnClickOutside={false}
                        >
                            A pet is in need!
                            <div
                                className={
                                    globalStyles.cancel_or_save +
                                    " " +
                                    globalStyles.center
                                }
                            >
                                <Button
                                    variant='light'
                                    onClick={() => acceptRequest()}
                                >
                                    accept
                                </Button>
                                <Button onClick={() => rejectRequest()}>
                                    reject
                                </Button>
                            </div>
                        </Modal>
                    </div>
                </Card>
                {error && <p className={globalStyles.error_message}>{error}</p>}
                <Dialog
                    opened={cancelDialogVisible}
                    withCloseButton
                    onClose={() => setDialogVisible(false)}
                    size='lg'
                    radius='md'
                >
                    <Text size='m' mb='xs' fw={500}>
                        Notice:
                    </Text>
                    The accepted client cancelled their appointment.
                </Dialog>
            </div>
        </div>
    );
}
