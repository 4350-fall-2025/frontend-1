"use client";
import {
    Badge,
    Box,
    Button,
    Card,
    Dialog,
    Modal,
    SimpleGrid,
} from "@mantine/core";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import { useEffect, useState, useRef } from "react";
import { ImageCheckbox } from "~components/imageCheckbox/imageCheckbox";
import { useRouter } from "next/navigation";
import { Pet } from "src/models/pet";
import { Owner } from "src/models/owner";
import { getAuthenticatedOwner } from "~util/auth/getAuthenticatedUser";
import { PetsAPI } from "~api/petsAPI";
import { generatePetURL, getImageURL } from "src/firebase";
import placeholderImage from "~public/placeholder.jpg";
import {
    RequestMessage,
    RequestStatus,
    websocketOwnerTopics,
} from "~data/messages/constants";
import { hasRole } from "~util/auth/authCookies";
import { UserRoles } from "~data/constants";
import { useSocket } from "~app/context/ChatContext";

export default function Messages() {
    const setupSub = useRef(false);
    const [vets, setVets] = useState([]);
    const [error, setError] = useState("");

    const [showConnectWithVetCard, setConnectWithVetCard] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    const router = useRouter();

    const [pets, setPets] = useState<Pet[]>([]);
    const [imageUrls, setImageUrls] = useState({});

    const [owner, setOwner] = useState<Owner | null>(null);
    useEffect(() => {
        let owner: Owner = getAuthenticatedOwner();
        setOwner(owner);
    }, []);

    const { websocket, currentPartner, petID } = useSocket();

    const [dialogVisible, setDialogVisible] = useState(false);

    const [sentRequest, setSentRequest] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const modalOpen = showConnectWithVetCard && sentRequest;

    const handleResponses = (msg) => {
        const request: RequestMessage = JSON.parse(msg.body);

        if (request.status == RequestStatus.accepted) {
            currentPartner.current = request.from;
            petID.current = request.petId;
            router.push("/owner/messages/chat");
        } else if (request.status == RequestStatus.rejected) {
            setDialogMessage(
                "The Vet rejected your request, please request again.",
            );
            setDialogVisible(true);

            setSentRequest(false);
            setVets(vets.slice(1));
        } else if (request.status == RequestStatus.cancelled) {
            if (vets[0] == request.from) {
                setSentRequest(false);
                setDialogMessage(
                    "The Vet has disconnected, please request again.",
                );
                setDialogVisible(true);
            }
            setVets((arr) => arr.filter((items) => items !== request.from));
        }
    };

    // TODO: maybe util for vet and owner, use parameter for from?
    const sendResponse = (vetID, status?: RequestStatus) => {
        const response = {
            from: owner.id,
            to: vetID,
            petId: selectedPetId,
            status: status,
        };

        websocket.publish({
            destination:
                status == RequestStatus.cancelled
                    ? websocketOwnerTopics.cancelRequest
                    : websocketOwnerTopics.requestVet,
            body: JSON.stringify(response),
            headers: { "content-type": "application/json" },
        });
    };

    const cancelVetSearch = () => {
        sendResponse(vets[0], RequestStatus.cancelled);
        setSentRequest(false);

        setVets(vets.slice(1));
    };

    const sendRequestToVet = () => {
        sendResponse(vets[0], null);
        setSentRequest(true);
    };

    useEffect(() => {
        if (hasRole(UserRoles.owner)) {
            if (websocket != null && !setupSub.current) {
                setupSub.current = true;
                // get an update whenever a vet comes online/offline
                websocket.subscribe(websocketOwnerTopics.onlineInit, (msg) => {
                    setVets(JSON.parse(msg.body));
                });
                websocket.subscribe(
                    websocketOwnerTopics.availableVets,
                    (msg) => {
                        setVets(JSON.parse(msg.body));
                    },
                );

                // get connect responses from the vets
                websocket.subscribe(
                    websocketOwnerTopics.incomingRequests,
                    (msg) => {
                        handleResponses(msg);
                    },
                );
            }
        }
    }, [websocket]);

    // Load pets when owner is available
    useEffect(() => {
        const fetchPets = async () => {
            if (owner?.id) {
                try {
                    const fetchedPets = await PetsAPI.getAllPets(owner.id);
                    setPets(fetchedPets);

                    const promises = [];
                    const images = {};

                    for (let pet of fetchedPets) {
                        promises.push(getPetImage(owner.id, pet, images));
                    }
                    await Promise.all(promises);

                    setPets(fetchedPets);
                    setImageUrls(images);
                } catch (error) {
                    setError(
                        "We can't retrieve all your pets. Please try again later.",
                    );
                }
            }
        };

        fetchPets();
    }, [owner]);

    const getPetImage = async (ownerId, pet: Pet, imageDict) => {
        try {
            const filePath = generatePetURL(ownerId, pet.id);
            const url = await getImageURL(filePath);
            imageDict[pet.id] = url;
        } catch (error) {
            imageDict[pet.id] = placeholderImage.src;
        }
    };

    const handlePetSelect = (petId: string) => {
        if (selectedPetId === petId) {
            // Deselect if clicking the same pet
            setSelectedPetId(null);
        } else {
            // Select the new pet
            setSelectedPetId(petId);
        }
    };

    const items = pets.map((pet) => (
        <ImageCheckbox
            disabled={selectedPetId !== null && selectedPetId !== pet.id}
            checked={selectedPetId === pet.id}
            onChange={() => handlePetSelect(pet.id)}
            description={pet.animalGroup.replaceAll("_", " ")}
            title={pet.name}
            image={imageUrls[pet.id]}
            key={pet.id}
        />
    ));

    return (
        <div className={styles.page}>
            <h1>Messages</h1>
            <p>Need help? Our vets are here to help.</p>

            <div className={styles.page_content}>
                <Card padding='sm'>
                    {/* Select a pet card content */}
                    {!showConnectWithVetCard && (
                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h2>Select a Pet</h2>
                            </div>

                            <p>
                                Tell us which pet you are chatting about so the
                                vet can review their history.
                            </p>
                            <SimpleGrid
                                spacing='md'
                                cols={{ base: 1, sm: 1, md: 2 }}
                            >
                                {items}
                            </SimpleGrid>

                            <Box mt='xl'>
                                <Button
                                    className={globalStyles.rose_button}
                                    disabled={selectedPetId === null}
                                    onClick={() => setConnectWithVetCard(true)}
                                >
                                    Next
                                </Button>
                            </Box>
                        </div>
                    )}

                    {/* Connect with a vet card content */}
                    {showConnectWithVetCard && (
                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h2>Connect with a Vet</h2>
                                <Badge variant='light' color='green'>
                                    {vets.length <= 1 &&
                                        vets.length + " vet online"}
                                    {vets.length > 1 &&
                                        vets.length + " vets online"}
                                </Badge>
                            </div>

                            <p>
                                Start a conversation with a QDOG vet about your
                                selected pet!
                            </p>

                            <div
                                className={
                                    globalStyles.cancel_or_save +
                                    " " +
                                    globalStyles.center
                                }
                            >
                                <Button
                                    color='grey'
                                    variant='outline'
                                    onClick={() => setConnectWithVetCard(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => sendRequestToVet()}
                                    disabled={vets.length <= 0}
                                >
                                    Connect
                                </Button>
                            </div>
                            {vets.length <= 0 && (
                                <p>Can't connect yet, no vets are online.</p>
                            )}
                        </div>
                    )}
                </Card>
                {error && <p className={globalStyles.error_message}>{error}</p>}

                <Dialog
                    opened={dialogVisible}
                    withCloseButton
                    onClose={() => setDialogVisible(false)}
                    size='lg'
                    radius='md'
                >
                    Notice: {dialogMessage}
                </Dialog>
            </div>
            <Modal
                opened={modalOpen}
                onClose={() => cancelVetSearch()}
                title='Connection Request'
                centered
                closeOnClickOutside={false}
            >
                We are looking for a vet for you... Please wait!
                <Button onClick={() => cancelVetSearch()}>Cancel</Button>
            </Modal>
        </div>
    );
}
