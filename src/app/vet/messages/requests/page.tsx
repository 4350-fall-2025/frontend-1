"use client";
import { Badge, Button, Card, Modal } from "@mantine/core";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useSocket } from "~app/context/ChatContext";
import {
    RequestMessage,
    RequestStatus,
    websocketVetTopics,
} from "~data/messages/constants";
import { getAuthenticatedVet } from "~util/auth/getAuthenticatedUser";
import { Vet } from "src/models/vet";

const testRequest: RequestMessage = {
    from: "Abc",
    to: "123",
    petId: "pbiTVPk5DfHe8NibJ3MK",
    status: RequestStatus.pending,
};

export default function MessagesPage() {
    const [error, setError] = useState(null);
    const [vet, setVet] = useState<Vet>(null);

    const [opened, { toggle, close }] = useDisclosure(false);
    const [acceptedRequest, setAcceptedRequest] = useState(false);
    const [requests, setRequests] = useState<RequestMessage[]>([]);
    const { websocket, currentPartner, setCurrentPartner, petID, setPetID } =
        useSocket();

    const modalOpen = requests.length > 0 && acceptedRequest == false;

    useEffect(() => {
        if (websocket != null) {
            try {
                websocket.publish({
                    destination: websocketVetTopics.vetAnnounceOnline,
                });

                websocket.subscribe(websocketVetTopics.userRequests, (msg) => {
                    const request: RequestMessage = JSON.parse(msg.body);
                    console.log(msg.body);

                    if (request.status == RequestStatus.pending) {
                        setRequests((prev) => [...prev, request]);
                    } else if (request.status == RequestStatus.accepted) {
                        console.log("yippee we made it!");
                        if (currentPartner == null) {
                            setCurrentPartner(request.to);
                            setPetID(request.petId);
                        }
                        //navigate to the next page
                    } else if (request.status == RequestStatus.cancelled) {
                        //reopen modal if theres another in queue
                    }
                });
                console.log("subscribed");
            } catch (e) {
                console.log(typeof websocket);
            }
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

    const generateResponse = (request: RequestMessage): RequestMessage => {
        return {
            from: vet.id,
            to: request.from,
            petId: request.petId,
        };
    };

    const acceptRequest = () => {
        let request: RequestMessage = requests.pop();
        let response: RequestMessage = generateResponse(request);
        response["status"] = RequestStatus.accepted;
        setAcceptedRequest(true);

        websocket.publish({
            destination: websocketVetTopics.acceptRequest,
            body: response,
            headers: { "content-type": "application/json" },
        });
    };

    const rejectRequest = () => {
        let request: RequestMessage = requests.pop();
        let response: RequestMessage = generateResponse(request);
        response["status"] = RequestStatus.rejected;

        websocket.publish({
            destination: websocketVetTopics.acceptRequest,
            body: response,
            headers: { "content-type": "application/json" },
        });
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
                        <Button onClick={toggle}>Toggle dialog</Button>
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
            </div>
        </div>
    );
}
